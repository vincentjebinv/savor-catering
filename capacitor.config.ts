import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.solaicatering.app',
  appName: 'Solai Catering',
  webDir: 'dist',
  server: {
    androidScheme: 'https', // 🟢 THIS FIXES THE BROKEN IMAGE
    cleartext: true
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
  },
};

export default config;