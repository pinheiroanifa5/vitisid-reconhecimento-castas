import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Wine, 
  Sparkles, 
  Layers, 
  Share2, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { GrapeAnalysisResult } from '../types.ts';

interface AnalysisResultProps {
  result: GrapeAnalysisResult;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  // If not a grapevine
  if (!result.isVine) {
    return (
      <div className="w-full mt-6 rounded-3xl bg-amber-50/90 border-2 border-amber-300 p-6 sm:p-8 shadow-lg text-stone-800 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle className="w-6 h-6 text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Não Identificado
              </span>
            </div>
            <h3 className="font-serif-brand text-xl sm:text-2xl font-bold text-amber-950 mb-2">
              Não foi possível identificar como videira
            </h3>
            <p className="text-sm sm:text-base text-amber-900/90 leading-relaxed mb-4">
              {result.notVineReason ||
                'A imagem enviada não parece ser claramente uma folha, cacho de uvas ou planta de videira (Vitis vinifera).'}
            </p>

            <div className="p-4 rounded-2xl bg-white/80 border border-amber-200/80 text-xs sm:text-sm text-stone-700 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <Info className="w-4 h-4 text-emerald-700" />
                <span>Como tirar uma foto que o VitisID consiga identificar:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                <li>Fotografa uma <strong>folha adulta bem aberta</strong> ou um <strong>cacho de uvas</strong> da videira.</li>
                <li>Garante boa iluminação natural e evita sombras duras ou reflexos intensos.</li>
                <li>Assegura-te de que a imagem mostra a forma dos lóbulos ou a junção do pecíolo (caule da folha).</li>
              </ul>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={onReset}
                className="px-5 py-2.5 rounded-xl bg-[#1b3d22] hover:bg-[#142e18] text-white font-medium text-sm transition-all shadow-md cursor-pointer"
              >
                Tentar com outra fotografia
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle Grape Vine Identified
  const isRed = result.grapeType?.toLowerCase().includes('tinta');
  const isWhite = result.grapeType?.toLowerCase().includes('branca');
  const confidence = result.confidencePercentage ?? 85;
  const isLowConfidence = confidence < 60;

  const handleCopy = () => {
    const text = `VitisID - Identificação de Casta\nCasta: ${result.varietyName} (${result.grapeType || 'Vitis vinifera'})\nConfiança: ${confidence}% (${isLowConfidence ? 'Baixa - Não fiável' : result.confidenceLevel || 'Normal'})\nJustificação: ${result.justification || ''}\nRegiões: ${result.typicalRegions?.join(', ') || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full mt-6 space-y-5 animate-fade-in">
      {/* Prominent High-Visibility Warning Banner for Low Confidence */}
      {isLowConfidence && (
        <div className="rounded-2xl bg-amber-500/15 border-2 border-amber-500/70 p-4 sm:p-5 shadow-sm text-amber-950 flex items-start gap-3.5 animate-pulse-subtle">
          <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-800" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950">
                Aviso de Fiabilidade
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-amber-950">
              Confiança baixa — resultado pode não ser fiável
            </h3>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed mt-1">
              A imagem fornecida não apresenta detalhes ampelográficos suficientes (ou a resolução/iluminação é parcial) para determinar com precisão a casta. A identificação abaixo é apenas uma <strong>hipótese provável</strong> e não uma certeza botânica.
            </p>
          </div>
        </div>
      )}

      {/* Primary Variety Identification Card */}
      <div className={`rounded-3xl bg-white border shadow-xl overflow-hidden ${
        isLowConfidence ? 'border-amber-400/50' : 'border-[#2d4b32]/20'
      }`}>
        {/* Top Header Banner */}
        <div className={`p-6 sm:p-8 text-white relative ${
          isLowConfidence
            ? 'bg-gradient-to-r from-[#2c2016] via-[#3a2c1b] to-[#201811]'
            : 'bg-gradient-to-r from-[#173a1e] via-[#1f4827] to-[#142e18]'
        }`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs ${
                    isLowConfidence
                      ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40'
                      : isRed
                      ? 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
                      : isWhite
                      ? 'bg-amber-900/70 text-amber-200 border border-amber-400/40'
                      : 'bg-emerald-900 text-emerald-200 border border-emerald-500/40'
                  }`}
                >
                  <Wine className="w-3.5 h-3.5" />
                  {isLowConfidence ? 'Casta Sugerida' : `Casta ${result.grapeType || 'Identificada'}`}
                </span>

                {isLowConfidence ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/25 text-amber-200 border border-amber-400/40 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                    Confiança baixa ({confidence}%)
                  </span>
                ) : (
                  result.confidenceLevel && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      {result.confidenceLevel} Confiança
                    </span>
                  )
                )}
              </div>

              {isLowConfidence && (
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/90 block mb-1">
                  Hipótese provável (não confirmada):
                </span>
              )}

