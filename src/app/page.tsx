"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

import LoadingScreen from "@/components/LoadingScreen";
import AuthScreen from "@/components/AuthScreen";
import Header from "@/components/Header";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import UserAvatar from "@/components/UserAvatar";
import Notification from "@/components/Notification";
import next from "next";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

const PAGE_SIZE = 20;


export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);


  // AUTH
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // FETCH
  const fetchBookmarks = async (pageToLoad = 0, append = false) => {
    if (dataLoading) return;

    setDataLoading(true);

    const from = pageToLoad * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      showError(error.message);
    } else {
      setBookmarks(data ?? []);
      setTotalCount(count ?? 0);
    }

    setDataLoading(false);
  };

  // REALTIME
  useEffect(() => {
    if (!user) return () => {};

    fetchBookmarks(0);

    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookmarks" },
        () => {
          fetchBookmarks(page);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bookmarks" },
        () => {
          fetchBookmarks(page);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // Re-fetch when page changes
  useEffect(() => {
    if (user) fetchBookmarks(page);
  }, [page]);

  // ADD
  const addBookmark = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      new URL(url);
    } catch {
      showError("Please enter a valid URL");
      return;
    }

    setActionLoading(true);

    const { error } = await supabase
      .from("bookmarks")
      .insert({ title, url, user_id: user!.id });

    if (error) {
      showError(error.message);
    } else {
      setTitle("");
      setUrl("");
      // New bookmark goes to top — jump to page 0
      setPage(0);
      fetchBookmarks(0);
    }

    setActionLoading(false);
  };

  // DELETE
  const deleteBookmark = async (id: string) => {
    const item = bookmarks.find((b) => b.id === id);
    if (!item) return;

    // Optimistic remove from UI
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    setTotalCount((prev) => prev - 1);

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      // Rollback if DB delete fails
      setBookmarks((prev) => [item, ...prev]);
      setTotalCount((prev) => prev + 1);
      showError(error.message);
      return;
    }

    showSuccess("Bookmark deleted successfully!");

    if (bookmarks.length === 1 && page > 0) {
      setPage((p) => p - 1);
    } else {
      fetchBookmarks(page);
    }
  };


  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    showSuccess("URL copied to clipboard");
  };

  const signIn = () =>
    supabase.auth.signInWithOAuth({ provider: "google" });

  const signOut = () => supabase.auth.signOut();

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage("");
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // UI STATES
  if (authLoading) return <LoadingScreen />;
  if (!user) return <AuthScreen onSignIn={signIn} />;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onLogout={signOut} />

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <UserAvatar user={user} />

        <AddBookmarkForm
          title={title}
          url={url}
          actionLoading={actionLoading}
          onTitleChange={setTitle}
          onUrlChange={setUrl}
          onAdd={addBookmark}
          setTitle={(v) => setTitle(v)}
          setUrl={(v) => setUrl(v)}
        />

        <Notification
          error={errorMessage}
          success={successMessage}
        />

        <BookmarkList
          bookmarks={bookmarks}
          dataLoading={dataLoading}
          actionLoading={actionLoading}
          onCopy={handleCopy}
          onDelete={deleteBookmark}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-6">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || dataLoading}
              className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-40 hover:bg-gray-700 transition-colors"
            >
              Prev
            </button>

            <span className="text-gray-400 text-sm">
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || dataLoading}
              className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-40 hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {totalCount === 0 && !dataLoading && (
          <p className="text-center text-gray-600 py-6">No bookmarks yet</p>
        )}
      </main>
    </div>
  );
}
