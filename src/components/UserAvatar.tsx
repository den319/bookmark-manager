import { User } from "@supabase/supabase-js";

type Props = {
  user: User;
};

export default function UserAvatar({ user }: Props) {
  const avatar = "/avatar.jpeg";

  return (
    <div className="flex items-center gap-3">
      <img
        src={avatar}
        alt="avatar"
        className="w-8 h-8 rounded-full object-cover"
      />

      <span className="text-sm text-gray-300">
        {user.email}
      </span>
    </div>
  );
}