              <h2 className="font-serif-brand text-2xl sm:text-4xl font-extrabold text-amber-50 tracking-tight flex flex-wrap items-baseline gap-2">
                <span>{result.varietyName}</span>
                {isLowConfidence && (
                  <span className="text-xs sm:text-sm font-sans font-normal text-amber-300/90 italic bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                    inconclusivo
                  </span>
                )}
              </h2>

              {result.scientificClassification && (
                <p className="text-xs sm:text-sm text-emerald-200/80 italic mt-1 font-serif">
                  {result.scientificClassification}
                </p>
              )}
            </div>

            {/* Confidence Circle / Meter */}
            <div className={`backdrop-blur-xs rounded-2xl p-3 sm:p-4 border text-center shrink-0 min-w-[120px] ${
              isLowConfidence 
                ? 'bg-amber-950/40 border-amber-400/30' 
                : 'bg-black/30 border-white/10'
            }`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider block mb-0.5 ${
                isLowConfidence ? 'text-amber-300' : 'text-amber-200/70'
              }`}>
                {isLowConfidence ? 'Confiança Baixa' : 'Nível de Confiança'}
              </span>
              <div className={`text-2xl sm:text-3xl font-extrabold font-serif-brand ${
                isLowConfidence ? 'text-amber-300' : 'text-[#f3d994]'
              }`}>
                {confidence}%
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isLowConfidence
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-amber-400 to-emerald-400'
                  }`}
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              {isLowConfidence && (
                <span className="text-[10px] text-amber-200/80 block mt-1 font-medium">
                  Não fiável
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Low Confidence Callout Notice in Card */}
        {isLowConfidence && (
          <div className="p-4 sm:p-5 bg-amber-50/90 border-b border-amber-200/80 text-amber-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="text-amber-900 block font-bold mb-0.5">
                Como obter uma identificação de alta confiança:
              </strong>
              <p className="text-stone-700 leading-relaxed">
                Fotografa uma folha adulta bem aberta sob iluminação natural, enquadrando o recorte dos lóbulos foliares e a inserção do pecíolo (caule), ou um cacho com bagos bem focados.
              </p>
            </div>
          </div>
        )}

        {/* Justification Box (Highlighted with Concrete Morphological Traits) */}
        <div className="p-5 sm:p-7 border-b border-stone-200/70 bg-gradient-to-b from-amber-50/70 to-white">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#c5a059]/20 text-[#8e6c27] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#795a1c]">
                  Justificação Ampelográfica
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                  Caracteres Morfológicos Concretos
                </span>
              </div>
              <p className="text-sm sm:text-base text-stone-800 font-medium leading-relaxed italic">
                "{result.justification || 'Identificação baseada na morfologia da folha, no contorno dos lóbulos e nos caracteres observados na fotografia.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Ampelographic Morphological Criteria */}
        {result.keyFeatures && (
          <div className="p-5 sm:p-7 border-b border-stone-200/70 bg-stone-50/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Diagnóstico Morfológico Detalhado</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {result.keyFeatures.leafLimboAndLobes && (
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide block mb-1">
                    Limbo e Lóbulos da Folha
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    {result.keyFeatures.leafLimboAndLobes}
                  </p>
                </div>
              )}

              {result.keyFeatures.petiolarSinus && (
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide block mb-1">
                    Seio Peciolar
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    {result.keyFeatures.petiolarSinus}
                  </p>
                </div>
              )}

              {result.keyFeatures.leafTeeth && (
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide block mb-1">
                    Dentes Marginais
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    {result.keyFeatures.leafTeeth}
                  </p>
                </div>
              )}

              {result.keyFeatures.clusterAndBerry && (
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide block mb-1">
                    Cacho e Bago
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    {result.keyFeatures.clusterAndBerry}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Viticultural & Enological Context */}
        <div className="p-5 sm:p-7 space-y-4">
          {/* Wine Profile */}
          {result.wineProfile && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
              <div className="flex items-start gap-2.5">
                <Wine className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1">
                    Perfil no Vinho
                  </h5>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {result.wineProfile}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Typical Regions & Synonyms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {result.typicalRegions && result.typicalRegions.length > 0 && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-600" />
                  <span>Regiões Típicas</span>
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {result.typicalRegions.map((reg, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200/80 text-stone-800 font-medium"
                    >
                      {reg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.synonyms && result.synonyms.length > 0 && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
                  <span>Sinónimos Conhecidos</span>
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {result.synonyms.map((syn, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 font-medium"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Similar varieties distinction if any */}
          {result.similarVarieties && result.similarVarieties.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Castas Morfologicamente Próximas
              </h5>
              <div className="space-y-1.5">
                {result.similarVarieties.map((item, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 flex items-start gap-2"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900">{item.name}:</strong> {item.distinction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50/80 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#1b3d22] hover:bg-[#142e18] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            Analisar Outra Videira
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-stone-500" />
                <span>Copiar Resumo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
