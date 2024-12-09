
interface ProfileInfoProps {
  name: string;
  username: string;
  bio: string;
}

export function ProfileInfo({ name, username, bio }: ProfileInfoProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-100 truncate "style={{marginBottom:'0px'}} >{name}</h2>
      <p className="text-xs text-gray-400 truncate">@{username}</p>
      <p className="mt-1 text-xs text-gray-300 line-clamp-2" style={{display:'none'}}>{bio}</p>
    </div>
  );
}