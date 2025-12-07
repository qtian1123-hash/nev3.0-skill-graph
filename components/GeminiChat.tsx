'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles, AlertTriangle, MessageSquare } from 'lucide-react';
import { SkillNode } from '../types';

interface GeminiChatProps {
  activeNode: SkillNode | null;
  triggerPrompt?: string | null;
  onPromptSent?: () => void;
}

interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
}

const QUICK_ACTIONS = [
  { label: '学习规划', prompt: '请为这个模块制定一个详细的学习规划，包含重点和难点。' },
  { label: '核心概念', prompt: '请用通俗易懂的语言解释这个模块的核心概念。' },
  { label: '模拟考核', prompt: '请针对这个模块出3道单项选择题，并附带答案解析。' },
];

const GeminiChat: React.FC<GeminiChatProps> = ({ activeNode, triggerPrompt, onPromptSent }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "你好！我是你的 AI 技能导师。请在左侧或图谱中选择一个技能模块，我可以为你提供专业的学习建议、概念解析和模拟考核。" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (activeNode) {
        setMessages(prev => [...prev, { 
            role: 'system', 
            content: `已切换关注点至：${activeNode.name}` 
        }]);
    }
  }, [activeNode]);

  useEffect(() => {
    if (triggerPrompt && !isLoading) {
        handleSend(triggerPrompt);
        if (onPromptSent) {
            onPromptSent();
        }
    }
  }, [triggerPrompt]);

  const handleSend = async (overridePrompt?: string) => {
    const promptText = overridePrompt || input;
    if (!promptText.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: promptText }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // 构建上下文提示词
      let systemContext = `角色：你是新能源汽车（NEV）维修与检测领域的专家级 AI 导师。
      受众：正在学习电动汽车安全、电池、电机和法规的学生或检测员。
      语气：专业、鼓励、简洁、技术性强。
      语言：请全程使用中文回答。
      当前背景：用户正在查看一个技能知识图谱。
      `;
      
      if (activeNode) {
        systemContext += `\n当前选中的模块："${activeNode.name}" (分类：${activeNode.category})。
        描述：${activeNode.desc || '暂无描述'}。
        掌握进度：${activeNode.progress}%。
        状态：${activeNode.status === 'mastered' ? '已掌握' : activeNode.status === 'pending' ? '待学习' : '未解锁'}。
        
        如果用户询问学习计划，请根据他们的进度进行指导。
        如果用户要求出题，请提供 3 道与 ${activeNode.name} 相关的单选题。`;
      } else {
        systemContext += `\n当前未选择特定模块。请引导用户从图谱中选择一个模块（如高压安全、动力电池、驱动电机、电子电控等）。`;
      }

      // ----------------------------------------------------
      // 调用 Next.js 后端 API (替代直接调用 Google SDK)
      // ----------------------------------------------------
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptText,
          systemContext: systemContext
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "请求后端失败");
      }

      setMessages(prev => [...prev, { role: 'model', content: data.text }]);

    } catch (err: any) {
      console.error("Chat Error:", err);
      setError("AI 连接失败，请检查网络或后端配置。");
      setMessages(prev => [...prev, { role: 'system', content: `错误: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1120] rounded-xl border border-slate-800 overflow-hidden shadow-inner">
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
                <MessageSquare className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-white">AI 导师</span>
        </div>
        {activeNode && (
            <span className="text-[10px] text-slate-400 border border-slate-700 rounded px-2 py-0.5 max-w-[120px] truncate">
                {activeNode.name}
            </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
            )}
            <div className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : msg.role === 'system'
                ? 'bg-slate-800/50 text-slate-400 text-xs italic text-center w-full border-none'
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mr-2">
                 <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
             </div>
             <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 border border-slate-700">
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-900/20 border-t border-red-900/50 flex items-center gap-2">
           <AlertTriangle className="w-3 h-3 text-red-400" />
           <p className="text-xs text-red-400 truncate">{error}</p>
        </div>
      )}

      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none border-t border-slate-800/50 pt-3">
        {QUICK_ACTIONS.map((action, i) => (
            <button 
                key={i}
                onClick={() => handleSend(action.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
                {i === 0 ? <Sparkles className="w-3 h-3" /> : null}
                {action.label}
            </button>
        ))}
      </div>

      <div className="p-3 bg-[#0B1120]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeNode ? `关于 ${activeNode.name} 的问题...` : "输入您的问题..."}
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-500 transition-all"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-blue-600 rounded transition-colors disabled:opacity-50 disabled:hover:bg-slate-800"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;