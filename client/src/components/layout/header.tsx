import { Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  breadcrumb?: string;
}

export function Header({ title, breadcrumb = "Dashboard" }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <nav className="text-sm text-gray-500 mt-1">
            <span>Merchant Portal</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{breadcrumb}</span>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-4 h-4 text-gray-400" />
          </Button>
          <div className="text-right">
            <div className="flex items-center text-sm font-medium text-gray-900">
              <Calendar className="w-4 h-4 mr-1" />
              Today
            </div>
            <p className="text-xs text-gray-500">{currentDate}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
