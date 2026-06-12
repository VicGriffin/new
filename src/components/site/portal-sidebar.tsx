import { Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, BookOpen, Library, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortalSidebarProps {
  user?: { email?: string } | null;
  profile?: { full_name?: string | null } | null;
  onSignOut: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  open?: boolean; // mobile drawer
  onOpen?: () => void;
  onClose?: () => void;
  selected?: string;
  onSelect?: (key: string) => void;
}

export function PortalSidebar({ user, profile, onSignOut, collapsed = false, onToggleCollapse, open = false, onOpen, onClose, selected, onSelect }: PortalSidebarProps) {
  const location = useLocation();

  const menuItems = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "enrollments", label: "My Enrollments", icon: BookOpen },
    { key: "resources", label: "Resources", icon: Library },
    { key: "profile", label: "Profile", icon: User },
  ];

  const isActiveKey = (key: string) => selected === key;

  return (
    <aside
      className={cn(
        "bg-white border-r border-border h-screen fixed top-0 left-0 z-50 flex flex-col transition-all",
        collapsed ? "w-16" : "w-64",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
      aria-hidden={!open && typeof onOpen === "function"}
    >
      {/* Logo/Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className={cn("text-xl font-bold text-navy", collapsed ? "hidden" : "block")}>
          Menu
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleCollapse && onToggleCollapse()}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-2 rounded hover:bg-gray-100"
          >
            {/* simple chevron icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={collapsed ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => (open ? onClose && onClose() : onOpen && onOpen())}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-2" aria-label="Main navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveKey(item.key);
          return (
            <button
              key={item.key}
              onClick={() => onSelect && onSelect(item.key)}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-medical",
                active ? "bg-emerald-brand text-white" : "text-muted-foreground hover:bg-gray-100 hover:text-navy",
                collapsed ? "justify-center" : "justify-start",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Profile Section (Bottom) */}
      <div className="border-t border-border p-4 space-y-2">
        <button
          onClick={() => {
            // Navigate to profile edit
            window.location.hash = "#edit-profile";
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-gray-100 hover:text-navy transition-colors"
        >
          <User className="size-5" />
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Profile</div>
            <div className="font-semibold text-navy truncate">
              {profile?.full_name || user?.email || "User"}
            </div>
          </div>
        </button>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="size-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
