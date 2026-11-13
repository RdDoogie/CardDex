/* ==================================================================
   CardDex · tailwind.config.js
   Configuración de Tailwind (CDN): paleta y fuentes de la guía de estilo.
   Se carga en el <head> de cada página, justo después del CDN.
   ================================================================== */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        dark:   '#191D32', // textos principales, header, fondos oscuros
        bg:     '#FEFEFF', // fondo general
        red1:   '#E70E02', // acción principal (CTA, estado activo)
        red2:   '#B3001B', // hover/pressed de botones rojos, degradados
        yellow: '#FAA916', // precios, destacados, valores importantes
      },
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'], // títulos y logo
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],   // texto
      },
      boxShadow: {
        soft:  '0 6px 24px -8px rgba(25,29,50,.18)',
        card:  '0 18px 40px -14px rgba(25,29,50,.45)',
        phone: '0 50px 120px -20px rgba(0,0,0,.75)',
      },
    },
  },
};
