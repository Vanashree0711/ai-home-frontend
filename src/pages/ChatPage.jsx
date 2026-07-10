import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

import api from '../api/axios';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Connecting to the FastAPI Streaming endpoint dynamically
      const response = await fetch(`${api.defaults.baseURL}/chat/stream?prompt=${encodeURIComponent(userMsg.content)}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let assistantMsg = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                assistantMsg.content += data.text;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { ...assistantMsg };
                  return newMsgs;
                });
              } else if (data.error) {
                console.error("AI Error:", data.error);
              }
            } catch (e) {
              // Ignore partial JSON chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat stream error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto min-h-screen flex flex-col pb-8">
      <h1 className="text-3xl font-display font-bold mb-6">AI Architect Chat</h1>
      
      <div className="flex-1 glass-panel rounded-3xl border border-white/10 p-6 flex flex-col overflow-hidden mb-4 h-[600px]">
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-gold text-primary self-end' : 'bg-primary-light border border-white/10 self-start'}`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </motion.div>
          ))}
          {loading && (
            <div className="text-gray-soft text-sm animate-pulse ml-2">AI is thinking...</div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          className="flex-1 bg-primary-light border border-white/20 rounded-xl px-6 py-4 text-pearl focus:border-gold outline-none"
          placeholder="Ask for design recommendations or material costs..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-gold text-primary p-4 rounded-xl hover:bg-gold-light transition-colors">
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
