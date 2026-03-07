'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Dumbbell,
  UserCheck,
  Package,
  LogOut,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
    description: 'Overview and analytics'
  },
  {
    title: 'Members',
    href: '/admin/members',
    icon: Users,
    description: 'Manage gym members'
  },
  {
    title: 'Membership Plans',
    href: '/admin/plans',
    icon: Package,
    description: 'Create and manage plans'
  },
  {
    title: 'Events',
    href: '/admin/events',
    icon: Calendar,
    description: 'Manage events and classes'
  },
  {
    title: 'Attendance',
    href: '/admin/attendance',
    icon: UserCheck,
    description: 'Track member attendance'
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
    description: 'Payment history and billing'
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    description: 'Analytics and insights'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Gym settings and preferences'
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">B Gym Admin</h2>
                <p className="text-sm text-muted-foreground">Management Panel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer relative",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full" />
                    )}
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        isActive ? "text-primary-foreground" : "text-foreground"
                      )}>
                        {item.title}
                      </p>
                      <p className={cn(
                        "text-xs truncate",
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">Administrator</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {sidebarItems.find(item => item.href === pathname)?.title || 'Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {sidebarItems.find(item => item.href === pathname)?.description || 'Welcome back!'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Welcome back,</span>
                <span className="font-medium text-foreground">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}