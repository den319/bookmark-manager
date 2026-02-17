type Props = {
  title: string;
  url: string;
  actionLoading: boolean;
  onTitleChange: (v: string) => void;
  onUrlChange: (v: string) => void;
  onAdd: () => void;
  setTitle: (v:string) => void;
  setUrl: (v:string) => void;
};

export default function AddBookmarkForm({
  title,
  url,
  actionLoading,
  onTitleChange,
  onUrlChange,
  onAdd,
  setTitle,
  setUrl
}: Props) {
  const fetchTitle = async (inputUrl: string) => {
    try {
      const res = await fetch(
        `https://textise.net/showtext.aspx?strURL=${encodeURIComponent(inputUrl)}`
      );

      const text = await res.text();
      const match = text.match(/<title>(.*?)<\/title>/i);

      if (match?.[1]) {
        setTitle(match[1]);
      }
    } catch {}
  };

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
        onChange={(e) => setUrl(e.target.value)}
        onBlur={() => {
          if (!title && url) fetchTitle(url);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") onAdd();
        }}
      />

      <button
        onClick={onAdd}
        onKeyDown={(e) => {
          if (e.key === "Enter") onAdd();
        }}
        disabled={actionLoading}
        className="w-full sm:w-auto bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
      >
        Add Bookmark
      </button>
    </div>
  );
}
