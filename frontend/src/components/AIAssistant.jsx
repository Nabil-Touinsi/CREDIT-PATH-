import React, { useState, useEffect, useRef } from 'react';

export default function AIAssistant({ result, data }) {
  const initialMessage = {
    sender: 'bot',
    text: "Assistant CreditPath en ligne. En attente de données."
  };

  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Analyse du résultat",
    "Conseils d'amélioration",
    "Statut d'éligibilité",
    "Taux actuels"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (result) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: `Analyse terminée. Statut du dossier : ${result.decision}.` }
      ]);
    }
  }, [result]);

  const resetChat = () => {
    setMessages([initialMessage]);
    setInput("");
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const contextData = result
  ? {
      ...data,
      decision: result.decision,
      score_confiance: result.score_confiance,
      plan_action: result.plan_action,
      taux_obtenu: result.finance?.taux_obtenu,
      taux_marche: result.finance?.taux_marche,
      mensualite: result.finance?.mensualite,
      cout_total: result.finance?.cout_total,
      economie: result.finance?.economie,
    }
  : {
      ...data,
      decision: null,
      score_confiance: null,
      plan_action: [],
      taux_obtenu: null,
      taux_marche: null,
      mensualite: null,
      cout_total: null,
      economie: null,
    };

      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: contextData }),
      });

      const dataRes = await response.json();

      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: dataRes.response }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "Erreur de connexion service." }
      ]);
    }
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[500px]">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h3 className="text-white font-medium text-sm">Assistant Virtuel</h3>
        </div>

        <button
          onClick={resetChat}
          className="text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
        >
          Réinitialiser
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600/80 text-white'
                  : 'bg-slate-700/50 text-gray-300 border border-white/5'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-black/20">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((text, index) => (
            <button
              key={index}
              onClick={() => sendMessage(text)}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-2 py-1 rounded transition-colors"
            >
              {text}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Saisir un message..."
            className="flex-1 bg-transparent border-b border-white/20 text-white text-sm px-2 py-2 focus:border-blue-500 outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            className="text-blue-400 hover:text-white text-sm"
          >
            ENVOYER
          </button>
        </div>
      </div>
    </div>
  );
}