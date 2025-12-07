'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SidebarLeft from '@/components/SidebarLeft';
import SidebarRight from '@/components/SidebarRight';
import SkillGraph from '@/components/SkillGraph';
import { USER_PROFILE, INITIAL_GRAPH_DATA } from '@/constants';
import { SkillNode, NodeType } from '@/types';

export default function Home() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Sidebar Width State
  const [leftWidth, setLeftWidth] = useState(288);
  const [rightWidth, setRightWidth] = useState(380);
  
  // Dragging State
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Find full node object based on ID
  const selectedNode = INITIAL_GRAPH_DATA.nodes.find(n => n.id === selectedNodeId) || null;
  const coreNodes = INITIAL_GRAPH_DATA.nodes.filter(n => n.type === NodeType.CORE);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleGraphNodeClick = (node: SkillNode) => {
    setSelectedNodeId(node.id);
  };

  // Global Drag Events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.max(200, Math.min(500, e.clientX));
        setLeftWidth(newWidth);
      } else if (isResizingRight) {
        const newWidth = Math.max(300, Math.min(600, window.innerWidth - e.clientX));
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-white overflow-hidden font-sans">
      <Header user={USER_PROFILE} />

      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft 
          width={leftWidth}
          user={USER_PROFILE} 
          coreNodes={coreNodes}
          onSelectNode={handleNodeSelect}
          selectedNodeId={selectedNodeId}
        />

        <div 
          className={`w-1 bg-slate-900 hover:bg-blue-500 cursor-col-resize transition-colors z-30 flex items-center justify-center group ${isResizingLeft ? 'bg-blue-600' : ''}`}
          onMouseDown={() => setIsResizingLeft(true)}
        >
          <div className="h-8 w-0.5 bg-slate-700 group-hover:bg-white rounded-full transition-colors"></div>
        </div>

        <main className="flex-1 relative bg-slate-950 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-0 min-w-[300px]">
          <SkillGraph 
            data={INITIAL_GRAPH_DATA} 
            selectedNodeId={selectedNodeId}
            onNodeClick={handleGraphNodeClick}
          />
        </main>

        <div 
          className={`w-1 bg-slate-900 hover:bg-blue-500 cursor-col-resize transition-colors z-30 flex items-center justify-center group ${isResizingRight ? 'bg-blue-600' : ''}`}
          onMouseDown={() => setIsResizingRight(true)}
        >
          <div className="h-8 w-0.5 bg-slate-700 group-hover:bg-white rounded-full transition-colors"></div>
        </div>

        <SidebarRight 
          width={rightWidth}
          activeNode={selectedNode} 
        />
        
      </div>
    </div>
  );
}