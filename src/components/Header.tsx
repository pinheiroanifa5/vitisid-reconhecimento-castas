import React from 'react';
import { Grape, Camera, Clock, BookOpen, HelpCircle } from 'lucide-react';
import { ActiveTab } from '../types.ts';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  historyCount: number;
  onOpenTips: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  historyCount,
  onOpenTips,
}) => {
  return (
    <header className="border-b border-[#2d4b32]/20 bg-gradient-to-r from-[#142e18] via-[#1a3d20] to-[#122816] text-[#f7f6f0] shadow-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Brand & Action row */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#c8a15a] to-[#99742e] p-0.5 shadow-inner flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#16351c] rounded-[10px] flex items-center justify-center text-[#e8c87b]">
                <Grape className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-brand text-xl sm:text-2xl font-bold tracking-wide text-amber-50">
                  VitisID
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-[#edd28d] border border-amber-400/30">
                  Ampelografia
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-100/70 font-normal">
                Identificação & Catálogo de Castas de Videira
              </p>
            </div>
          </div>

          <button
            onClick={onOpenTips}
            className="text-xs px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/50 text-amber-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Conselhos para uma boa identificação"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#dec078]" />
            <span className="hidden sm:inline">Guia de Fotos</span>
            <span className="sm:hidden">Guia</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 pt-1 border-t border-emerald-800/40">
          <button
            type="button"
            onClick={() => onTabChange('identifier')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'identifier'
                ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-xs'
                : 'text-emerald-100/75 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Identificador</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
              activeTab === 'history'
                ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-xs'
                : 'text-emerald-100/75 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Histórico</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#cba65f] text-emerald-950">
                {historyCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('database')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-xs'
                : 'text-emerald-100/75 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Catálogo de Castas</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
