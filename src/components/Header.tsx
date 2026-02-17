type Props = {
  onLogout: () => void;
};

export default function Header({ onLogout }: Props) {
  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold">
          Bookmark Manager
        </h1>

        <button
          onClick={onLogout}
          className="font-semibold bg-red-600 px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
