import React, { useState } from 'react';
import { 
  HistoryEntry, 
  GrapeAnalysisResult 
} from '../types.ts';
import { 
  Clock, 
  Trash2, 
  ChevronRight, 
  Wine, 
  ShieldCheck, 
  Camera, 
  AlertCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface HistoryViewProps {
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  onDeleteEntry: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
  onNavigateToIdentifier: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectEntry,
  onDeleteEntry,
  onClearHistory,
  onNavigateToIdentifier,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'Tinta' | 'Branca'>('all');

  const filteredHistory = history.filter((entry) => {
    if (filterType === 'all') return true;
    return entry.grapeType.toLowerCase().includes(filterType.toLowerCase());
  });

  if (history.length === 0) {
    return (
      <div className="w-full text-center py-12 px-4 rounded-3xl bg-white/70 border border-stone-200/80 shadow-sm animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-[#987630]" />
        </div>
        <h3 className="font-serif-brand text-xl font-bold text-stone-900 mb-2">
          Ainda não tens identificações gravadas
        </h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
          Quando fotografares uma folha ou cacho de videira, a identificação ficará guardada aqui automaticamente para consulta futura.
        </p>
        <button
          type="button"
          onClick={onNavigateToIdentifier}
          className="px-5 py-2.5 rounded-xl bg-[#1b3d22] hover:bg-[#142e18] text-white text-sm font-semibold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4 text-amber-300" />
          <span>Fazer Primeira Identificação</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 animate-fade-in">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div>
          <h2 className="font-serif-brand text-xl font-bold text-[#142e18] flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700" />
            <span>Histórico de Identificações</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-sans font-semibold">
              {history.length}
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Registo cronológico das videiras e castas analisadas
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Pills */}
          <div className="inline-flex rounded-xl p-1 bg-stone-100 border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todas ({history.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('Tinta')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === 'Tinta'
                  ? 'bg-rose-100 text-rose-900 shadow-2xs'
                  : 'text-stone-600 hover:text-rose-900'
              }`}
            >
              Tintas
            </button>
            <button
              type="button"
              onClick={() => setFilterType('Branca')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === 'Branca'
                  ? 'bg-amber-100 text-amber-900 shadow-2xs'
                  : 'text-stone-600 hover:text-amber-900'
              }`}
            >
              Brancas
            </button>
          </div>

          <button
            type="button"
            onClick={onClearHistory}
            className="p-2 rounded-xl text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
            title="Limpar todo o histórico"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredHistory.map((item) => {
          const isRed = item.grapeType.toLowerCase().includes('tinta');
          const isWhite = item.grapeType.toLowerCase().includes('branca');

          return (
            <div
              key={item.id}
              onClick={() => onSelectEntry(item)}
              className="group bg-white hover:bg-stone-50/90 rounded-2xl border border-stone-200/90 p-4 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden"
            >
              {/* Thumbnail of uploaded photo */}
              <div className="w-full sm:w-24 h-36 sm:h-24 rounded-xl overflow-hidden bg-stone-900 shrink-0 relative border border-stone-200">
                <img
                  src={item.uploadedImage}
                  alt={item.identifiedGrape}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shadow-xs ${
                      isRed
                        ? 'bg-rose-900 text-rose-100'
                        : isWhite
                        ? 'bg-amber-800 text-amber-100'
                        : 'bg-emerald-900 text-emerald-100'
                    }`}
                  >
                    {item.grapeType}
                  </span>
                </div>
              </div>

              {/* Main Information */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-serif-brand text-lg font-bold text-stone-900 truncate">
                    {item.identifiedGrape}
                  </h3>

                  {item.confidencePercentage < 60 ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      Confiança baixa — resultado pode não ser fiável ({item.confidencePercentage}%)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {item.confidencePercentage}% ({item.confidenceLevel})
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 italic mb-2">
                  "{item.justification}"
                </p>

                <div className="flex items-center gap-3 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1 text-stone-500">
                    <Clock className="w-3.5 h-3.5" />
                    {item.formattedDate}
                  </span>

                  {item.fullResult.typicalRegions && item.fullResult.typicalRegions.length > 0 && (
                    <span className="hidden md:inline text-stone-500">
                      Regiões: {item.fullResult.typicalRegions.slice(0, 3).join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                <button
                  type="button"
                  onClick={(e) => onDeleteEntry(item.id, e)}
                  className="p-2 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Eliminar este registo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#1b3d22] group-hover:text-amber-800 transition-colors">
                  <span>Ver Ficha</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
