
import React, { useState } from 'react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { useProfileStore, getLevelProgress, calculateRank } from './features/profile/store/profileStore';
import { GameStage } from './features/engine/components/GameStage';
import { CampaignMenu } from './features/campaign/components/CampaignMenu';
import { TrainingMenu } from './features/training/components/TrainingMenu';
import { StatsPage } from './features/analytics/components/StatsPage';
import { User, Plus, Keyboard } from 'lucide-react';
import { UserProfile } from './types';
import { detectKeyboardLayout } from './utils/keyboardDetection';
import { cn } from './utils/cn';

const ProfileCard = ({ profile, onSelect }: { profile: UserProfile, onSelect: () => void }) => {
  const { progressPercent } = getLevelProgress(profile.xp);
  const { title, division } = calculateRank(profile.level);

  return (
    <button
      onClick={onSelect}
      className="group flex flex-col items-center p-6 bg-slate-800 rounded-2xl border border-slate-700 hover:border-brand-500 hover:bg-slate-750 transition-all shadow-lg w-full text-left"
    >
      <div className="flex items-center gap-4 w-full mb-4">
        <div className="h-16 w-16 rounded-full bg-brand-900/50 text-brand-300 flex items-center justify-center shrink-0 ring-2 ring-brand-500/20 group-hover:scale-105 transition-transform">
          <User size={32} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate">{profile.name}</h3>
          <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wide">
                {title} {division}
              </span>
          </div>
        </div>
      </div>
      
      {/* XP Bar */}
      <div className="w-full space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Level {profile.level}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
          <div 
             className="h-full bg-brand-600 group-hover:bg-brand-500 transition-colors"
             style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>
    </button>
  );
};

const Home = () => {
  const { profiles, createProfile, setActiveProfile } = useProfileStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedLayout, setSelectedLayout] = useState<'qwerty' | 'qwertz'>('qwerty');
  const [detecting, setDetecting] = useState(false);
  
  const navigate = useNavigate();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      createProfile(newName, selectedLayout);
      setNewName('');
      setIsCreating(false);
    }
  };

  const handleDetect = async () => {
    setDetecting(true);
    const detected = await detectKeyboardLayout();
    setDetecting(false);
    if (detected) {
      setSelectedLayout(detected);
    }
  };

  const handleSelect = (id: string) => {
    setActiveProfile(id);
    navigate('/campaign');
  };

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-slate-400">Select a profile to continue your training.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(profiles).map((profile: UserProfile) => (
          <ProfileCard 
            key={profile.id} 
            profile={profile} 
            onSelect={() => handleSelect(profile.id)} 
          />
        ))}

        {/* Create New Profile Card */}
        {isCreating ? (
          <form onSubmit={handleCreate} className="flex flex-col items-center p-6 bg-slate-800 rounded-2xl border border-brand-500 shadow-lg shadow-brand-900/20 h-full justify-center">
            <h3 className="text-lg font-bold text-white mb-4">New Profile</h3>
            
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter name..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-brand-500 transition-colors"
            />
            
            {/* Layout Selector */}
            <div className="w-full mb-4">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Keyboard Layout</label>
               <div className="flex gap-2">
                 <button
                    type="button"
                    onClick={() => setSelectedLayout('qwerty')}
                    className={cn(
                      "flex-1 py-2 rounded border text-xs font-bold uppercase transition-colors",
                      selectedLayout === 'qwerty' ? "bg-brand-600 border-brand-500 text-white" : "bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600"
                    )}
                 >
                   QWERTY
                 </button>
                 <button
                    type="button"
                    onClick={() => setSelectedLayout('qwertz')}
                    className={cn(
                      "flex-1 py-2 rounded border text-xs font-bold uppercase transition-colors",
                      selectedLayout === 'qwertz' ? "bg-brand-600 border-brand-500 text-white" : "bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600"
                    )}
                 >
                   QWERTZ
                 </button>
               </div>
               <button 
                  type="button"
                  onClick={handleDetect}
                  disabled={detecting}
                  className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-brand-400 hover:text-brand-300 py-1"
               >
                  <Keyboard size={12} />
                  {detecting ? "Detecting..." : "Detect System Layout"}
               </button>
            </div>

            <div className="flex gap-3 w-full mt-auto">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!newName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-50 font-medium"
              >
                Create
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex flex-col items-center justify-center p-6 bg-slate-800/30 rounded-2xl border border-dashed border-slate-600 hover:border-brand-500 hover:bg-slate-800/50 transition-all min-h-[160px] group"
          >
            <div className="p-4 rounded-full bg-slate-800 group-hover:bg-brand-900/30 mb-4 transition-colors">
                <Plus size={32} className="text-slate-500 group-hover:text-brand-400" />
            </div>
            <span className="text-slate-400 font-medium group-hover:text-white">Create New Profile</span>
          </button>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <MemoryRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign" element={<CampaignMenu />} />
          <Route path="/training" element={<TrainingMenu />} />
          
          {/* Dynamic Game Route: Mode (campaign/training) + LevelID */}
          <Route path="/play/:mode/:levelId" element={<GameStage />} />
          
          <Route path="/results" element={<StatsPage />} />
        </Routes>
      </MainLayout>
    </MemoryRouter>
  );
}

export default App;
