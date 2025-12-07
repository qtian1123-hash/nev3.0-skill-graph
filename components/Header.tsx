
'use client';

import React, { useRef, useState } from 'react';
import { Search, Bell, Upload } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoSrc, setLogoSrc] = useState<string | null>(null); // Use null to default to text if no image

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#020617]/90 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />

      {/* Left: Logo */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick} title="点击更换 Logo">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/50 overflow-hidden relative">
          {logoSrc ? (
            <img src={logoSrc} alt="App Logo" className="w-full h-full object-cover" />
          ) : (
            <span>N</span>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">新能源汽车能力图谱</h1>
          <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase opacity-80">NEV SkillGraph V2.0</p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center relative w-96">
        <Search className="absolute left-3 w-4 h-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="搜索技能模块..." 
          className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
        />
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-slate-500">学员</p>
          </div>
          <div className="relative">
            <img 
              src={user.avatarUrl} 
              alt="Avatar" 
              className="w-9 h-9 rounded-full border border-slate-700 object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#020617]" title="在线"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
