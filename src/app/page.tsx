"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

import LoadingScreen from "@/components/LoadingScreen";
import AuthScreen from "@/components/AuthScreen";
import Header from "@/components/Header";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import UserAvatar from "@/components/UserAvatar";
import Notification from "@/components/Notification";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

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
  const fetchBookmarks = async (showLoader = true) => {
    if (showLoader) setDataLoading(true);

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setErrorMessage(error.message);
    else setBookmarks(data || []);

    if (showLoader) setDataLoading(false);
  };

  // REALTIME
  useEffect(() => {
    if (!user) return() => {};

    fetchBookmarks(true);

    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks(false)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

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

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user!.id,
    });

    if (error) showError(error.message);

    setTitle("");
    setUrl("");
    fetchBookmarks(false);
    setActionLoading(false);
  };

  // DELETE
  const deleteBookmark = async (id: string) => {
    setActionLoading(true);

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) showError(error.message);

    fetchBookmarks(false);
    setActionLoading(false);
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
      </main>
    </div>
  );
}
