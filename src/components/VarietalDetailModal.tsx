import React from 'react';
import { 
  X, 
  MapPin, 
  Wine, 
  Utensils, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import { GrapeVarietal } from '../types.ts';

interface VarietalDetailModalProps {
  varietal: GrapeVarietal | null;
  onClose: () => void;
}

export const VarietalDetailModal: React.FC<VarietalDetailModalProps> = ({ varietal, onClose }) => {
  if (!varietal) return null;

  const isRed = varietal.type === 'Tinta';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fcfbf8] text-[#1c261e] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-300 relative">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#16381c] via-[#1c4524] to-[#133018] text-white p-5 sm:p-7 rounded-t-3xl flex items-start justify-between gap-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isRed
                    ? 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
                    : 'bg-amber-900/80 text-amber-200 border border-amber-400/40'
                }`}
              >
                <Wine className="w-3.5 h-3.5" />
                Casta {varietal.type}
              </span>

              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-100 border border-white/20 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-300" />
                {varietal.originRegion}
              </span>
            </div>

            <h2 className="font-serif-brand text-2xl sm:text-3xl font-extrabold text-amber-50">
              {varietal.name}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 italic font-serif">
              {varietal.scientificName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fechar ficha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Synonyms if any */}
          {varietal.synonyms && varietal.synonyms.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-stone-600 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
              <span className="font-bold text-amber-900">Sinónimos conhecidos:</span>
              {varietal.synonyms.map((syn, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-stone-800"
                >
                  {syn}
                </span>
              ))}
            </div>
          )}

          {/* Flavor Profile Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#142e18] flex items-center gap-1.5">
              <Wine className="w-4 h-4 text-emerald-700" />
              <span>Perfil Típico de Sabor & Aromas</span>
            </h3>

            {/* Aromas Tag Cloud */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block mb-1.5 uppercase">
                Aromas Primários Predominantes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {varietal.flavorProfile.aromas.map((aroma, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-950 font-medium"
                  >
                    {aroma}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics: Acidity, Body, Tannins */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Acidez</span>
                <span className="text-xs font-bold text-stone-800">{varietal.flavorProfile.acidity}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Corpo</span>
                <span className="text-xs font-bold text-stone-800">{varietal.flavorProfile.body}</span>
              </div>
              {varietal.flavorProfile.tannins && (
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Taninos</span>
                  <span className="text-xs font-bold text-stone-800">{varietal.flavorProfile.tannins}</span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-1">
              {varietal.flavorProfile.tastingNotes}
            </p>
          </div>

          {/* Food Pairing Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-amber-700" />
              <span>Sugestões de Harmonização Gastronómica</span>
            </h3>

            <p className="text-xs sm:text-sm text-stone-800 font-medium italic">
              "{varietal.foodPairing.summary}"
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Pratos Recomendados:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {varietal.foodPairing.dishes.map((dish, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-white border border-amber-200/60 text-xs text-stone-700 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                    <span>{dish}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Queijos Ideais:</span>
              <div className="flex flex-wrap gap-1.5">
                {varietal.foodPairing.cheeses.map((cheese, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium"
                  >
                    {cheese}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ampelographic Leaf & Bunch Diagnostic Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-800" />
              <span>Identificação Ampelográfica na Vinha</span>
            </h3>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/70">
                <strong className="text-emerald-950 block mb-0.5">Folha & Lóbulos:</strong>
                <span>{varietal.ampelography.leaf} {varietal.ampelography.lobes}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-stone-200/70">
                <strong className="text-emerald-950 block mb-0.5">Seio Peciolar:</strong>
                <span>{varietal.ampelography.petiolarSinus}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-stone-200/70">
                <strong className="text-emerald-950 block mb-0.5">Cacho & Bago:</strong>
                <span>{varietal.ampelography.bunch} {varietal.ampelography.berry}</span>
              </div>
            </div>
          </div>

          {/* Enological Potential */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-xs text-emerald-950 flex items-start gap-3">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5">Potencial Enológico & Guarda:</strong>
              <p className="text-emerald-900/90 leading-relaxed">{varietal.enologicalPotential}</p>
            </div>
          </div>

          {/* Main Regions */}
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wide block mb-1.5">
              Regiões Principais de Cultivo:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {varietal.cultivationRegions.map((region, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-medium"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100/90 border-t border-stone-200 flex justify-end rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1b3d22] hover:bg-[#142e18] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Fechar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
