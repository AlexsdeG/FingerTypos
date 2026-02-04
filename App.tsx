import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { useProfileStore } from './features/profile/store/profileStore';
import { User, Plus, Play } from 'lucide-react';
import { UserProfile } from './types';

// Placeholder Components for Phase 1
const Home = () => {
  const { profiles, createProfile, setActiveProfile } = useProfileStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      createProfile(newName);
      setNewName('');
      setIsCreating(false);
    }
  };

  const handleSelect = (id: string) => {
    setActiveProfile(id);
    navigate('/play');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-white">Select Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(profiles).map((profile: UserProfile) => (
          <button
            key={profile.id}
            onClick={() => handleSelect(profile.id)}
            className="group flex flex-col items-center p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-brand-500 hover:bg-slate-750 transition-all"
          >
            <div className="h-16 w-16 rounded-full bg-brand-900 text-brand-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <User size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">{profile.name}</h3>
            <p className="text-slate-400">Level {profile.level}</p>
          </button>
        ))}

        {/* Create New Profile Card */}
        {isCreating ? (
          <form onSubmit={handleCreate} className="flex flex-col items-center p-6 bg-slate-800 rounded-xl border border-brand-500">
            <h3 className="text-lg font-bold text-white mb-4">New Profile</h3>
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter name..."
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white mb-4 focus:outline-none focus:border-brand-500"
            />
            <div className="flex gap-2 w-full">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="flex-1 px-3 py-2 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!newName.trim()}
                className="flex-1 px-3 py-2 rounded bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-xl border border-dashed border-slate-600 hover:border-brand-500 hover:bg-slate-800 transition-all min-h-[200px]"
          >
            <Plus size={40} className="text-slate-500 mb-2" />
            <span className="text-slate-400 font-medium">Create New Profile</span>
          </button>
        )}
      </div>
    </div>
  );
};

const Game = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="p-8 bg-slate-800 rounded-2xl border border-slate-700 mb-6 max-w-lg">
        <Play size={64} className="mx-auto text-brand-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Game Engine Ready</h2>
        <p className="text-slate-400">
          The core infrastructure is set up. Phase 2 will implement the typing engine, procedural generation, and visual keyboard.
        </p>
      </div>
      <button className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold transition-colors">
        Start Demo (Coming Soon)
      </button>
    </div>
  );
};

const Results = () => {
  return (
    <div className="text-center pt-20">
      <h2 className="text-3xl font-bold text-white mb-4">Analytics Dashboard</h2>
      <p className="text-slate-400">No match data available yet.</p>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Game />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}

export default App;