import React, { useState, useMemo } from 'react';
import { GRAPE_DATABASE } from '../data/grapeDatabase.ts';
import { GrapeVarietal } from '../types.ts';
import { VarietalDetailModal } from './VarietalDetailModal.tsx';
import { 
  Search, 
  Wine, 
  MapPin, 
  Utensils, 
  Sparkles, 
  ChevronRight, 
  BookOpen,
  Filter
} from 'lucide-react';

export const VarietalsDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Tinta' | 'Branca'>('all');
  const [selectedVarietal, setSelectedVarietal] = useState<GrapeVarietal | null>(null);

  const filteredVarietals = useMemo(() => {
    return GRAPE_DATABASE.filter((v) => {
      // Type filter
      if (typeFilter !== 'all' && v.type !== typeFilter) {
        return false;
      }

      // Search term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();

      return (
        v.name.toLowerCase().includes(term) ||
        v.originRegion.toLowerCase().includes(term) ||
        v.synonyms.some((s) => s.toLowerCase().includes(term)) ||
        v.cultivationRegions.some((r) => r.toLowerCase().includes(term)) ||
        v.flavorProfile.aromas.some((a) => a.toLowerCase().includes(term)) ||
        v.foodPairing.summary.toLowerCase().includes(term) ||
        v.foodPairing.dishes.some((d) => d.toLowerCase().includes(term))
      );
    });
  }, [searchTerm, typeFilter]);

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Search & Filter Bar */}
      <div className="bg-white/80 p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-3.5">
        <div>
          <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-[#142e18] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <span>Catálogo Botânico & Enológico de Castas</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Explora as castas nobres, as suas origens territoriais, perfis aromáticos e as melhores harmonizações gastronómicas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por casta, região, aromas (ex: violetas, pêssego) ou prato..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1b3d22] transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Type Filters */}
          <div className="inline-flex rounded-xl p-1 bg-stone-100 border border-stone-200 text-xs w-full sm:w-auto shrink-0 justify-center">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                typeFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todas ({GRAPE_DATABASE.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('Tinta')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                typeFilter === 'Tinta'
                  ? 'bg-rose-100 text-rose-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-rose-900'
              }`}
            >
              Tintas
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('Branca')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                typeFilter === 'Branca'
                  ? 'bg-amber-100 text-amber-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-amber-900'
              }`}
            >
              Brancas
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Varietal Cards */}
      {filteredVarietals.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white/60 border border-stone-200">
          <Wine className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-600 font-medium text-sm">
            Nenhuma casta encontrada para "{searchTerm}".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
            }}
            className="mt-3 text-xs text-emerald-800 font-semibold underline"
          >
            Ver todas as castas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVarietals.map((varietal) => {
            const isRed = varietal.type === 'Tinta';

            return (
              <div
                key={varietal.id}
                onClick={() => setSelectedVarietal(varietal)}
                className="group bg-white hover:bg-[#fbfaf6] rounded-2xl border border-stone-200/90 p-5 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Type badge & Origin */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isRed
                          ? 'bg-rose-100 text-rose-900 border border-rose-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {varietal.type}
                    </span>

                    <span className="text-[11px] text-stone-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span className="truncate">{varietal.originRegion}</span>
                    </span>
                  </div>

                  {/* Varietal Name */}
                  <h3 className="font-serif-brand text-lg font-bold text-stone-900 group-hover:text-[#142e18] transition-colors">
                    {varietal.name}
                  </h3>

                  <p className="text-xs text-stone-400 italic mb-3">
                    {varietal.scientificName}
                  </p>

                  {/* Flavor Profile Aromas */}
                  <div className="mb-3">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Aromas Típicos:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {varietal.flavorProfile.aromas.slice(0, 4).map((aroma, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                        >
                          {aroma}
                        </span>
                      ))}
                      {varietal.flavorProfile.aromas.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-50 text-stone-400">
                          +{varietal.flavorProfile.aromas.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Food Pairing Preview */}
                  <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-amber-950 font-semibold mb-0.5">
                      <Utensils className="w-3.5 h-3.5 text-amber-700" />
                      <span>Harmonização:</span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 italic">
                      {varietal.foodPairing.summary}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#1b3d22] group-hover:text-amber-800 transition-colors">
                  <span>Ver Ficha Ampelográfica Completa</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <VarietalDetailModal
        varietal={selectedVarietal}
        onClose={() => setSelectedVarietal(null)}
      />
    </div>
  );
};
