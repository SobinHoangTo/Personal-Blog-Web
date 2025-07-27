import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  XMarkIcon,
  Bars3Icon,
  HomeIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/outline";
import { getUnreadNotifications, getAllNotifications } from "@/lib/api";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
}

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: Readonly<NavItemProps>) {
  return (
    <li>
      <Typography
        as="a"
        href={href || "#"}
        variant="paragraph"
        color="gray"
        className="flex items-center gap-2 font-medium text-gray-900">
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);

  // Fetch unread notifications on mount if authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      fetch(`/api/Notifications/unread?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setNotifications(data);
          setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
        });
    }
  }, [isAuthenticated, user]);

  // Fetch notifications when dropdown is opened
  const handleNotifOpen = async () => {
    setNotifOpen(true);
    if (isAuthenticated) {
      const notis = await getUnreadNotifications();
      setNotifications(notis);
      setShowAll(false);
    }
  };

  // Handler to fetch all notifications
  const handleShowAllNotifications = async () => {
    if (isAuthenticated) {
      const all = await getAllNotifications();
      setNotifications(all);
      setShowAll(true);
    }
  };

  const handleOpen = () => setOpen((cur) => !cur);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  React.useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 960) setOpen(false);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (
    <MTNavbar shadow={false} fullWidth className="border-0 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Typography
          as="a"
          href="/"
          color="blue-gray"
          className="text-lg font-bold" >
          BlogWeb
        </Typography>
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          <NavItem href={`/`}>
            <HomeIcon className="h-5 w-5" />
            Home
          </NavItem>

          {isAuthenticated && user && (user.role === "0" || user.role === "2") && (
            <NavItem href="/admin/categories">
              <TagIcon className="h-5 w-5" />
              Categories
            </NavItem>
          )}
          {isAuthenticated && user && (user.role === "0" || user.role === "2") && (
            <NavItem href="/admin/posts">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Manage Posts
            </NavItem>
          )}
          {isAuthenticated && user && user.role === "0" && (
            <NavItem href="/admin/accounts">
              <UserCircleIcon className="h-5 w-5" />
              Manage Accounts
            </NavItem>
          )}
          {isAuthenticated && user && (
            <NavItem href={`/user/${user.id}`}>
              <UserCircleIcon className="h-5 w-5" />
              Profile
            </NavItem>
          )}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.avatar && (
                <Avatar
                  src={user.avatar}
                  alt={user.fullName}
                  size="sm"
                  className="ring-2 ring-blue-500/20"
                />
              )}
              <Typography variant="small" color="blue-gray">
                Welcome, {user?.fullName}!
              </Typography>
              <Button 
                variant="text" 
                color="red"
                onClick={handleLogout}
              >
                Logout
              </Button>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  className="relative focus:outline-none"
                  onClick={handleNotifOpen}
                  onBlur={() => setNotifOpen(false)}
                >
                  <BellIcon className="h-6 w-6 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b font-semibold flex justify-between items-center">
                      <span>Notifications</span>
                      {!showAll && notifications.length > 0 && (
                        <button
                          className="text-xs text-blue-600 hover:underline"
                          onClick={handleShowAllNotifications}
                        >
                          Show all
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500">No notifications</div>
                    ) : (
                      notifications.map(noti => (
                        <div
                          key={noti.id}
                          className={`p-4 border-b text-black last:border-b-0 ${noti.isRead ? "bg-white" : "bg-blue-50"}`}
                        >
                          {noti.message}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <a href="/login">
                <Button variant="text">Sign In</Button>
              </a>
              <a href="/register">
                <Button color="gray">Register</Button>
              </a>
            </>
          )}
        </div>
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
              <NavItem href="/">
                <HomeIcon className="h-5 w-5" />
                Home
              </NavItem>
            {isAuthenticated && user && (user.role === "0" || user.role === "2") && (
              <NavItem href="/admin/categories">
                <TagIcon className="h-5 w-5" />
                Categories
              </NavItem>
            )}
            {isAuthenticated && user && (user.role === "0" || user.role === "2") && (
              <NavItem href="/admin/posts">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Manage Posts
              </NavItem>
            )}
            {isAuthenticated && user && user.role === "0" && (
              <NavItem href="/admin/accounts">
                <UserCircleIcon className="h-5 w-5" />
                Manage Accounts
              </NavItem>
            )}
            {isAuthenticated && user && (
              <NavItem href={`/user/${user.id}`}>
                <UserCircleIcon className="h-5 w-5" />
                Profile
              </NavItem>
            )}
            {/* Notification Bell */}
          </ul>
          <div className="mt-6 mb-4 flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 w-full">
                {user?.avatar && (
                  <div className="flex justify-center">
                    <Avatar
                      src={user.avatar}
                      alt={user.fullName}
                      size="md"
                      className="ring-2 ring-blue-500/20"
                    />
                  </div>
                )}
                <Typography variant="small" color="blue-gray" className="text-center">
                  Welcome, {user?.fullName}!
                </Typography>
                <Button 
                  variant="text" 
                  color="red"
                  onClick={handleLogout}
                  fullWidth
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <a href="/login" className="flex-1">
                  <Button variant="text" fullWidth>Sign In</Button>
                </a>
                <a href="/register" className="flex-1">
                  <Button color="gray" fullWidth>Register</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
