import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'lebron-21',
    name: 'Nike LeBron 21 "Aura"',
    athlete: 'LeBron James',
    price: 1499.90,
    originalPrice: 1699.90,
    imageUrl: '/src/assets/images/nike_lebron_21_1781112553741.png',
    description: 'Amortecimento de última geração e suporte inabalável para jogadores explosivos.',
    longDescription: 'O LeBron 21 apresenta um sistema de cabamento inovador que trabalha em sintonia com o amortecimento Zoom Air. Projetado para suportar as forças geradas pelo King James na quadra, ele combina uma entressola Cushlon 2.0 premium com uma unidade Zoom Air de grande volume no calcanhar e no antepé. O resultado é proteção máxima contra impactos e uma transição suave do calcanhar à ponta do pé.',
    category: 'Power',
    tag: 'Máximo Impacto e Estabilidade',
    colors: [
      { name: 'Apolo Roxo', hex: '#6366f1' },
      { name: 'Ouro Nobre', hex: '#eab308' },
      { name: 'Obsidiana Escura', hex: '#1e293b' }
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    techSpecs: {
      cushioningType: 'Manga Zoom Air de 13mm + Espuma Cushlon 2.0 integral',
      tractionPattern: 'Padrão multidirecional ondulado de borracha aderente',
      weightGrams: 425,
      materials: 'Cabedal de mesh ventilado com cabos tensores Flywire internos'
    },
    metrics: {
      traction: 95,
      cushioning: 98,
      responsiveness: 90,
      support: 96,
      durability: 92
    },
    reviews: [
      {
        id: 'rev-l1',
        author: 'Carlos Eduardo "Cadu"',
        rating: 5,
        date: '28/05/2026',
        comment: 'Absolutamente incrível para quem joga de pivô ou ala-pivô. O amortecimento de impacto protege muito os joelhos em aterrissagens duras. Vale cada centavo.',
        recommend: true
      },
      {
        id: 'rev-l2',
        author: 'Felipe S.',
        rating: 4,
        date: '02/06/2026',
        comment: 'Muito estável e o grip é surreal. Só achei um pouco pesado nas primeiras partidas, mas depois que amacia fica excelente.',
        recommend: true
      }
    ]
  },
  {
    id: 'kd-17',
    name: 'Nike KD17 "Sunrise"',
    athlete: 'Kevin Durant',
    price: 1299.90,
    imageUrl: '/src/assets/images/nike_kd17_sunrise_1781112566970.png',
    description: 'Fluidez milimétrica e energia infinita sob medida para os arremessadores de elite.',
    longDescription: 'Com um design inspirado no nascer do sol e na precisão cirúrgica de Kevin Durant, o KD17 oferece a combinação ideal de amortecimento macio sob o pé e capacidade de impulso imediata. Ele traz uma unidade Zoom Air no antepé integrada a um chassi termoplástico de suporte, permitindo cortes rápidos, paradas bruscas ("pull-up jumpers") e conforto inigualável durante partidas inteiras.',
    category: 'Control',
    tag: 'Fluidez e Controle de Arremesso',
    colors: [
      { name: 'Nascer do Sol Orange', hex: '#f97316' },
      { name: 'Céu Azul Esportivo', hex: '#0ea5e9' },
      { name: 'Branco Minimalista', hex: '#f8fafc' }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    techSpecs: {
      cushioningType: 'Célula Air Zoom Strobel no antepé com espuma Phylon premium',
      tractionPattern: 'Padrão de mapa de calor topográfico otimizado de alta aderência',
      weightGrams: 395,
      materials: 'Cabedal híbrido de jacquard têxtil resistente com asas flexíveis em TPU'
    },
    metrics: {
      traction: 94,
      cushioning: 92,
      responsiveness: 94,
      support: 91,
      durability: 89
    },
    reviews: [
      {
        id: 'rev-k1',
        author: 'Matheus "The Reaper"',
        rating: 5,
        date: '15/05/2026',
        comment: 'A transição desse tênis é perfeita. Você sente a quadra mas sem perder a maciez do amortecimento. O design de cores do pôr-do-sol é ainda mais bonito pessoalmente.',
        recommend: true
      },
      {
        id: 'rev-k2',
        author: 'Gustavo Barbosa',
        rating: 5,
        date: '05/06/2026',
        comment: 'Extremamente confortável. Eu tenho o pé largo e ele se adaptou perfeitamente sem apertar a lateral. Nota 10.',
        recommend: true
      }
    ]
  },
  {
    id: 'ja-1',
    name: 'Nike Ja 1 "Hunger"',
    athlete: 'Ja Morant',
    price: 999.90,
    originalPrice: 1099.90,
    imageUrl: '/src/assets/images/nike_ja1_hunger_1781112579214.png',
    description: 'Decolagem instantânea e máxima tração lateral para os armadores mais velozes.',
    longDescription: 'Inspirado na mentalidade voraz e decola rápida de Ja Morant. O Ja 1 é projetado para minimizar o peso e maximizar o tempo de suspensão no ar. A unidade Zoom Air concentrada no antepé age como um trampolim que lança o atleta para frente, enquanto o contraforte moldado confere segurança máxima nas mudanças abruptas de direção e crossovers demolidores de tornozelo.',
    category: 'Speed',
    tag: 'Propulsão Vertical e Rapidez',
    colors: [
      { name: 'Hunger Rubro-Azul', hex: '#dc2626' },
      { name: 'Meia Noite Púrpura', hex: '#7c3aed' },
      { name: 'Cinza Concreto', hex: '#64748b' }
    ],
    sizes: [37, 38, 39, 40, 41, 42, 43, 44],
    techSpecs: {
      cushioningType: 'Painel Zoom Air retangular focado no antepé + espuma elástica',
      tractionPattern: 'Padrão em formato de espinha de peixe agressivo para quadras internas',
      weightGrams: 355,
      materials: 'Cabedal de mesh leve de monocamada com gaiola em couro sintético'
    },
    metrics: {
      traction: 98,
      cushioning: 85,
      responsiveness: 97,
      support: 88,
      durability: 86
    },
    reviews: [
      {
        id: 'rev-j1',
        author: 'Lucas Pinheiro',
        rating: 5,
        date: '10/05/2026',
        comment: 'O melhor tênis para armadores rápidos que já usei! A tração morde a quadra de uma forma absurda. Paradas súbitas são garantidas, sem nenhum deslizamento.',
        recommend: true
      },
      {
        id: 'rev-j2',
        author: 'Julio Cesar',
        rating: 4,
        date: '20/05/2026',
        comment: 'Leve demais e a resposta no pulo é maravilhosa. O amortecimento traseiro é mais firme, ideal para quem prioriza velocidade no primeiro passo.',
        recommend: true
      }
    ]
  },
  {
    id: 'sabrina-2',
    name: 'Nike Sabrina 2 "Conductor"',
    athlete: 'Sabrina Ionescu',
    price: 1199.90,
    imageUrl: '/src/assets/images/nike_sabrina_2_1781112590816.png',
    description: 'Leveza revolucionária e cortes cirúrgicos desenhados para comandar o ritmo do jogo.',
    longDescription: 'Criado sob as especificidades de Sabrina Ionescu para armadores habilidosos que gerenciam a quadra inteira. O Sabrina 2 é um dos tênis de cano baixo mais leves do portfólio da Nike Basketball, integrando a espuma responsiva React com uma unidade Zoom Air encapsulada no antepé. A aderência excepcional em 360 graus permite cortes laterais sem perda de milissegundos.',
    category: 'Agility',
    tag: 'Controle 360 e Agilidade Extrema',
    colors: [
      { name: 'Branco Condutor', hex: '#f1f5f9' },
      { name: 'Metais de Ouro', hex: '#ca8a04' },
      { name: 'Rosa Elétrico', hex: '#db2777' }
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    techSpecs: {
      cushioningType: 'Entressola completa de React Foam de densidade dupla + Zoom Air frontal',
      tractionPattern: 'Padrão com ranhuras em S-curvado multidirecional de alto grip',
      weightGrams: 330,
      materials: 'Mesh balístico translúcido fundido com fitas de reforço ultra-leves'
    },
    metrics: {
      traction: 97,
      cushioning: 89,
      responsiveness: 98,
      support: 93,
      durability: 88
    },
    reviews: [
      {
        id: 'rev-s1',
        author: 'Mariana Duarte',
        rating: 5,
        date: '12/05/2026',
        comment: 'Perfeito! É levíssimo, parece que você está descalço mas com um grip formidável e muita segurança no tornozelo mesmo sendo de cano baixo.',
        recommend: true
      },
      {
        id: 'rev-s2',
        author: 'Andre G.',
        rating: 5,
        date: '04/06/2026',
        comment: 'Comprei para jogar basquete 3x3 e me surpreendeu. O amortecimento React é muito confortável e não cansa os pés. Recomendo demais.',
        recommend: true
      }
    ]
  }
];
