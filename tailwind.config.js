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

        /*light: '#D0E8F2',
        dark: '#0B3D6A',
        laccent: '#A7D3E0',
        daccent: '#004B87',
        primary: '#007BFF',
        primarylight: '#6BB0F5',
        lightshadow: 'rgba(0, 0, 0, 0.1)',
        darkshadow: 'rgba(255, 255, 255, 0.1)',
        successcolor: '#28a745',
        warningcolor: '#ffc107',
        errorcolor: '#dc2626',
        infocolor: '#17a2b8',*/




        /*light: '#E9F5E5',
        dark: '#3E5B34',
        laccent: '#A3D69C',
        daccent: '#4C7A34',
        primary: '#388E3C',
        primarylight: '#A5D6A7',
        lightshadow: 'rgba(0, 0, 0, 0.1)',
        darkshadow: 'rgba(255, 255, 255, 0.1)',
        successcolor: '#28a745',
        warningcolor: '#ffc107',
        errorcolor: '#dc2626',
        infocolor: '#17a2b8',*/
        /*light: '#F8F0F0',
        dark: '#3C2A2A',
        laccent: '#E8CFCF',
        daccent: '#C1A4A4',
        primary: '#EAB8D1',
        primarylight: '#F2B2D4',
        lightshadow: 'rgba(0, 0, 0, 0.1)',
        darkshadow: 'rgba(255, 255, 255, 0.1)',
        successcolor: '#28a745',
        warningcolor: '#ffc107',
        errorcolor: '#dc2626',
        infocolor: '#17a2b8',*/
        /*light: '#F9FAFB',
        dark: '#1F2937',
        laccent: '#E5E7EB',
        daccent: '#4B5563',
        primary: '#3B82F6',
        primarylight: '#93C5FD',
        lightshadow: 'rgba(0, 0, 0, 0.1)',
        darkshadow: 'rgba(255, 255, 255, 0.1)',
        successcolor: '#28a745',
        warningcolor: '#ffc107',
        errorcolor: '#dc2626',
        infocolor: '#0EA5E9',*/
      

      },
      backgroundImage: {
        'waves': "url('src\components\wave.svg')"
      },
      screens: {
        'xxs': '540px', // min-width
      },
    },
  },
  plugins: [],
}