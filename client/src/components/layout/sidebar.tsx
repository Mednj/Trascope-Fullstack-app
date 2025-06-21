import { Link, useLocation } from "wouter";
import { CreditCard, BarChart3, ArrowRightLeft, Store, Tablet, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowRightLeft,
  },
  {
    name: "Sites",
    href: "/sites",
    icon: Store,
  },
  {
    name: "POS Devices",
    href: "/devices",
    icon: Tablet,
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">Transcope</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-1 transition-colors duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.merchantName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
