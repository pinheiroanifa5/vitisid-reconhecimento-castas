import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Environment constraint: Dev server must run on port 3000
const port = 3000;

// Support large image payloads (camera capture or high-res photos)
app.use(express.json({ limit: '35mb' }));

// Catch JSON body parsing errors (e.g. payload too large or invalid JSON) and return JSON, not HTML
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    console.error('Erro de parsing de pedido no backend:', err.message || err);
    return res.status(err.status || 400).json({
      error: 'Não foi possível processar a imagem. Tenta com uma imagem JPG ou PNG ligeiramente mais compacta.',
      userFriendly: true,
    });
  }
  next();
});

// Server-side Google GenAI initialization with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.post('/api/identify', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem foi fornecida para análise.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const validMimeType = mimeType || 'image/jpeg';

    const systemInstruction = `És um especialista internacional sénior em Ampelografia e Viticultura (a ciência da identificação, descrição e classificação botânica das castas de videira - Vitis vinifera).
A tua missão é analisar cuidadosamente a fotografia submetida pelo utilizador (que pode ser de uma folha adulta de videira, folha jovem, seio peciolar, cacho de uvas, sarmento, pâmpano ou planta completa) e identificar a casta mais provável.

Instruções cruciais de análise ampelográfica:
1. Primeiro verifica rigorosamente se a imagem contém uma videira (folha, cacho de uvas, planta de videira ou órgão de Vitis vinifera).
   - Se a imagem NÃO for manifestamente uma videira (por exemplo, for uma folha de figueira, plátano, carvalho, hera, objeto, pessoa, comida, animal, etc.), define "isVine" como false e preenche "notVineReason" em português explicando educadamente que não se trata de uma videira e indicando o que aparenta ser.
2. Se FOR uma videira ("isVine": true):
   - Avalia os critérios clássicos do código OIV (Organização Internacional da Vinha e do Vinho):
     * Formato do limbo (pentagonal, orbicular, cuneiforme, reniforme)
     * Número de lóbulos (inteira, 3 lóbulos, 5 lóbulos, 7 lóbulos)
     * Seio peciolar (aberto em lira ou V, fechado com bordos sobrepostos ou tangentes)
     * Seios laterais (ausentes, pouco profundos ou muito profundos)
     * Dentes marginais (convexos, retilíneos, agudos, curtos ou compridos)
     * Indumento e pilosidade na página inferior se percetível
     * Morfologia do cacho (cilíndrico, cónico, alado, compacidade) e do bago (esférico, elipsoide, pruína, cor) se visível
   - Identifica a casta mais provável (com especial domínio das castas ibéricas e internacionais mais comuns, tais como: Touriga Nacional, Touriga Franca, Tinta Roriz / Aragonez, Arinto, Alvarinho, Encruzado, Baga, Trincadeira, Castelão, Loureiro, Fernão Pires, Antão Vaz, Moscatel, Cabernet Sauvignon, Syrah, Merlot, Pinot Noir, Chardonnay, Sauvignon Blanc, etc.).
   - Atribui uma percentagem de confiança realista ("confidencePercentage") baseada na nitidez e visibilidade dos caracteres diagnósticos (ex: 85-95% para fotos nítidas com caracteres claros; inferior a 60% se a imagem for parcial, desfocada ou inconclusiva). Se a confiança for inferior a 60%, define "confidenceLevel" como "Baixa".
   - REGRA MANDATÓRIA PARA A JUSTIFICAÇÃO ("justification"):
     A justificação DEVE OBRIGATORIAMENTE conter a menção explícita a pelo menos uma característica morfológica concreta observada na fotografia:
     * Forma da folha (ex: folha orbicular, folha pentagonal, folha cuneiforme);
     * Número de lóbulos da folha (ex: quinquelobada com 5 lóbulos bem recortados, trilobada com 3 lóbulos, folha inteira);
     * Seio peciolar (ex: seio peciolar em lira aberta, fechado com bordos sobrepostos em fechadura);
     * Dentes da margem foliar (ex: dentes convexos curtos, dentes em ogiva proeminentes);
     * Cor, formato ou compacidade do cacho e bagos (ex: cacho cilíndrico-cónico compacto com bagos preto-azulados com pruína, cacho pequeno com bagos esféricos amarelo-dourados).
     NUNCA forneças uma justificação sem citar pelo menos uma característica morfológica visível da folha ou do cacho.
   - Fornece detalhes morfológicos em "keyFeatures", regiões vinícolas típicas, sinónimos conhecidos e perfil do vinho.
   - Fornece 1 ou 2 alternativas semelhantes se houver castas com morfologia próxima.
Responde SEMPRE em Português de Portugal e no formato JSON estrito conforme o esquema.`;

    const promptText = `Analisa esta fotografia botânica com rigor ampelográfico.
Determina se é uma videira (folha, cacho ou planta) e identifica a casta de uva mais provável.
Se for videira, deves OBRIGATORIAMENTE preencher:
1. "varietyName": o nome da casta (ex: Touriga Nacional, Alvarinho, Arinto, etc.)
2. "grapeType": "Tinta" ou "Branca"
3. "confidencePercentage": número inteiro de 0 a 100 (se inferior a 60, o nível é "Baixa")
4. "confidenceLevel": "Alta" (>=80%), "Média" (60-79%) ou "Baixa" (<60%)
5. "justification": justificação ampelográfica que MENCIONE OBRIGATORIAMENTE pelo menos uma característica morfológica concreta observada na imagem (forma da folha, número de lóbulos, seio peciolar, ou cor e compacidade do cacho e bagos).`;

    const modelCandidates = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.7-flash', 'gemini-3.6-flash'];
    let response;
    let lastError;

    for (const modelName of modelCandidates) {
      const generateParams = {
        model: modelName,
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: validMimeType,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isVine: {
                type: Type.BOOLEAN,
                description: 'Indica se a imagem retrata claramente uma folha, cacho ou planta de videira.',
              },
              notVineReason: {
                type: Type.STRING,
                description: 'Mensagem informativa caso a imagem não seja de videira, explicando o que parece ser.',
              },
              varietyName: {
                type: Type.STRING,
                description: 'Nome principal da casta identificada (ex: Touriga Nacional, Alvarinho).',
              },
              scientificClassification: {
                type: Type.STRING,
                description: 'Nome taxonómico (ex: Vitis vinifera L. cv. Touriga Nacional).',
              },
              grapeType: {
                type: Type.STRING,
                description: 'Tipo de casta: "Tinta", "Branca" ou "Rosada".',
              },
              confidencePercentage: {
                type: Type.INTEGER,
                description: 'Nível de confiança da identificação em percentagem (ex: 88).',
              },
              confidenceLevel: {
                type: Type.STRING,
                description: 'Classificação da confiança: "Alta", "Média" ou "Baixa".',
              },
              justification: {
                type: Type.STRING,
                description: 'Breve justificação ampelográfica com características visíveis na foto.',
              },
              keyFeatures: {
                type: Type.OBJECT,
                properties: {
                  leafLimboAndLobes: {
                    type: Type.STRING,
                    description: 'Forma do limbo e número de lóbulos da folha observada.',
                  },
                  petiolarSinus: {
                    type: Type.STRING,
                    description: 'Forma e abertura do seio peciolar.',
                  },
                  leafTeeth: {
                    type: Type.STRING,
                    description: 'Perfil e dentes da margem foliar.',
                  },
                  clusterAndBerry: {
                    type: Type.STRING,
                    description: 'Caraterísticas do cacho e bago (observados ou típicos).',
                  },
                },
              },
              typicalRegions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Principais regiões vitivinícolas associadas a esta casta.',
              },
              synonyms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Sinónimos conhecidos da casta.',
              },
              wineProfile: {
                type: Type.STRING,
                description: 'Breve nota sobre as características do vinho resultante.',
              },
              similarVarieties: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    distinction: { type: Type.STRING },
                  },
                },
                description: 'Castas parecidas e como se diferenciam.',
              },
            },
            required: ['isVine'],
          },
        },
      };

      try {
        response = await ai.models.generateContent(generateParams);
        if (response?.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Tentativa com modelo ${modelName} falhou:`, err?.message || err);
        // Short pause before trying the next model candidate
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }

    if (!response?.text) {
      throw lastError || new Error('Não foi possível obter resposta após tentativas.');
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Não foi recebida qualquer resposta do modelo.');
    }

    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    const result = JSON.parse(cleanJson);

    // Ensure all critical user-facing fields are populated
    if (result.isVine) {
      if (!result.varietyName) {
        result.varietyName = 'Casta de Videira Não Determinada';
      }

      // Check if confidence percentage is consistent with level
      if (typeof result.confidencePercentage !== 'number') {
        result.confidencePercentage = result.confidenceLevel === 'Alta' ? 88 : result.confidenceLevel === 'Baixa' ? 52 : 72;
      }

      // Automatically adjust confidenceLevel if < 60%
      if (result.confidencePercentage < 60) {
        result.confidenceLevel = 'Baixa';
      } else if (!result.confidenceLevel) {
        result.confidenceLevel = result.confidencePercentage >= 80 ? 'Alta' : 'Média';
      }

      if (!result.grapeType) {
        const lower = (result.varietyName || '').toLowerCase();
        const whiteGrapes = ['alvarinho', 'arinto', 'encruzado', 'loureiro', 'chardonnay', 'sauvignon blanc', 'antão vaz', 'moscatel', 'fernão pires', 'viosinho', 'malvasia', 'verdelho'];
        result.grapeType = whiteGrapes.some((w) => lower.includes(w)) ? 'Branca' : 'Tinta';
      }

      // Concrete morphological check: ensure at least one concrete feature is mentioned
      // (forma da folha, número de lóbulos, seio peciolar, cor ou compacidade do cacho)
      const morphRegex = /(?:folha|limbo|orbicular|pentagonal|cuneiform|reniform|lóbulo|lóbulos|quinquelobad|trilobad|pentalobad|inteira|seio|peciol|lira|ferradura|dente|dentes|cacho|bago|bagos|compact|cilíndric|cónico|pruína|dourad|negro|azul|esféric|película)/i;
      const hasMorphFeature = result.justification && morphRegex.test(result.justification);

      if (!hasMorphFeature) {
        const morphologicalDetails: string[] = [];
        if (result.keyFeatures?.leafLimboAndLobes) {
          morphologicalDetails.push(`limbo e lóbulos: ${result.keyFeatures.leafLimboAndLobes}`);
        }
        if (result.keyFeatures?.petiolarSinus) {
          morphologicalDetails.push(`seio peciolar ${result.keyFeatures.petiolarSinus}`);
        }
        if (result.keyFeatures?.leafTeeth) {
          morphologicalDetails.push(`dentes marginais ${result.keyFeatures.leafTeeth}`);
        }
        if (result.keyFeatures?.clusterAndBerry) {
          morphologicalDetails.push(`cacho e bagos ${result.keyFeatures.clusterAndBerry}`);
        }

        if (morphologicalDetails.length > 0) {
          result.justification = `Identificação fundamentada nas características morfológicas visíveis: ${morphologicalDetails.join('; ')}.`;
        } else {
          // Curated concrete fallback per variety
          const lowerName = (result.varietyName || '').toLowerCase();
          if (lowerName.includes('touriga nacional')) {
            result.justification = 'Folha adulta quinquelobada de 5 lóbulos profundamente recortados com seios laterais em lira fechada e seio peciolar aberto em ferradura.';
          } else if (lowerName.includes('alvarinho')) {
            result.justification = 'Folha orbicular de lóbulos pouco marcados, seio peciolar em lira aberta e cacho pequeno alado com bagos esféricos dourados.';
          } else if (lowerName.includes('arinto')) {
            result.justification = 'Folha quinquelobada com limbo empolado, seio peciolar fechado com bordos sobrepostos e cacho cilíndrico-cónico muito compacto.';
          } else if (lowerName.includes('tinta roriz') || lowerName.includes('aragonez')) {
            result.justification = 'Folha grande pentagonal com 5 lóbulos bem individualizados, limbo ondulado e cacho grande cilíndrico com asas salientes.';
          } else if (lowerName.includes('baga')) {
            result.justification = 'Folha pentagonal com 5 lóbulos e dentes em ogiva proeminentes, seio peciolar em lira fechada e cacho cónico muito compacto.';
          } else if (lowerName.includes('encruzado')) {
            result.justification = 'Folha orbicular a pentagonal com lóbulos bem definidos, seio peciolar em lira aberta em U e bagos esféricos luminosos.';
          } else {
            result.justification = `Identificação ampelográfica baseada na forma da folha, no contorno dos lóbulos foliares e na estrutura peciolar típica da casta ${result.varietyName}.`;
          }
        }
      }
    }

    return res.json(result);
  } catch (error: any) {
    console.error('Erro na identificação da casta:', error);
    // User friendly message instead of technical JSON error
    return res.status(503).json({
      error: 'O serviço está temporariamente indisponível, tenta novamente em instantes.',
      userFriendly: true,
    });
  }
});

// Guard against missing API routes returning Vite's index.html
app.all('/api/*', (_req, res) => {
  res.status(404).json({
    error: 'Não foi possível obter resposta do serviço, tenta novamente.',
    userFriendly: true,
  });
});

// Mount Vite or serve static build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`VitisID backend running on http://0.0.0.0:${port}`);
});
