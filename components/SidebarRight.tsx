'use client';

import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';
import { RADAR_DATA, GROWTH_DATA, USER_PROFILE, LEARNING_RESOURCES, FUTURE_GOALS } from '../constants';
import { SkillNode } from '../types';
import GeminiChat from './GeminiChat';
import { Target, CheckCircle2, PlayCircle, MessageSquare, TrendingUp, Activity, FileText, Lock, Sparkles, Loader2, BrainCircuit, Calendar, RefreshCcw, Library, Download, Video, File, Flag, Clock, Trophy } from 'lucide-react';

interface SidebarRightProps {
  activeNode: SkillNode | null;
  width: number;
}

type TabId = 'details' | 'analysis' | 'growth' | 'ai';

const SidebarRight: React.FC<SidebarRightProps> = ({ activeNode, width }) => {
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [triggerAiPrompt, setTriggerAiPrompt] = useState<string | null>(null);

  const generateDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
        const prompt = `
            你是新能源汽车维修专业的AI教学专家。请根据以下学生数据生成一份简短精炼的【能力诊断报告】。
            
            学员数据：
            - 已掌握技能数：${USER_PROFILE.masteredCount}
            - 待学习技能数：${USER_PROFILE.totalCount - USER_PROFILE.masteredCount}
            - 综合能力雷达数据：${RADAR_DATA.map(d => `${d.subject}:${d.A}`).join(', ')}
            
            请包含以下内容（使用Markdown格式）：
            1. **能力综述**：简要评价当前水平。
            2. **强项分析**：指出表现最好的领域。
            3. **短板预警**：指出需要加强的领域。
            4. **学习建议**：给出接下来的重点学习方向。
            
            保持语气专业、鼓励性，字数控制在250字以内。
        `;

        // ----------------------------------------------------
        // 调用 Next.js 后端 API (安全调用)
        // ----------------------------------------------------
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "请求失败");
        }

        setAiDiagnosis(data.text || "无法生成报告。");
    } catch (e: any) {
        console.error("Diagnosis Error:", e);
        setAiDiagnosis(`生成报告失败: ${e.message}`);
    } finally {
        setIsDiagnosing(false);
    }
  };

  const handleStartReview = () => {
    if (activeNode) {
        setTriggerAiPrompt(`我已掌握【${activeNode.name}】模块。请开启复习模式，随机出3道单选题来考核我，并给出解析。`);
        setActiveTab('ai');
    }
  };

  return (
    <aside 
      className="bg-[#020617]/95 border-l border-slate-800 flex flex-col h-[calc(100vh-64px)] z-20 backdrop-blur-sm shrink-0 transition-none"
      style={{ width: width }}
    >
      
      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 bg-slate-900/50">
          {[
              { id: 'details', label: '知识详情', icon: FileText },
              { id: 'analysis', label: '能力分析', icon: Activity },
              { id: 'growth', label: '成长轨迹', icon: TrendingUp },
              { id: 'ai', label: 'AI导师', icon: MessageSquare },
          ].map((tab) => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
            >
                <tab.icon className="w-3 h-3" />
                {tab.label}
            </button>
          ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 p-5">
        
        {/* TAB: DETAILS */}
        {activeTab === 'details' && (
            <div className="space-y-6 animate-fadeIn">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                            activeNode?.group === 'core' ? 'bg-white/10 text-white border-white/20' : 
                            activeNode?.status === 'mastered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                            {activeNode ? (activeNode.group === 'core' ? '核心' : activeNode.category.toUpperCase()) : '概览'}
                        </span>
                        {activeNode?.status === 'mastered' ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> 已掌握
                            </span>
                        ) : activeNode ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                <Lock className="w-3 h-3" /> 待学习
                            </span>
                        ) : null}
                    </div>
                    
                    <h1 className="text-2xl font-black text-white leading-tight">
                        {activeNode ? activeNode.name : '新能源汽车年审员'}
                    </h1>
                    
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {activeNode?.desc || '具备新能源汽车安全技术检验的核心能力，熟悉GB 38900-2020标准。请在左侧或图中选择一个节点查看详情。'}
                    </p>
                </div>

                {/* Progress or Mastered Actions */}
                {activeNode && (
                    <div className={`rounded-xl p-4 border ${
                        activeNode.status === 'mastered' ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-slate-900/50 border-slate-800'
                    }`}>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-slate-500 font-bold uppercase">掌握程度</span>
                            <span className={`text-xl font-bold ${activeNode.status === 'mastered' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                                {activeNode.progress}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                    activeNode.status === 'mastered' ? 'bg-emerald-500' : 'bg-cyan-500'
                                }`} 
                                style={{ width: `${activeNode.progress}%` }}
                            ></div>
                        </div>

                        {/* Review Mode for Mastered Nodes */}
                        {activeNode.status === 'mastered' && (
                            <div className="mt-4 pt-4 border-t border-emerald-500/20">
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-300">
                                        <Trophy className="w-3 h-3" /> 历史最高: 98分
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-300 opacity-80">
                                        <Clock className="w-3 h-3" /> 3天前复习
                                    </div>
                                </div>
                                <button 
                                    onClick={handleStartReview}
                                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-2 font-bold text-xs transition-all shadow-lg shadow-emerald-900/40 group"
                                >
                                    <RefreshCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                                    进入复习模式
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Key Points */}
                <div>
                    <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <Target className="w-3 h-3 text-blue-500" /> 考核要点
                    </h3>
                    <ul className="space-y-2">
                        {['操作流程规范性', '设备使用准确性', '结果判定依据', '安全防护措施'].map((pt, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                <span className={`w-1 h-1 rounded-full mt-2 ${activeNode?.status === 'mastered' ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                                {pt}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Learning Path (Pending) */}
                {activeNode?.status !== 'mastered' && activeNode && (
                    <div className="bg-slate-900/30 rounded-xl border border-slate-800 p-4">
                        <h3 className="text-xs font-bold text-yellow-500 mb-4 flex items-center gap-2">
                            <PlayCircle className="w-3 h-3" /> 推荐学习路径
                        </h3>
                        <div className="space-y-4 pl-2">
                             <div className="relative pl-6 border-l border-slate-800">
                                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-yellow-500 ring-4 ring-[#020617]"></div>
                                <p className="text-xs text-yellow-500 font-bold mb-1">Step 1: 理论学习</p>
                                <div className="bg-slate-800/80 p-2 rounded text-xs text-slate-300">
                                    GB/T 38900 标准解读 (45 分钟)
                                </div>
                             </div>
                             <div className="relative pl-6 border-l border-slate-800">
                                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-700 ring-4 ring-[#020617]"></div>
                                <p className="text-xs text-slate-500 font-bold mb-1">Step 2: 模拟实训</p>
                                <div className="bg-slate-800/40 p-2 rounded text-xs text-slate-500">
                                    VR 虚拟检车站 (60 分钟)
                                </div>
                             </div>
                        </div>
                        <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                            开始学习
                        </button>
                    </div>
                )}
                
                {/* Related Resources (General) */}
                <div className="pt-4 border-t border-slate-800">
                   <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
                       <Library className="w-3 h-3 text-violet-500" /> 相关资料
                   </h3>
                   <div className="space-y-2">
                       {LEARNING_RESOURCES.map((res, idx) => (
                           <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
                               <div className="flex items-center gap-3">
                                   <div className={`p-1.5 rounded ${res.type === 'pdf' ? 'bg-red-500/10 text-red-400' : res.type === 'video' ? 'bg-blue-500/10 text-blue-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                       {res.type === 'pdf' ? <FileText className="w-3 h-3" /> : res.type === 'video' ? <Video className="w-3 h-3" /> : <File className="w-3 h-3" />}
                                   </div>
                                   <div>
                                       <p className="text-xs text-slate-300 font-medium group-hover:text-white truncate max-w-[120px]" title={res.title}>{res.title}</p>
                                       <p className="text-[10px] text-slate-600">{res.type === 'video' ? res.duration : res.size}</p>
                                   </div>
                               </div>
                               <Download className="w-3 h-3 text-slate-600 group-hover:text-cyan-400" />
                           </div>
                       ))}
                   </div>
                </div>
            </div>
        )}

        {/* TAB: ANALYSIS */}
        {activeTab === 'analysis' && (
            <div className="h-full flex flex-col animate-fadeIn space-y-4">
                <div className="bg-[#0B1120] rounded-xl p-4 border border-slate-800 max-h-[400px]">
                    <h3 className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">综合能力雷达</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                            <PolarGrid stroke="#1e293b" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                            name="Student"
                            dataKey="A"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="#3b82f6"
                            fillOpacity={0.3}
                            />
                        </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                     <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">理论基础</div>
                        <div className="text-lg font-bold text-white">优秀</div>
                     </div>
                     <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">实操技能</div>
                        <div className="text-lg font-bold text-yellow-400">良好</div>
                     </div>
                </div>

                {/* AI Diagnosis Section */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-4 border border-indigo-500/20 flex flex-col gap-3">
                   <div className="flex items-center justify-between">
                       <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                           <BrainCircuit className="w-4 h-4" /> AI 智能诊断
                       </h3>
                       <button 
                           onClick={generateDiagnosis} 
                           disabled={isDiagnosing}
                           className="text-[10px] bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-3 py-1 rounded-full flex items-center gap-1 transition-colors whitespace-nowrap"
                       >
                           {isDiagnosing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                           {isDiagnosing ? "分析中..." : (aiDiagnosis ? "重新分析" : "生成报告")}
                       </button>
                   </div>
                   
                   {aiDiagnosis ? (
                       <div className="bg-slate-900/50 rounded-lg p-3 text-xs text-slate-300 leading-relaxed border border-indigo-500/10 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900">
                           {aiDiagnosis.split('\n').map((line, i) => (
                               <p key={i} className="mb-1">{line}</p>
                           ))}
                       </div>
                   ) : (
                       <div className="text-center py-4 text-xs text-slate-500 border border-dashed border-slate-700 rounded-lg">
                           点击上方按钮，AI 将根据您的学习数据生成个性化诊断报告。
                       </div>
                   )}
                </div>
            </div>
        )}

        {/* TAB: GROWTH */}
        {activeTab === 'growth' && (
            <div className="animate-fadeIn">
                <div className="bg-[#0B1120] rounded-xl p-4 border border-slate-800 mb-6">
                    <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                        <TrendingUp className="w-4 h-4" /> 技能成长趋势
                    </h3>
                    <div className="h-56 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={GROWTH_DATA} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <XAxis 
                                dataKey="month" 
                                tick={{fill: '#64748b', fontSize: 10}} 
                                axisLine={false} 
                                tickLine={false} 
                                dy={10}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} 
                                itemStyle={{ color: '#10b981' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorScore)" 
                            >
                                <LabelList 
                                    dataKey="score" 
                                    position="top" 
                                    offset={10} 
                                    fill="#10b981" 
                                    fontSize={12} 
                                    fontWeight="bold" 
                                />
                            </Area>
                        </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Timeline */}
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">关键里程碑</h3>
                </div>
                
                <div className="space-y-0 pl-2">
                    {GROWTH_DATA.slice().reverse().map((data, idx) => (
                        <div key={idx} className="relative pl-8 pb-8 border-l border-slate-800 last:pb-0 last:border-0">
                            <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#020617] ${idx === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                            <div className="flex justify-between items-start -mt-1">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-mono mb-0.5">{data.month}</span>
                                    <span className={`text-base font-bold ${idx === 0 ? 'text-white' : 'text-slate-400'}`}>{data.stage}</span>
                                </div>
                                <span className={`text-xl font-bold ${idx === 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                                    {data.score} <span className="text-xs font-normal opacity-70">分</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Future Goals */}
                <div className="mt-8 pt-6 border-t border-slate-800/50">
                    <div className="flex items-center gap-2 mb-4">
                        <Flag className="w-4 h-4 text-purple-500" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">下阶段目标</h3>
                    </div>
                    <div className="space-y-3">
                        {FUTURE_GOALS.map((goal, idx) => (
                            <div key={idx} className={`p-3 rounded-xl border flex gap-3 ${goal.status === 'locked' ? 'bg-slate-900/30 border-slate-800 opacity-60' : 'bg-purple-900/10 border-purple-500/20'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${goal.status === 'locked' ? 'bg-slate-800 text-slate-500' : 'bg-purple-500/20 text-purple-400'}`}>
                                    {goal.status === 'locked' ? <Lock className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold ${goal.status === 'locked' ? 'text-slate-500' : 'text-purple-300'}`}>{goal.title}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-tight">{goal.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* TAB: AI TUTOR */}
        {activeTab === 'ai' && (
            <div className="h-full flex flex-col animate-fadeIn">
                <div className="flex-1 min-h-0 bg-[#0B1120] rounded-xl border border-slate-800 overflow-hidden shadow-inner flex flex-col">
                    <GeminiChat 
                        activeNode={activeNode} 
                        triggerPrompt={triggerAiPrompt}
                        onPromptSent={() => setTriggerAiPrompt(null)}
                    />
                </div>
            </div>
        )}

      </div>
    </aside>
  );
};

export default SidebarRight;