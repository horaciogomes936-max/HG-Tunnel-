import React, { useState, useEffect } from 'react';
import { Icons } from './components/Icons';
import { ServerSelector } from './components/ServerSelector';
import { SupportChat } from './components/SupportChat';
import { Language, ConnectionStatus, TabView, ServerNode } from './types';
import { TRANSLATIONS, SERVER_LIST, AD_REWARDS } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [lang, setLang] = useState<Language>(Language.PT);
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [selectedServer, setSelectedServer] = useState<ServerNode>(SERVER_LIST[0]);
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.HOME);
  
  // Time in seconds
  const [timeLeft, setTimeLeft] = useState<number>(3600); // Start with 1 hour
  const [balance, setBalance] = useState<number>(0.00);
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];

  // --- Effects ---

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === ConnectionStatus.CONNECTED && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus(ConnectionStatus.DISCONNECTED);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  // --- Handlers ---

  const toggleConnection = () => {
    if (status === ConnectionStatus.DISCONNECTED) {
      if (timeLeft <= 0) {
        alert(lang === Language.PT ? 'Tempo esgotado! Assista um anúncio.' : 'Time ran out! Watch an ad.');
        setCurrentTab(TabView.EARN);
        return;
      }
      setStatus(ConnectionStatus.CONNECTING);
      setTimeout(() => {
        setStatus(ConnectionStatus.CONNECTED);
      }, 2000);
    } else if (status === ConnectionStatus.CONNECTED) {
      setStatus(ConnectionStatus.DISCONNECTING);
      setTimeout(() => {
        setStatus(ConnectionStatus.DISCONNECTED);
      }, 1000);
    }
  };

  const handleWatchAd = (rewardId: string) => {
    const reward = AD_REWARDS.find(r => r.id === rewardId);
    if (!reward) return;

    setIsWatchingAd(true);
    
    // Simulate Ad Display
    setTimeout(() => {
      setIsWatchingAd(false);
      setTimeLeft(prev => prev + (reward.durationHours * 3600));
      setBalance(prev => prev + reward.valueUsd);
      alert(lang === Language.PT ? 'Recompensa Recebida!' : 'Reward Received!');
    }, 3000); // 3 second simulation
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- Render Helpers ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center gap-8 py-4">
      {/* Timer Display */}
      <div className="bg-slate-800/50 px-6 py-2 rounded-full border border-slate-700 flex items-center gap-2">
        <Icons.Clock className="w-4 h-4 text-cyan-400" />
        <span className="font-mono text-xl font-bold tracking-widest text-white">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Main Button */}
      <div className="relative group">
        {/* Pulsing Ring when connected or connecting */}
        {(status === ConnectionStatus.CONNECTED || status === ConnectionStatus.CONNECTING) && (
           <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping-slow blur-md"></div>
        )}
        
        <button
          onClick={toggleConnection}
          className={`w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 relative
            ${status === ConnectionStatus.CONNECTED 
              ? 'bg-slate-800 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.3)]' 
              : status === ConnectionStatus.CONNECTING
              ? 'bg-slate-800 border-yellow-500'
              : 'bg-slate-800 border-slate-600 hover:border-slate-500'
            }
          `}
        >
          <Icons.Power 
            className={`w-16 h-16 mb-2 transition-all duration-500
              ${status === ConnectionStatus.CONNECTED ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-slate-400'}
            `} 
          />
          <span className={`text-xs font-bold tracking-widest uppercase
             ${status === ConnectionStatus.CONNECTED ? 'text-cyan-400' : 'text-slate-400'}
          `}>
            {status === ConnectionStatus.DISCONNECTED && t.tapToConnect}
            {status === ConnectionStatus.CONNECTING && t.connecting}
            {status === ConnectionStatus.CONNECTED && t.connected}
            {status === ConnectionStatus.DISCONNECTING && t.disconnecting}
          </span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
          <div className="p-2 bg-slate-700 rounded-lg">
            <Icons.Download className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{t.download}</div>
            <div className="font-mono font-bold">{status === ConnectionStatus.CONNECTED ? '45.2 MB' : '--'}</div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
          <div className="p-2 bg-slate-700 rounded-lg">
            <Icons.Upload className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{t.upload}</div>
            <div className="font-mono font-bold">{status === ConnectionStatus.CONNECTED ? '12.8 MB' : '--'}</div>
          </div>
        </div>
      </div>

      <ServerSelector 
        servers={SERVER_LIST} 
        selected={selectedServer} 
        onSelect={setSelectedServer} 
        disabled={status !== ConnectionStatus.DISCONNECTED}
      />
    </div>
  );

  const renderEarn = () => (
    <div className="flex flex-col items-center w-full gap-6 py-4">
      {/* Balance Card */}
      <div className="w-full bg-gradient-to-r from-cyan-900 to-slate-800 p-6 rounded-2xl border border-cyan-800 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <span className="text-cyan-200 text-sm">{t.balance}</span>
          <Icons.DollarSign className="text-cyan-400 w-6 h-6" />
        </div>
        <div className="text-4xl font-bold text-white font-mono">
          ${balance.toFixed(2)}
        </div>
        <div className="text-xs text-cyan-300/70 mt-1">
           Available for withdrawal
        </div>
      </div>

      <div className="w-full flex items-center gap-2 my-2">
         <div className="h-px bg-slate-700 flex-1"></div>
         <span className="text-slate-500 text-xs uppercase tracking-widest">{t.watchAd}</span>
         <div className="h-px bg-slate-700 flex-1"></div>
      </div>

      {/* Ad List */}
      <div className="w-full flex flex-col gap-4">
        {AD_REWARDS.map((ad) => (
           <div key={ad.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center justify-between hover:border-cyan-500/50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
                    <Icons.PlayCircle className="text-white w-6 h-6" />
                 </div>
                 <div>
                    <div className="font-bold text-white">+{ad.durationHours} {t.hours}</div>
                    <div className="text-green-400 font-mono text-sm">+${ad.valueUsd.toFixed(2)}</div>
                 </div>
              </div>
              <button 
                onClick={() => handleWatchAd(ad.id)}
                disabled={isWatchingAd}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                {isWatchingAd ? '...' : 'Watch'}
              </button>
           </div>
        ))}
      </div>
      
      {isWatchingAd && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-bold">Loading Ad Provider...</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* App Shell */}
      <div className="max-w-md mx-auto min-h-screen bg-slate-900 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="p-6 flex justify-between items-center z-20 bg-slate-900/80 backdrop-blur-sm sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Icons.Wifi className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">{t.appName}</h1>
          </div>
          <button 
            onClick={() => setLang(lang === Language.PT ? Language.EN : Language.PT)}
            className="text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1 rounded-md transition-colors"
          >
            {lang === Language.PT ? 'PT' : 'EN'}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 pb-24 z-10 overflow-y-auto">
           {currentTab === TabView.HOME ? renderHome() : renderEarn()}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-2 flex justify-around items-center z-30">
           <button 
            onClick={() => setCurrentTab(TabView.HOME)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-24 transition-all ${currentTab === TabView.HOME ? 'text-cyan-400 bg-cyan-900/20' : 'text-slate-500 hover:text-slate-300'}`}
           >
              <Icons.Power className="w-6 h-6" />
              <span className="text-[10px] font-bold">{t.home}</span>
           </button>
           <button 
            onClick={() => setCurrentTab(TabView.EARN)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-24 transition-all ${currentTab === TabView.EARN ? 'text-cyan-400 bg-cyan-900/20' : 'text-slate-500 hover:text-slate-300'}`}
           >
              <Icons.DollarSign className="w-6 h-6" />
              <span className="text-[10px] font-bold">{t.earn}</span>
           </button>
        </nav>

        {/* Support Chat Widget */}
        <SupportChat lang={lang} status={status} translations={TRANSLATIONS} />

        {/* Background Decoration */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      </div>
    </div>
  );
};

export default App;