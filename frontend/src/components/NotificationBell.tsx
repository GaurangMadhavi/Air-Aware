import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export function NotificationBell() {
  const { notifications } = useNotifications();

  return (
    <div className="relative">
      <Bell className="w-6 h-6" />
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
          {notifications.length}
        </span>
      )}
    </div>
  );
}
