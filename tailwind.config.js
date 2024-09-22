module.exports = {
  darkMode: 'class', // Ensure dark mode is enabled
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Ensure all relevant paths are included
  ],
  theme: {
    extend: {
      colors: {
        light: '#f1f1f1', 
        dark: '#111111',
        laccent: '#EAE7E4',
        daccent: '#413B3B',  
        primary: '#191970',
        primarylight: '#7373C8',
        lightshadow: 'rgba(0, 0, 0, 0.1)',
        darkshadow: 'rgba(255, 255, 255, 0.1)',
        successcolor: '#28a745',
        warningcolor: '##ffc107',
        errorcolor: '#dc2626',
        infocolor: '#17a2b8',
      },
      backgroundImage: {
        'waves': "url('src\components\wave.svg')"
      }
    },
  },
  plugins: [],
}