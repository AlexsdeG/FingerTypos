
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, User, Settings, Dumbbell, Map, HelpCircle, Github } from 'lucide-react';
import { useProfileStore } from '../../features/profile/store/profileStore';
import { SettingsModal } from '../../features/profile/components/SettingsModal';
import { HelpModal } from '../ui/HelpModal';
import { cn } from '../../utils/cn';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { activeProfileId, profiles } = useProfileStore();
  const profile = activeProfileId ? profiles[activeProfileId] : null;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Check if we are in Game Mode (Play route)
  const isGameMode = location.pathname.startsWith('/play');

  const NavItem = ({ to, icon: Icon, label, disabled }: { to: string; icon: any; label: string; disabled?: boolean }) => {
    // Active if current path starts with link (e.g. /campaign active on /campaign/1)
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

    if (disabled) {
      return (
        <div className="w-full flex flex-col items-center justify-center p-2 rounded-lg text-slate-700 cursor-not-allowed opacity-50">
          <Icon size={24} className="mb-1" />
          <span className="text-xs font-medium">{label}</span>
        </div>
      );
    }

    return (
      <Link
        to={to}
        className={cn(
          "w-full flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
          isActive
            ? 'text-brand-400 bg-brand-900/20'
            : 'text-slate-400 hover:text-brand-300 hover:bg-slate-800'
        )}
      >
        <Icon size={24} className="mb-1" />
        <span className="text-xs font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col">
      {/* Header - Hide in Game Mode */}
      {!isGameMode && (
        <header className="h-16 border-b border-slate-700 bg-dark-surface flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <img src="/FingerTypos_Logo.png" alt="FingerTypos Logo" className="w-10 h-10 object-contain rounded-lg shadow-lg shadow-brand-500/10" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent hidden md:block">
              FingerTypos
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {profile ? (
              <div className="flex items-center gap-4 bg-slate-800 py-1.5 px-4 rounded-full border border-slate-700">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-white">{profile.name}</span>
                  <span className="text-xs text-brand-400">Lvl {profile.level} • {profile.rank}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">
                  {profile.name[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400 italic">Select a profile</div>
            )}

            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
              title="Help & Guide"
              aria-label="Open Help"
            >
              <HelpCircle size={24} />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              disabled={!profile}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              title="Settings"
              aria-label="Open Settings"
            >
              <Settings size={24} />
            </button>

            <a
              href="https://github.com/AlexsdeG/FingerTypos"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:bg-white/10"
              title="GitHub Repository"
            >
              <Github size={24} />
            </a>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 container mx-auto p-6 max-w-6xl pb-24 md:pb-6 transition-all duration-300",
        // Add padding left for sidebar ONLY if not in Game Mode
        !isGameMode ? "md:pl-28" : "pl-6"
      )}>
        {children}
      </main>

      {/* Bottom Navigation (Mobile) - Hide in Game Mode */}
      {!isGameMode && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-dark-surface border-t border-slate-700 flex items-center justify-around px-4 md:hidden z-50">
          <NavItem to="/" icon={User} label="Profile" />
          <NavItem to="/campaign" icon={Map} label="Campaign" disabled={!profile} />
          <NavItem to="/training" icon={Dumbbell} label="Train" disabled={!profile} />
          <NavItem to="/results" icon={BarChart2} label="Stats" disabled={!profile} />
        </nav>
      )}

      {/* Desktop Side Navigation - Hide in Game Mode */}
      {!isGameMode && (
        <nav className="fixed left-0 top-16 bottom-0 w-20 bg-dark-surface border-r border-slate-700 hidden md:flex flex-col items-center py-6 gap-6 z-40">
          <NavItem to="/" icon={User} label="Home" />
          <NavItem to="/campaign" icon={Map} label="Campaign" disabled={!profile} />
          <NavItem to="/training" icon={Dumbbell} label="Train" disabled={!profile} />
          <NavItem to="/results" icon={BarChart2} label="Stats" disabled={!profile} />
        </nav>
      )}

      {/* Modals */}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
};

export default MainLayout;
