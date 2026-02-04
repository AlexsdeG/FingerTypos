
import React, { useState, useRef } from 'react';
import { X, Keyboard, Volume2, Eye, Layout, Download, Upload, Ghost, HelpCircle } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { cn } from '../../../utils/cn';
import { detectKeyboardLayout } from '../../../utils/keyboardDetection';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { activeProfileId, profiles, updateSettings, importProfile } = useProfileStore();
  const profile = activeProfileId ? profiles[activeProfileId] : null;
  const [detecting, setDetecting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  const { settings } = profile;

  const handleAutoDetect = async () => {
    setDetecting(true);
    const detected = await detectKeyboardLayout();
    setDetecting(false);

    if (detected) {
      updateSettings({ keyboardLayout: detected });
    } else {
      alert("Auto-detection not supported or failed in this browser. Please select manually.");
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `FingerTypos_profile_${profile.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importProfile(json);
        alert("Profile imported successfully!");
        onClose();
      } catch (err) {
        console.error(err);
        alert("Failed to import profile. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 backdrop-blur-md z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layout className="text-brand-400" />
            Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Keyboard Layout Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Keyboard Layout</label>
              <div className="group relative">
                <HelpCircle size={14} className="text-slate-500 hover:text-slate-300 cursor-help" />
                <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-black border border-slate-700 text-xs text-slate-300 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Affects the virtual keyboard display and key mapping.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(['qwerty', 'qwertz'] as const).map(layout => (
                <button
                  key={layout}
                  onClick={() => updateSettings({ keyboardLayout: layout })}
                  className={cn(
                    "px-4 py-3 rounded-lg border text-sm font-bold uppercase transition-all",
                    settings.keyboardLayout === layout
                      ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/20"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                  )}
                >
                  {layout}
                </button>
              ))}
            </div>
            <button
              onClick={handleAutoDetect}
              disabled={detecting}
              className="w-full mt-2 py-2 text-xs font-medium text-brand-400 hover:text-brand-300 border border-dashed border-brand-900/50 rounded hover:bg-brand-900/10 transition-colors"
            >
              {detecting ? "Detecting..." : "Auto-Detect System Layout"}
            </button>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Toggles */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Interface</label>

            <div className="flex items-center justify-between group" title="Show/Hide the virtual keyboard at the bottom of the screen.">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                  <Keyboard size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Virtual Keyboard</p>
                  <p className="text-xs text-slate-500">Show on screen</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ showVirtualKeyboard: !settings.showVirtualKeyboard })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.showVirtualKeyboard ? "bg-brand-600" : "bg-slate-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                  settings.showVirtualKeyboard ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between group" title="Show animated lines guiding your fingers to the keys.">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                  <Eye size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Hand Guides</p>
                  <p className="text-xs text-slate-500">Show finger paths</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ showHands: !settings.showHands })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.showHands ? "bg-brand-600" : "bg-slate-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                  settings.showHands ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between group" title="Replay your previous best run as a ghost cursor.">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                  <Ghost size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Ghost Replay</p>
                  <p className="text-xs text-slate-500">Race against your PB</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ showGhost: !settings.showGhost })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.showGhost ? "bg-brand-600" : "bg-slate-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                  settings.showGhost ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between group" title="Enable mechanical click sounds and error cues.">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                  <Volume2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Sound Effects</p>
                  <p className="text-xs text-slate-500">Clicks and errors</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.soundEnabled ? "bg-brand-600" : "bg-slate-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                  settings.soundEnabled ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Data Management */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Data</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Download size={18} />
                <span>Export JSON</span>
              </button>
              <button
                onClick={handleImportClick}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Upload size={18} />
                <span>Import JSON</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
