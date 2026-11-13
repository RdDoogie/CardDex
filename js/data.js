/* ==================================================================
   CardDex · data.js
   DATOS DE EJEMPLO. Todo lo editable está aquí: cartas, precios,
   ventas, series del gráfico y valores del grader.
   Si añades una carpeta img/ con imágenes propias, cambia la propiedad
   "img" de cada carta por la ruta local (p. ej. "img/mcx.png").
   ================================================================== */
const DATA = {
  // Colección del usuario
  cards: [
    { id: 'mcx',       name: 'Mega Charizard X ex', set: 'Phantasmal Flames', hp: 360, type: 'fire',     price: 900,  img: 'https://images.pokemontcg.io/me2/125_hires.png' },
    { id: 'umbreon',   name: 'Umbreon VMAX',        set: 'Evolving Skies',    hp: 310, type: 'dark',     price: 1450, img: 'https://images.pokemontcg.io/swsh7/215_hires.png' },
    { id: 'mew',       name: 'Mew ex',              set: '151',               hp: 180, type: 'psychic',  price: 38,   img: 'https://images.pokemontcg.io/sv3pt5/151_hires.png' },
    { id: 'charizard', name: 'Charizard',           set: 'Base Set',          hp: 120, type: 'fire',     price: 420,  img: 'https://images.pokemontcg.io/base1/4_hires.png' },
    { id: 'blastoise', name: 'Blastoise',           set: 'Base Set',          hp: 100, type: 'water',    price: 160,  img: 'https://images.pokemontcg.io/base1/2_hires.png' },
    { id: 'venusaur',  name: 'Venusaur',            set: 'Base Set',          hp: 100, type: 'psychic',  price: 140,  img: 'https://images.pokemontcg.io/base1/15_hires.png' },
    { id: 'pikachu',   name: 'Pikachu',             set: 'Base Set',          hp: 40,  type: 'electric', price: 12,   img: 'https://images.pokemontcg.io/base1/58_hires.png' },
    { id: 'mewtwo',    name: 'Mewtwo',              set: 'Base Set',          hp: 60,  type: 'psychic',  price: 75,   img: 'https://images.pokemontcg.io/base1/10_hires.png' },
    { id: 'zapdos',    name: 'Zapdos',              set: 'Base Set',          hp: 90,  type: 'electric', price: 60,   img: 'https://images.pokemontcg.io/base1/16_hires.png' },
    { id: 'raichu',    name: 'Raichu',              set: 'Base Set',          hp: 80,  type: 'electric', price: 55,   img: 'https://images.pokemontcg.io/base1/14_hires.png' },
  ],

  // Home: resumen de la colección
  home: {
    fan: ['umbreon', 'mcx', 'mew'],          // cartas del abanico de la tarjeta resumen
    top: ['umbreon', 'mcx', 'charizard'],    // lista "Top of your collection"
  },

  // Card Details
  detail: {
    cardId: 'mcx',
    number: '125/094',
    lastSold: 900,
    price30dAgo: 864,                         // para calcular la variación (+4,2 %)
    languages:  ['English', 'Japanese', 'Spanish', 'French'],
    conditions: ['NM', 'LP', 'MP'],
    sales: [
      { date: '10 Nov 2026', platform: 'Cardmarket', cond: 'NM', price: 900 },
      { date: '07 Nov 2026', platform: 'eBay',       cond: 'NM', price: 885 },
      { date: '02 Nov 2026', platform: 'TCGplayer',  cond: 'LP', price: 812 },
    ],
  },

  // Series del gráfico (mismo nº de puntos en cada rango para poder animar)
  chart: {
    '1M': { labels: ['13/10', '18/10', '23/10', '28/10', '2/11', '7/11', '12/11'],
            raw: [842, 860, 851, 878, 869, 884, 900], psa: [1980, 2010, 1995, 2060, 2090, 2075, 2140] },
    '3M': { labels: ['Aug', '', 'Sep', '', 'Oct', '', 'Nov'],
            raw: [760, 790, 775, 820, 845, 872, 900], psa: [1750, 1820, 1800, 1900, 1960, 2050, 2140] },
    '1Y': { labels: ['Nov', 'Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
            raw: [520, 580, 640, 610, 700, 810, 900], psa: [1250, 1400, 1520, 1480, 1700, 1950, 2140] },
  },

  // Binder Builder: cartas ya colocadas en la hoja de 9 al empezar (índice → id)
  binder: {
    preset9: { 0: 'mcx', 4: 'umbreon' },
  },

  // AI Card Grader: valores para la carta de ejemplo
  grader: {
    sampleCardId: 'mcx',
    sample: { Centering: 92, Corners: 88, Edges: 95, Surface: 90 },
    criteria: ['Centering', 'Corners', 'Edges', 'Surface'],
    labels: { 10: 'GEM MINT', 9: 'MINT', 8: 'NM-MT', 7: 'NM' },
  },
};
