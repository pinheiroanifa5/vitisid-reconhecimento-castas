import tourigaImg from '../assets/images/touriga_nacional_1790179827503.jpg';
import alvarinhoImg from '../assets/images/alvarinho_grapes_1790179839791.jpg';
import nonVineImg from '../assets/images/non_vine_sample_1790179851625.jpg';
import { SampleImage } from '../types.ts';

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'touriga-nacional',
    title: 'Touriga Nacional',
    subtitle: 'Folha adulta (5 lóbulos)',
    description: 'A casta nobre de Portugal por excelência, conhecida pelo recorte profundo dos seios laterais.',
    imageSrc: tourigaImg,
    typeBadge: 'Tinta',
  },
  {
    id: 'alvarinho',
    title: 'Alvarinho',
    subtitle: 'Cacho e folha no Minho',
    description: 'Casta branca de excelência do noroeste peninsular, com cachos pequenos de bagos dourados.',
    imageSrc: alvarinhoImg,
    typeBadge: 'Branca',
  },
  {
    id: 'non-vine',
    title: 'Folha de Figueira',
    subtitle: 'Teste de Rejeição (Não-Videira)',
    description: 'Folha de Ficus carica para testar a rejeição precisa quando não é uma videira.',
    imageSrc: nonVineImg,
    typeBadge: 'Não-Videira',
  },
];
