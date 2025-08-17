import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Home,
  History,
  Plus,
  User,
  Shield,
  Mail,
  Phone,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/shared/hooks/useRole";
import { useKeycloak } from "@/shared/hooks/useKeycloak";
import Logo from "../../../assets/logo.png";

export default function Navigation() {
  const { user, logout } = useKeycloak();
  const { hasRole } = useRole();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const userNavItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/events", icon: Calendar, label: "Events" },
    { to: "/registrations", icon: History, label: "My Registrations" },
  ];

  const adminNavItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/events", icon: Calendar, label: "Events" },
    { to: "/event-creation", icon: Plus, label: "Create" },
  ];

  const navItems = hasRole("Admin") ? adminNavItems : userNavItems;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    setShowMobileMenu(false);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            <img src={Logo} alt="Eventora Logo" className="relative" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            Eventora
          </span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link key={to} to={to}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2 font-medium h-9 xl:h-10 px-3 xl:px-5 rounded-lg",
                    isActive
                      ? "bg-blue-100 text-black shadow-sm"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className={cn(
                "flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50",
                showUserDropdown && "bg-gray-50 shadow",
              )}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm font-medium">
                  {user.name?.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 hidden sm:block max-w-24 lg:max-w-32 xl:max-w-none truncate">
                {user.name}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400",
                  showUserDropdown && "rotate-180",
                )}
              />
            </button>

            {showUserDropdown && (
              <Card className="absolute right-0 top-full mt-2 w-72 sm:w-80 border border-gray-200 shadow-lg rounded-xl bg-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {hasRole("Admin") ? (
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                        ) : (
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs mt-1",
                            hasRole("Admin")
                              ? "border-red-300 text-red-700"
                              : "border-gray-300 text-gray-700",
                          )}
                        >
                          {hasRole("Admin") ? "Administrator" : "User"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      {user.email && (
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      )}
                      {user.phone_number && (
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{user.phone_number}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {showMobileMenu && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg"
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map(({ to, icon: Icon, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link key={to} to={to} onClick={closeMobileMenu}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start space-x-3 font-medium h-12 px-4 rounded-lg",
                        isActive
                          ? "bg-blue-100 text-black shadow-sm"
                          : "text-gray-700 hover:text-blue-700 hover:bg-blue-50",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
