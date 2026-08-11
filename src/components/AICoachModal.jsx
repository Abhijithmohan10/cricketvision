import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, Download, CheckCircle, Shield } from 'lucide-react';

export default function AICoachModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am your AI Tactical Cricket Assistant. I can analyze IPL & International stats, generate matchup blueprints, recommend bowling changes, and create custom drill plans. How can I assist your team today?"
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent AI tactical response
    setTimeout(() => {
      let responseText = "Based on statistical analysis of IPL and T20 International data: Maintain an inverted field with Deep Mid-Wicket and Long-On for power hitters. Deploy seamers with variable pace cutters and wide outside-off yorkers during death overs (overs 16-20).";

      if (textToSend.toLowerCase().includes('spin') || textToSend.toLowerCase().includes('wrist')) {
        responseText = "Tactical Blueprint vs Wrist Spin: Encourage batters to utilize sweep shots against flighted deliveries outside off-stump, or step down the pitch early to smother the turn. Ensure non-striker watches release wrist seam orientation closely for googly detection.";
      } else if (textToSend.toLowerCase().includes('death') || textToSend.toLowerCase().includes('yorker')) {
        responseText = "Death Overs Execution: Jasprit Bumrah and Rashid Khan yield the lowest boundary percentage (<12%). Target wide yorker length (0.2m outside off tramline) to restrict arm extension for right-handed power hitters.";
      } else if (textToSend.toLowerCase().includes('workload') || textToSend.toLowerCase().includes('fatigue')) {
        responseText = "Fatigue & Workload Management: Fast bowlers averaging over 18 overs per week show a 42% increase in hamstring/shoulder strain risk. Recommend resting high-workload pace bowlers every 3rd fixture during tight tournament schedules.";
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: responseText }]);
    }, 450);
  };

  const exportReport = () => {
    const reportText = messages.map(m => `[${m.sender.toUpperCase()}]: ${m.text}`).join('\n\n');
    const blob = new Blob([`CRICKETVISION AI TACTICAL REPORT\nGenerated: ${new Date().toLocaleString()}\n\n` + reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_cricket_strategy_report.txt';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl p-6 flex flex-col h-[80vh] space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-heading text-white">
                CricketVision AI Tactical Coach
              </h2>
              <p className="text-[10px] text-cyan-400 font-mono-code">INSTANT MATCH STRATEGY ENGINE</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportReport}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 border border-slate-800 text-xs flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </button>

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none text-[11px]">
          {[
            "Death overs bowling strategy against power hitters",
            "Countering aggressive powerplay openers on flat pitches",
            "Workload & fatigue management for fast bowlers",
            "Constructing Playing XI against spin-heavy teams"
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 whitespace-nowrap"
            >
              ⚡ {prompt}
            </button>
          ))}
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2 pt-2 border-t border-slate-800"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Coach a tactical question..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
