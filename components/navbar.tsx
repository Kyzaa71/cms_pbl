import { Sun, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-3">
      <Button variant="outline">Filter Data ▼</Button>
      <div className="flex items-center space-x-3">
        <Button variant="outline" className="flex items-center gap-1">
          <Sun size={16} /> Dark Mode
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <Zap size={16} /> Quick Access
        </Button>
        <div className="flex items-center bg-blue-500 text-white rounded-md px-3 py-1 text-sm">
          <User size={16} className="mr-2" /> Welcome Back, Your Name
        </div>
      </div>
    </header>
  );
}
