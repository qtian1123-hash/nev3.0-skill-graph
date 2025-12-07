
'use client';

import React, { useRef, useState } from 'react';
import { UserProfile, SkillNode } from '../types';
import { Shield, Zap, Activity, Cpu, Layers, CheckCircle2, CircleDashed, Upload, Camera } from 'lucide-react';

interface SidebarLeftProps {
  user: UserProfile;
  coreNodes: SkillNode[];
  onSelectNode: (nodeId: string) => void;
  selectedNodeId: string | null;
  width: number; // New prop for dynamic width
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ user, coreNodes, onSelectNode, selectedNodeId, width }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string>(user.avatarUrl);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'safety': return <Shield className="w-5 h-5 text-red-400" />;
      case 'battery': return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'motor': return <Activity className="w-5 h-5 text-blue-400" />;
      case 'control': return <Cpu className="w-5 h-5 text-violet-400" />;
      default: return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  const pendingCount = user.totalCount - user.masteredCount;

  return (
    <aside 
      className="bg-[#020617] border-r border-slate-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto z-10 shrink-0"
      style={{ width: width }}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />

      {/* 1. Personal Profile Section */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">学员档案</h2>
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 backdrop-blur-sm shadow-sm relative group">
          <div className="flex flex-col gap-4 items-center mb-4">
             {/* Large Avatar Clickable */}
             <div 
               className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-blue-600 cursor-pointer relative overflow-hidden shrink-0"
               onClick={handleAvatarClick}
               title="点击更换头像"
             >
                <img src={avatarSrc} alt="Student Avatar" className="w-full h-full object-cover rounded-full bg-slate-800" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                   <Camera className="w-6 h-6 text-white" />
                </div>
             </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2 mb-2">
              <span className="text-white font-bold text-lg truncate max-w-[120px]">{user.name}</span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 whitespace-nowrap">在读</span>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
               <span className="text-slate-500 whitespace-nowrap">学号:</span>
               <span className="font-mono text-slate-300 truncate">{user.id}</span>
               <span className="text-slate-500 whitespace-nowrap">班级:</span>
               <span className="text-slate-300 truncate">{user.class}</span>
               <span className="text-slate-500 whitespace-nowrap">专业:</span>
               <span className="text-slate-300 truncate">{user.major}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-emerald-400">{user.masteredCount}</span>
                <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide whitespace-nowrap">已掌握</span>
                </div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-300">{pendingCount}</span>
                <div className="flex items-center gap-1 mt-1">
                    <CircleDashed className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide whitespace-nowrap">待学习</span>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Core Module Navigation */}
      <div className="flex-1 p-6">
        <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">核心模块</h2>
        <div className="space-y-3">
          {coreNodes.filter(n => n.id !== 'root').map((node) => (
            <button
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                selectedNodeId === node.id 
                  ? 'bg-slate-800 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                  : 'bg-slate-900/30 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              {selectedNodeId === node.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
              )}
              
              <div className={`p-2 rounded-lg transition-colors shrink-0 ${
                selectedNodeId === node.id ? 'bg-slate-700' : 'bg-slate-900 group-hover:bg-slate-800'
              }`}>
                {getIcon(node.category)}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className={`font-semibold text-sm truncate ${selectedNodeId === node.id ? 'text-white' : 'text-slate-300'}`}>
                  {node.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                                width: `${node.progress}%`,
                                backgroundColor: node.progress >= 100 ? '#10b981' : (node.progress > 50 ? '#06b6d4' : '#64748b')
                            }}
                        ></div>
                    </div>
                    <span className={`text-[10px] font-mono ${node.progress === 100 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {node.progress}%
                    </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 text-center border-t border-slate-800 bg-[#020617]">
        <p className="text-[10px] text-slate-600 font-mono">NEV SKILLGRAPH v2.0</p>
      </div>
    </aside>
  );
};

export default SidebarLeft;
