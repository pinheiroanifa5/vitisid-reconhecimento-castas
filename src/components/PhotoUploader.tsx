import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, RefreshCw, Upload, Check } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages.ts';
import { SampleImage } from '../types.ts';

interface PhotoUploaderProps {
  currentImageBase64: string | null;
  selectedSampleId: string | null;
  isLoading: boolean;
  retryAttempt?: number;
  onImageSelected: (base64: string, mimeType: string, sampleId?: string) => void;
  onReset: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentImageBase64,
  selectedSampleId,
  isLoading,
  retryAttempt = 0,
  onImageSelected,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onImageSelected(reader.result as string, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
    // Reset file input so re-selecting same photo triggers onChange
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelected(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = async (sample: SampleImage) => {
    try {
      const response = await fetch(sample.imageSrc);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelected(reader.result as string, blob.type || 'image/jpeg', sample.id);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Erro ao carregar amostra:', err);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden inputs for gallery and direct camera */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Main Central Upload & Preview Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 transition-all overflow-hidden ${
          isDragging
            ? 'border-amber-500 bg-amber-50/50 shadow-xl scale-[1.01]'
            : currentImageBase64
            ? 'border-[#2d4b32]/30 bg-stone-900 shadow-xl'
            : 'border-dashed border-[#b9a16b] bg-white/70 hover:bg-white/90 hover:border-[#8e6e30] shadow-sm'
        }`}
      >
        {currentImageBase64 ? (
          /* Preview state with photo */
          <div className="relative flex flex-col items-center justify-center p-3 sm:p-5 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950">
            <div className="relative max-h-[380px] sm:max-h-[440px] w-full flex items-center justify-center rounded-2xl overflow-hidden bg-black/40">
              <img
                src={currentImageBase64}
                alt="Fotografia da videira submetida"
                className="max-h-[360px] sm:max-h-[420px] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />

              {/* Loading overlay if analyzing */}
              {isLoading && (
                <div className="absolute inset-0 bg-[#0e2112]/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 text-white z-20">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-400/20 border-t-[#d8b15d] animate-spin"></div>
                    <Sparkles className="w-8 h-8 text-[#f0d48f] animate-pulse" />
                  </div>
                  <h3 className="font-serif-brand text-lg sm:text-xl font-bold text-amber-100 mb-1">
                    {retryAttempt > 0
                      ? `A restabelecer ligação (tentativa ${retryAttempt + 1} de 3)...`
                      : 'A analisar caracteres ampelográficos...'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xs">
                    {retryAttempt > 0
                      ? 'Aguardando confirmação do serviço botânico. A tentar novamente de forma automática...'
                      : 'A inspecionar forma do limbo, número de lóbulos, recorte do seio peciolar e dentição foliar.'}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions on Preview */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isLoading}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium border border-white/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-amber-300" />
                <span>Nova Foto</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium border border-white/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4 text-amber-300" />
                <span>Escolher da Galeria</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                disabled={isLoading}
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-200 text-xs sm:text-sm font-medium border border-red-800/40 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Limpar imagem"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Limpar</span>
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Initial Upload prompt */
          <div className="py-10 px-5 sm:py-14 sm:px-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#1b3d22] to-[#2d6136] text-[#e3be70] p-0.5 shadow-lg flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#18391f] rounded-[14px] flex items-center justify-center">
                <Upload className="w-8 h-8 sm:w-9 sm:h-9 text-[#ecc87b]" />
              </div>
            </div>

            <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-[#142e18] mb-2">
              Carrega ou fotografa a videira
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6 sm:mb-8 leading-relaxed">
              Tira uma fotografia nítida de uma <strong className="text-stone-800">folha adulta</strong>, de um <strong className="text-stone-800">cacho de uvas</strong> ou da <strong className="text-stone-800">planta</strong> para identificar a casta instantaneamente.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-[#1b3d22] hover:bg-[#142e18] text-[#fbfaf6] font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-[#cba65f]/40"
              >
                <Camera className="w-5 h-5 text-amber-300" />
                <span>Tirar Fotografia</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm shadow-xs hover:shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-stone-300"
              >
                <ImageIcon className="w-5 h-5 text-emerald-800" />
                <span>Abrir Galeria</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400 mt-4">
              Arrasta e larga a imagem aqui ou usa a câmara do telemóvel (JPG, PNG, WEBP)
            </p>
          </div>
        )}
      </div>

      {/* Quick Test Samples Bar */}
      <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Sem foto à mão? Experimenta um exemplo:</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_IMAGES.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                disabled={isLoading}
                className={`flex items-center gap-3 p-2 rounded-xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-600 shadow-sm ring-1 ring-amber-600'
                    : 'bg-white/80 hover:bg-white border-amber-200/70 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-200 relative border border-stone-300">
                  <img
                    src={sample.imageSrc}
                    alt={sample.title}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#1b3d22]/50 flex items-center justify-center text-white">
                      <Check className="w-5 h-5 text-amber-300" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-stone-900 truncate">
                      {sample.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase shrink-0 ${
                        sample.typeBadge === 'Tinta'
                          ? 'bg-rose-100 text-rose-800'
                          : sample.typeBadge === 'Branca'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {sample.typeBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    {sample.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
