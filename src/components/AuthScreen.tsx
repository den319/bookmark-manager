type Props = {
  onSignIn: () => void;
};

export default function AuthScreen({ onSignIn }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <button
        onClick={onSignIn}
        className="w-full max-w-sm bg-white text-black px-6 py-3 rounded-lg hover:opacity-90 cursor-pointer"
      >
        Sign in with Google
      </button>
    </main>
  );
}
