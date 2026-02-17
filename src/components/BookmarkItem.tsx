type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

type Props = {
  bookmark: Bookmark;
  actionLoading: boolean;
  onCopy: () => void;
  onDelete: () => void;
};

export default function BookmarkItem({
  bookmark,
  actionLoading,
  onCopy,
  onDelete,
}: Props) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="break-all">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-400 hover:underline"
        >
          {bookmark.title}
        </a>

        <p className="text-sm text-gray-400">{bookmark.url}</p>

        <p className="text-xs text-gray-500">
          {new Date(bookmark.created_at).toLocaleString()}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCopy}
          className="text-sm px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 cursor-pointer"
        >
          Copy
        </button>

        <button
          onClick={onDelete}
          disabled={actionLoading}
          className="text-sm px-3 py-1 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
