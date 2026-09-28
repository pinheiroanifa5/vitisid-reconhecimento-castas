import React from 'react';
import { X, CheckCircle2, AlertCircle, Eye, Camera, Sun } from 'lucide-react';

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TipsModal: React.FC<TipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fcfbf7] text-[#1c261e] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-900/10 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200/70 text-stone-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-brand font-bold text-lg text-emerald-950">
              Guia de Identificação Ampelográfica
            </h3>
            <p className="text-xs text-stone-500">Como obter o melhor resultado no VitisID</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-stone-700">
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 block mb-0.5">1. Escolhe uma folha adulta</strong>
                <p className="text-xs text-emerald-900/80">
                  A folha mais fiável para diagnóstico botânico situa-se no terço médio do sarmento (nem muito jovem no topo, nem senescente na base).
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60">
            <div className="flex items-start gap-2.5">
              <Eye className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 block mb-0.5">2. Mostra o recorte e o seio peciolar</strong>
                <p className="text-xs text-emerald-900/80">
                  Estica a folha o máximo possível para evidenciar o número de lóbulos (3, 5 ou 7), os recortes laterais e a abertura junto ao pecíolo (caule da folha).
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60">
            <div className="flex items-start gap-2.5">
              <Sun className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 block mb-0.5">3. Boa luz natural sem sombras duras</strong>
                <p className="text-xs text-emerald-900/80">
                  Evita reflexos intensos do sol ou flash que ocultem a textura das nervuras e os dentes marginais.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/60">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 block mb-0.5">Identificação por Cacho de Uvas</strong>
                <p className="text-xs text-amber-900/80">
                  Se fotografares um cacho, tenta enquadrar também uma folha adjacente da mesma videira. A combinação da folha e cacho aumenta consideravelmente o nível de certeza.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1b3d22] hover:bg-[#142f1a] text-white font-medium text-sm transition-colors cursor-pointer shadow-md"
        >
          Entendido, voltar à identificação
        </button>
      </div>
    </div>
  );
};
