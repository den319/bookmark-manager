type Props = {
  title: string;
  url: string;
  actionLoading: boolean;
  onTitleChange: (v: string) => void;
  onUrlChange: (v: string) => void;
  onAdd: () => void;
};

export default function AddBookmarkForm({
  title,
  url,
  actionLoading,
  onTitleChange,
  onUrlChange,
  onAdd,
}: Props) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow space-y-3">
      <h2 className="font-semibold">Add Bookmark</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />

      <input
        type="text"
        placeholder="https://example.com"
        className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
      />

      <button
        onClick={onAdd}
        disabled={actionLoading}
        className="w-full sm:w-auto bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
      >
        Add Bookmark
      </button>
    </div>
  );
}
