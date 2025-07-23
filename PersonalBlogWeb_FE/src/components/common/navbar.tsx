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
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

const NAV_MENU = [
  {
    name: "Home",
    icon: HomeIcon,
    href: "/",
  },
  {
    name: "Post Detail",
    icon: ChatBubbleLeftRightIcon,
    href: "/post-detail",
  },
];

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
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href}>
              <Icon className="h-5 w-5" />
              {name}
            </NavItem>
          ))}
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
                  alt={user.username}
                  size="sm"
                  className="ring-2 ring-blue-500/20"
                />
              )}
              <Typography variant="small" color="blue-gray">
                Welcome, {user?.username}!
              </Typography>
              <Button 
                variant="text" 
                color="red"
                onClick={handleLogout}
              >
                Logout
              </Button>
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
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
            {isAuthenticated && user && (
              <NavItem href={`/user/${user.id}`}>
                <UserCircleIcon className="h-5 w-5" />
                Profile
              </NavItem>
            )}
          </ul>
          <div className="mt-6 mb-4 flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 w-full">
                {user?.avatar && (
                  <div className="flex justify-center">
                    <Avatar
                      src={user.avatar}
                      alt={user.username}
                      size="md"
                      className="ring-2 ring-blue-500/20"
                    />
                  </div>
                )}
                <Typography variant="small" color="blue-gray" className="text-center">
                  Welcome, {user?.username}!
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
