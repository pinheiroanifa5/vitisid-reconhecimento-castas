export interface KeyMorphologicalFeatures {
  leafLimboAndLobes?: string;
  petiolarSinus?: string;
  leafTeeth?: string;
  clusterAndBerry?: string;
}

export interface SimilarVariety {
  name: string;
  distinction: string;
}

export interface GrapeAnalysisResult {
  isVine: boolean;
  notVineReason?: string;
  varietyName?: string;
  scientificClassification?: string;
  grapeType?: 'Tinta' | 'Branca' | 'Rosada' | string;
  confidencePercentage?: number;
  confidenceLevel?: 'Alta' | 'Média' | 'Baixa' | string;
  justification?: string;
  keyFeatures?: KeyMorphologicalFeatures;
  typicalRegions?: string[];
  synonyms?: string[];
  wineProfile?: string;
  similarVarieties?: SimilarVariety[];
}

export interface SampleImage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  typeBadge: 'Tinta' | 'Branca' | 'Não-Videira';
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  formattedDate: string;
  uploadedImage: string;
  identifiedGrape: string;
  scientificName?: string;
  grapeType: string;
  confidencePercentage: number;
  confidenceLevel: string;
  justification: string;
  fullResult: GrapeAnalysisResult;
}

export interface GrapeVarietal {
  id: string;
  name: string;
  scientificName: string;
  type: 'Tinta' | 'Branca' | 'Rosada';
  originRegion: string;
  cultivationRegions: string[];
  synonyms: string[];
  flavorProfile: {
    aromas: string[];
    acidity: 'Baixa' | 'Média' | 'Alta' | 'Muito Alta' | string;
    body: 'Leve' | 'Médio' | 'Encorpado' | 'Muito Encorpado' | string;
    tannins?: 'Baixos / Sedosos' | 'Médios' | 'Altos / Estruturados' | 'Potentes' | string;
    tastingNotes: string;
  };
  foodPairing: {
    summary: string;
    dishes: string[];
    cheeses: string[];
  };
  ampelography: {
    leaf: string;
    lobes: string;
    petiolarSinus: string;
    bunch: string;
    berry: string;
  };
  enologicalPotential: string;
  imageAccentColor?: string;
}

export type ActiveTab = 'identifier' | 'history' | 'database';
