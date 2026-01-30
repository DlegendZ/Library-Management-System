import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Library, 
  Users, 
  BookOpen, 
  FolderOpen, 
  FileText, 
  DollarSign, 
  LogOut,
  Menu,
  User,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <Library className="h-4 w-4" /> },
  { label: 'Users', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
  { label: 'Books', href: '/admin/books', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Categories', href: '/admin/categories', icon: <FolderOpen className="h-4 w-4" /> },
  { label: 'Borrow Records', href: '/admin/borrow-records', icon: <FileText className="h-4 w-4" /> },
  { label: 'Fine Records', href: '/admin/fine-records', icon: <DollarSign className="h-4 w-4" /> },
  { label: 'Register Admin', href: '/admin/register-admin', icon: <UserPlus className="h-4 w-4" /> },
  { label: 'Register Librarian', href: '/admin/register-librarian', icon: <UserPlus className="h-4 w-4" /> },
];

const librarianNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/librarian', icon: <Library className="h-4 w-4" /> },
  { label: 'Members', href: '/librarian/members', icon: <Users className="h-4 w-4" /> },
  { label: 'Add Book', href: '/librarian/add-book', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Borrow Records', href: '/librarian/borrow-records', icon: <FileText className="h-4 w-4" /> },
  { label: 'Fine Records', href: '/librarian/fine-records', icon: <DollarSign className="h-4 w-4" /> },
  { label: 'Register Member', href: '/librarian/register-member', icon: <UserPlus className="h-4 w-4" /> },
];

const memberNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/member', icon: <Library className="h-4 w-4" /> },
  { label: 'Browse Books', href: '/member/books', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'My Borrows', href: '/member/my-borrows', icon: <FileText className="h-4 w-4" /> },
  { label: 'My Fines', href: '/member/my-fines', icon: <DollarSign className="h-4 w-4" /> },
];

const DashboardLayout: React.FC = () => {
  const { user, logout, getRoleName } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const getNavItems = (): NavItem[] => {
    switch (user?.role_id) {
      case 1:
        return adminNavItems;
      case 2:
        return librarianNavItems;
      case 3:
        return memberNavItems;
      default:
        return [];
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Library className="h-6 w-6 text-primary" />
            <span className="font-semibold hidden sm:inline">Library Management System</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{getRoleName()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-muted-foreground">
                  Role: {getRoleName()}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform duration-200',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 p-6 transition-[margin] duration-200',
            sidebarOpen ? 'ml-64' : 'ml-0'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
