// Word-by-word Offline Translator for Dish Names
const ENGLISH_TAMIL: Record<string, string> = {
  'breakfast': 'காலை உணவு',
  'lunch': 'மதிய உணவு',
  'dinner': 'இரவு உணவு',
  'idli': 'இட்லி',
  'idly': 'இட்லி',
  'dosa': 'தோசை',
  'dosai': 'தோசை',
  'roast': 'தோசை',
  'poori': 'பூரி',
  'puri': 'பூரி',
  'vada': 'வடை',
  'vadai': 'வடை',
  'pongal': 'பொங்கல்',
  'parotta': 'பரோட்டா',
  'biryani': 'பிரியாணி',
  'rice': 'சாதம்',
  'sambar': 'சாம்பார்',
  'curry': 'குழம்பு',
  'chicken': 'கோழி',
  'mutton': 'ஆடு',
  'fish': 'மீன்',
  'egg': 'முட்டை',
  'veg': 'சைவம்',
  'chutney': 'சட்னி',
  'juice': 'ஜூஸ்',
  'coffee': 'காபி',
  'tea': 'தேநீர்',
  'milk': 'பால்',
  'sweet': 'இனிப்பு',
  'halwa': 'அல்வா',
  'laddu': 'லாடு',
  'payasam': 'பாயசம்',
  'soup': 'சூப்',
  'fry': 'வறுவல்',
  'masala': 'மசாலா',
  'gravy': 'கிரேவி',
  'sesame': 'எள்ளு',
  'onion': 'வெங்காயம்',
  'tomato': 'தக்காளி',
  'garlic': 'பூண்டு',
  'ginger': 'இஞ்சி',
  'chilly': 'மிளகாய்',
  'pepper': 'மிளகு',
  'lemon': 'எலுமிச்சை',
  'coconut': 'தேங்காய்',
  'curd': 'தயிர்',
  'ghee': 'நெய்',
  'butter': 'வெண்ணெய்',
  'paneer': 'பன்னீர்',
  'mushroom': 'காளான்',
  'gobi': 'கோபி',
  'panner': 'பன்னீர்',
  'rasam': 'ரசம்',
  'appalam': 'அப்பளம்',
  'vadagam': 'வடகம்',
  'pickle': 'ஊறுகாய்',
};

const TAMIL_ENGLISH: Record<string, string> = Object.fromEntries(
  Object.entries(ENGLISH_TAMIL).map(([en, ta]) => [ta, en.charAt(0).toUpperCase() + en.slice(1)])
);

export const toTamil = (text: string): string => {
  if (!text) return '';
  const words = text.toLowerCase().split(' ');
  const translated = words.map(word => ENGLISH_TAMIL[word] || word);
  return translated.join(' ');
};

export const toEnglish = (tamilText: string): string => {
  if (!tamilText) return '';
  const words = tamilText.split(' ');
  const translated = words.map(word => TAMIL_ENGLISH[word] || word);
  return translated.join(' ');
};
