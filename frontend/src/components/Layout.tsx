import { ReactNode } from 'react';
import { NavLink } from '@/components/NavLink';
import { Wind, FileText, Map, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialogs } from './AuthDialogs';
import { LocationPrompt } from './LocationPrompt';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Wind className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AirWatch</h1>
                <p className="text-xs text-muted-foreground">Real-time Air Quality</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-secondary/30 rounded-xl p-1">
              <NavLink
                to="/"
                end
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="bg-background text-foreground shadow-sm"
              >
                <Wind className="w-4 h-4" />
                Dashboard
              </NavLink>
              <NavLink
                to="/reports"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="bg-background text-foreground shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Reports
              </NavLink>
              <NavLink
                to="/map"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="bg-background text-foreground shadow-sm"
              >
                <Map className="w-4 h-4" />
                Map
              </NavLink>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-secondary/50 rounded-full">
                <div className="w-2 h-2 rounded-full bg-aqi-safe animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>

              {/* Auth dialogs (register / login) */}
              <div className="hidden sm:flex items-center">
                <AuthDialogs />
              </div>

              {/* Small mobile sign in as an icon */}
              <div className="sm:hidden">
                <AuthDialogs />
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center gap-1 mt-3 bg-secondary/30 rounded-xl p-1">
            <NavLink
              to="/"
              end
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="bg-background text-foreground shadow-sm"
            >
              <Wind className="w-4 h-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/reports"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="bg-background text-foreground shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Reports
            </NavLink>
            <NavLink
              to="/map"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="bg-background text-foreground shadow-sm"
            >
              <Map className="w-4 h-4" />
              Map
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Location prompt (asks user to enable location on first load) */}
      <LocationPrompt />

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Data refreshes every 5 minutes
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            © 2024 AirWatch • Powered by Open-Meteo & MQ-135 Sensors
          </p>
        </div>
      </footer>
    </div>
  );
};
