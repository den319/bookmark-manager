type Props = {
  error?: string;
  success?: string;
};

export default function Notification({ error, success }: Props) {
  return (
    <>
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-2 rounded">
          {success}
        </div>
      )}
    </>
  );
}
