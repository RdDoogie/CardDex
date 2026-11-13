/* ==================================================================
   CardDex · data.js
   DATOS DE EJEMPLO. Todo lo editable está aquí: cartas, precios
   y valores del grader.
   Si añades una carpeta img/ con imágenes propias, cambia la propiedad
   "img" de cada carta por la ruta local (p. ej. "img/mcx.png").
   ================================================================== */
const DATA = {
  // Colección del usuario. price = último precio Raw (NM); psa10 = precio graduado PSA 10
  cards: [
    { id: 'mcx',       name: 'Mega Charizard X ex', set: 'Phantasmal Flames', number: '125/094', hp: 360, type: 'fire',     price: 900,  psa10: 2140, img: 'https://images.pokemontcg.io/me2/125_hires.png' },
    { id: 'umbreon',   name: 'Umbreon VMAX',        set: 'Evolving Skies',    number: '215/203', hp: 310, type: 'dark',     price: 1450, psa10: 3200, img: 'https://images.pokemontcg.io/swsh7/215_hires.png' },
    { id: 'mew',       name: 'Mew ex',              set: '151',               number: '151/165', hp: 180, type: 'psychic',  price: 38,   psa10: 140,  img: 'https://images.pokemontcg.io/sv3pt5/151_hires.png' },
    { id: 'charizard', name: 'Charizard',           set: 'Base Set',          number: '4/102',   hp: 120, type: 'fire',     price: 420,  psa10: 4800, img: 'https://images.pokemontcg.io/base1/4_hires.png' },
    { id: 'blastoise', name: 'Blastoise',           set: 'Base Set',          number: '2/102',   hp: 100, type: 'water',    price: 160,  psa10: 1100, img: 'https://images.pokemontcg.io/base1/2_hires.png' },
    { id: 'venusaur',  name: 'Venusaur',            set: 'Base Set',          number: '15/102',  hp: 100, type: 'psychic',  price: 140,  psa10: 950,  img: 'https://images.pokemontcg.io/base1/15_hires.png' },
    { id: 'pikachu',   name: 'Pikachu',             set: 'Base Set',          number: '58/102',  hp: 40,  type: 'electric', price: 12,   psa10: 180,  img: 'https://images.pokemontcg.io/base1/58_hires.png' },
    { id: 'mewtwo',    name: 'Mewtwo',              set: 'Base Set',          number: '10/102',  hp: 60,  type: 'psychic',  price: 75,   psa10: 600,  img: 'https://images.pokemontcg.io/base1/10_hires.png' },
    { id: 'zapdos',    name: 'Zapdos',              set: 'Base Set',          number: '16/102',  hp: 90,  type: 'electric', price: 60,   psa10: 520,  img: 'https://images.pokemontcg.io/base1/16_hires.png' },
    { id: 'raichu',    name: 'Raichu',              set: 'Base Set',          number: '14/102',  hp: 80,  type: 'electric', price: 55,   psa10: 480,  img: 'https://images.pokemontcg.io/base1/14_hires.png' },
  ],

  // Home: resumen de la colección
  home: {
    fan: ['umbreon', 'mcx', 'mew'],          // cartas del abanico de la tarjeta resumen
    top: ['umbreon', 'mcx', 'charizard'],    // lista "Top of your collection"
  },

  // Card Details: la carta se elige con ?id= en la URL (card.html?id=umbreon).
  // El historial de precios y las ventas se generan a partir de price/psa10
  // de cada carta (ver pages/card.js).
  detail: {
    defaultId:  'mcx',
    languages:  ['English', 'Japanese', 'Spanish', 'French'],
    conditions: ['NM', 'LP', 'MP'],
    platforms:  ['Cardmarket', 'eBay', 'TCGplayer'],
    saleDates:  ['10 Nov 2026', '07 Nov 2026', '02 Nov 2026'],
  },

  // Etiquetas del eje X del gráfico (7 puntos por rango, para poder animar)
  chartLabels: {
    '1M': ['13/10', '18/10', '23/10', '28/10', '2/11', '7/11', '12/11'],
    '3M': ['Aug', '', 'Sep', '', 'Oct', '', 'Nov'],
    '1Y': ['Nov', 'Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
  },

  // Binder Builder: cartas ya colocadas en la hoja de 9 al empezar (índice → id)
  binder: {
    preset9: { 0: 'mcx', 4: 'umbreon' },
  },

  // AI Card Grader (simulado)
  grader: {
    cardBack: 'img/card-back.png',            // reverso usado con "Use sample card"
    criteria: ['Centering', 'Corners', 'Edges', 'Surface'],
    // Cuánto puede variar cada criterio respecto al estado general de la carta
    spread: { Centering: 7, Corners: 5, Edges: 4, Surface: 5 },
    labels: { 10: 'GEM MINT', 9: 'MINT', 8: 'NM-MT', 7: 'NM', 6: 'EX-MT', 5: 'EX', 4: 'VG-EX', 3: 'VG' },
  },
};
