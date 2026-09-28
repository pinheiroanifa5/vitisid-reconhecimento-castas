/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { PhotoUploader } from './components/PhotoUploader.tsx';
import { AnalysisResult } from './components/AnalysisResult.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { VarietalsDatabase } from './components/VarietalsDatabase.tsx';
import { TipsModal } from './components/TipsModal.tsx';
import { GrapeAnalysisResult, HistoryEntry, ActiveTab } from './types.ts';
import { AlertCircle, RotateCcw, Sprout, ArrowLeft } from 'lucide-react';
import tourigaSampleImg from './assets/images/touriga_nacional_1790179827503.jpg';
import alvarinhoSampleImg from './assets/images/alvarinho_grapes_1790179839791.jpg';

const STORAGE_KEY = 'vitisid_identification_history_v1';

// Seed initial history entries for immediate rich experience
const INITIAL_HISTORY_SEED: HistoryEntry[] = [
  {
    id: 'seed-touriga',
    timestamp: Date.now() - 3600000 * 5,
    formattedDate: 'Hoje, 11:20',
    uploadedImage: tourigaSampleImg,
    identifiedGrape: 'Touriga Nacional',
    scientificName: 'Vitis vinifera L. cv. Touriga Nacional',
    grapeType: 'Tinta',
    confidencePercentage: 94,
    confidenceLevel: 'Alta',
    justification: 'Folha adulta quinquelobada com seios laterais superiores muito profundos em lira fechada e seio peciolar em ferradura aberta.',
    fullResult: {
      isVine: true,
      varietyName: 'Touriga Nacional',
      scientificClassification: 'Vitis vinifera L. cv. Touriga Nacional',
      grapeType: 'Tinta',
      confidencePercentage: 94,
      confidenceLevel: 'Alta',
      justification: 'Folha adulta quinquelobada com seios laterais superiores muito profundos em lira fechada e seio peciolar em ferradura aberta.',
      keyFeatures: {
        leafLimboAndLobes: 'Folha quinquelobada média com 5 lóbulos marcadamente delineados.',
        petiolarSinus: 'Em lira aberta com fundo arredondado em ferradura.',
        leafTeeth: 'Dentes médios e convexos com ápices ligeiramente arredondados.',
        clusterAndBerry: 'Cacho pequeno e cónico, bagos pequenos negro-azulados com pruína espessa.',
      },
      typicalRegions: ['Douro', 'Dão', 'Alentejo', 'Bairrada'],
      synonyms: ['Mortágua', 'Preto Mortágua', 'Bical Tinto'],
      wineProfile: 'Vinhos de cor profunda, aromas a violetas e esteva, com excelente longevidade e taninos nobres.',
    },
  },
  {
    id: 'seed-alvarinho',
    timestamp: Date.now() - 3600000 * 28,
    formattedDate: 'Ontem, 16:45',
    uploadedImage: alvarinhoSampleImg,
    identifiedGrape: 'Alvarinho',
    scientificName: 'Vitis vinifera L. cv. Alvarinho',
    grapeType: 'Branca',
    confidencePercentage: 91,
    confidenceLevel: 'Alta',
    justification: 'Cacho muito pequeno e alado com bagos esféricos dourados e folha orbicular trilobada de seio peciolar em lira aberta.',
    fullResult: {
      isVine: true,
      varietyName: 'Alvarinho',
      scientificClassification: 'Vitis vinifera L. cv. Alvarinho',
      grapeType: 'Branca',
      confidencePercentage: 91,
      confidenceLevel: 'Alta',
      justification: 'Cacho muito pequeno e alado com bagos esféricos dourados e folha orbicular trilobada de seio peciolar em lira aberta.',
      keyFeatures: {
        leafLimboAndLobes: 'Folha orbicular de tamanho pequeno a médio com lóbulos pouco profundos.',
        petiolarSinus: 'Em lira aberta com base em U.',
        leafTeeth: 'Dentes curtos e convexos.',
        clusterAndBerry: 'Cacho pequeno alado, bagos pequenos dourados com película espessa.',
      },
      typicalRegions: ['Vinho Verde (Monção e Melgaço)', 'Galiza'],
      synonyms: ['Albariño', 'Caimiño'],
      wineProfile: 'Vinhos aromáticos com notas de pêssego, flor de laranjeira e excelente acidez mineral e salina.',
    },
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('identifier');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GrapeAnalysisResult | null>(null);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          return;
        }
      }
      // Seed if empty
      setHistory(INITIAL_HISTORY_SEED);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HISTORY_SEED));
    } catch (e) {
      console.error('Erro ao ler histórico de localStorage:', e);
      setHistory(INITIAL_HISTORY_SEED);
    }
  }, []);

  const saveToHistory = (newResult: GrapeAnalysisResult, image: string) => {
    if (!newResult.isVine || !newResult.varietyName) return;

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'short',
    })}, ${now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;

    const entry: HistoryEntry = {
      id: `scan-${Date.now()}`,
      timestamp: Date.now(),
      formattedDate,
      uploadedImage: image,
      identifiedGrape: newResult.varietyName,
      scientificName: newResult.scientificClassification,
      grapeType: newResult.grapeType || 'Tinta',
      confidencePercentage: newResult.confidencePercentage ?? 85,
      confidenceLevel: newResult.confidenceLevel || 'Alta',
      justification:
        newResult.justification ||
        'Identificação realizada através de correspondência morfológica ampelográfica.',
      fullResult: newResult,
    };

    setHistory((prev) => {
      const updated = [entry, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
      } catch (err) {
        console.warn('Não foi possível gravar no localStorage (limite de quota).');
      }
      return updated;
    });
  };

  const analyzeImage = async (base64: string, mimeType: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setRetryAttempt(0);

    const maxRetries = 2; // Up to 2 automatic retries (3 attempts total)
    let lastError: Error | null = null;
    let identifiedData: GrapeAnalysisResult | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        setRetryAttempt(attempt);
        // Backoff delay before auto-retry
        await new Promise((resolve) => setTimeout(resolve, 1000 + attempt * 800));
      }

      try {
        const response = await fetch('/api/identify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: mimeType || 'image/jpeg',
          }),
        });

        // 1. Verify if the response has a JSON content type and is valid JSON before interpreting
        const contentType = response.headers.get('content-type') || '';
        const rawText = await response.text();
        const trimmed = rawText.trim();

        // Check if the response body is HTML (e.g. <!doctype html... or starts with <)
        const isHtml =
          contentType.includes('text/html') ||
          trimmed.startsWith('<') ||
          trimmed.toLowerCase().startsWith('<!doctype');

        if (isHtml) {
          throw new Error('INVALID_NON_JSON_RESPONSE');
        }

        // Safely parse JSON
        let parsedData: any;
        try {
          parsedData = JSON.parse(rawText);
        } catch {
          throw new Error('INVALID_NON_JSON_RESPONSE');
        }

        // If HTTP status is not OK (e.g. 500, 503, 400), check returned JSON error
        if (!response.ok) {
          const serverError = parsedData?.error || parsedData?.details || '';
          if (
            response.status === 503 ||
            serverError.includes('temporariamente') ||
            serverError.includes('UNAVAILABLE') ||
            serverError.includes('high demand')
          ) {
            throw new Error('SERVICE_TEMPORARILY_UNAVAILABLE');
          }
          throw new Error(serverError || 'SERVICE_ERROR');
        }

        // Ensure returned data is a valid analysis object
        if (!parsedData || typeof parsedData !== 'object' || typeof parsedData.isVine !== 'boolean') {
          throw new Error('INVALID_NON_JSON_RESPONSE');
        }

        identifiedData = parsedData as GrapeAnalysisResult;
        break; // Success! Exit retry loop
      } catch (err: any) {
        lastError = err;
        console.warn(
          `[VitisID] Tentativa ${attempt + 1} de ${maxRetries + 1} falhou:`,
          err?.message || err
        );
        // Will loop to next attempt if attempt < maxRetries
      }
    }

    if (identifiedData) {
      setResult(identifiedData);
      if (identifiedData.isVine) {
        saveToHistory(identifiedData, base64);
      }
    } else {
      // 2. All retries failed: show friendly error to user instead of technical JSON error
      const errMsg = lastError?.message || '';

      if (
        errMsg === 'INVALID_NON_JSON_RESPONSE' ||
        errMsg.includes('<') ||
        errMsg.includes('doctype') ||
        errMsg.includes('token') ||
        errMsg.includes('JSON') ||
        errMsg.includes('SyntaxError') ||
        errMsg.includes('fetch failed') ||
        errMsg === 'SERVICE_ERROR'
      ) {
        setError('Não foi possível obter resposta do serviço, tenta novamente.');
      } else if (errMsg === 'SERVICE_TEMPORARILY_UNAVAILABLE') {
        setError('O serviço está temporariamente indisponível, tenta novamente em instantes.');
      } else {
        setError(errMsg || 'Não foi possível obter resposta do serviço, tenta novamente.');
      }
    }

    setIsLoading(false);
    setRetryAttempt(0);
  };

  const handleImageSelected = (base64: string, mimeType: string, sampleId?: string) => {
    setImageBase64(base64);
    setSelectedSampleId(sampleId || null);
    analyzeImage(base64, mimeType);
  };

  const handleReset = () => {
    setImageBase64(null);
    setSelectedSampleId(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setRetryAttempt(0);
  };

  const handleRetry = () => {
    if (imageBase64) {
      analyzeImage(imageBase64, 'image/jpeg');
    }
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    setImageBase64(entry.uploadedImage);
    setResult(entry.fullResult);
    setActiveTab('identifier');
  };

  const handleDeleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    if (window.confirm('Tens a certeza de que desejas apagar todo o histórico de identificações?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f5ee] text-[#1c261e]">
      {/* Vineyard Header with Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        historyCount={history.length}
        onOpenTips={() => setIsTipsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-5 sm:py-8">
        {/* Tab 1: Photo Identifier */}
        {activeTab === 'identifier' && (
          <div className="space-y-6">
            {/* Intro banner */}
            <div className="text-center mb-5 sm:mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/10 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ampelografia Inteligente</span>
              </div>
              <h2 className="font-serif-brand text-2xl sm:text-3xl font-extrabold text-[#122c16]">
                Identificador de Castas por Fotografia
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto mt-1.5">
                Carrega ou fotografa uma folha ou cacho de videira para diagnosticar com rigor a casta mais provável.
              </p>
            </div>

            {/* Central Image Uploader & Preview */}
            <PhotoUploader
              currentImageBase64={imageBase64}
              selectedSampleId={selectedSampleId}
              isLoading={isLoading}
              retryAttempt={retryAttempt}
              onImageSelected={handleImageSelected}
              onReset={handleReset}
            />

            {/* Error message card */}
            {error && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 flex items-start gap-3.5 shadow-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-amber-900 mb-1">
                    {error.includes('temporariamente')
                      ? 'Serviço Temporariamente Indisponível'
                      : error.includes('Não foi possível obter resposta')
                      ? 'Comunicação com o Serviço'
                      : 'Aviso ao processar a imagem'}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-xl bg-[#1b3d22] hover:bg-[#142e18] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tentar novamente</span>
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Result presented right beneath */}
            {result && (
              <AnalysisResult result={result} onReset={handleReset} />
            )}
          </div>
        )}

        {/* Tab 2: Identification History */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectEntry={handleSelectHistoryEntry}
            onDeleteEntry={handleDeleteHistoryEntry}
            onClearHistory={handleClearHistory}
            onNavigateToIdentifier={() => setActiveTab('identifier')}
          />
        )}

        {/* Tab 3: Detailed Grape Varietals Database */}
        {activeTab === 'database' && (
          <VarietalsDatabase />
        )}
      </main>

      {/* Subdued Footer */}
      <footer className="border-t border-stone-200/80 bg-[#eeebe2] py-6 px-4 text-center text-xs text-stone-500 mt-auto">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-stone-600">
            VitisID — Ampelografia e Catálogo de Castas de Videira
          </p>
          <p className="text-stone-400 text-[11px]">
            Baseado nos descritores OIV (Organização Internacional da Vinha e do Vinho)
          </p>
        </div>
      </footer>

      {/* Photo Tips Modal */}
      <TipsModal isOpen={isTipsOpen} onClose={() => setIsTipsOpen(false)} />
    </div>
  );
}
