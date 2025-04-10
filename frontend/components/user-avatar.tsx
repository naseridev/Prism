import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  image?: string
  className?: string
}

export default function UserAvatar({ name, image, className }: UserAvatarProps) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className={cn("flex items-center justify-center rounded-md bg-zinc-800 text-white", className)}>
      {image ? (
        <img src={image || "/placeholder.svg"} alt={name} className="h-full w-full rounded-md object-cover" />
      ) : (
        <span className="text-xs font-medium">{initials}</span>
      )}
    </div>
  )
}
