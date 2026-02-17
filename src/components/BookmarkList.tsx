import BookmarkItem from "./BookmarkItem";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

type Props = {
  bookmarks: Bookmark[];
  dataLoading: boolean;
  actionLoading: boolean;
  onCopy: (url: string) => void;
  onDelete: (id: string) => void;
};

export default function BookmarkList({
  bookmarks,
  dataLoading,
  actionLoading,
  onCopy,
  onDelete,
}: Props) {
  if (dataLoading) {
    return (
      <p className="text-center text-gray-400">
        Loading bookmarks...
      </p>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No bookmarks yet 👆
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((b) => (
        <BookmarkItem
          key={b.id}
          bookmark={b}
          actionLoading={actionLoading}
          onCopy={() => onCopy(b.url)}
          onDelete={() => onDelete(b.id)}
        />
      ))}
    </div>
  );
}
