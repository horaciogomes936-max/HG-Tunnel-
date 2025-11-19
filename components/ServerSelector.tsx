import React from 'react';
import { ServerNode } from '../types';
import { Icons } from './Icons';

interface ServerSelectorProps {
  servers: ServerNode[];
  selected: ServerNode;
  onSelect: (server: ServerNode) => void;
  disabled: boolean;
}

export const ServerSelector: React.FC<ServerSelectorProps> = ({ servers, selected, onSelect, disabled }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full relative z-20">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
          disabled 
            ? 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed' 
            : 'bg-slate-800 border-slate-600 hover:border-cyan-400 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selected.flag}</span>
          <div className="flex flex-col items-start">
            <span className="font-bold text-white text-sm">{selected.name}</span>
            <span className="text-xs text-slate-400">{selected.network || 'Standard'} • {selected.ping}ms</span>
          </div>
        </div>
        <Icons.Globe className="w-5 h-5 text-cyan-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {servers.map((server) => (
            <button
              key={server.id}
              onClick={() => {
                onSelect(server);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-0"
            >
              <span className="text-xl">{server.flag}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white">{server.name}</span>
                <span className="text-xs text-slate-400">{server.network || 'Standard'}</span>
              </div>
              {selected.id === server.id && <Icons.ShieldCheck className="w-4 h-4 text-green-500 ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};