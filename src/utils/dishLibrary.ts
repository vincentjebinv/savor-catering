
// 🖼️ Import Local Dish Assets
import idli from '../assets/dishes/idli.jpg';
import dosa from '../assets/dishes/dosa.jpg';
import parotta from '../assets/dishes/parotta.jpg';
import poori from '../assets/dishes/poori.jpg';
import curry from '../assets/dishes/curry.jpg';
import starter from '../assets/dishes/starter.jpg';
import meals from '../assets/dishes/meals.jpg';
import chutney from '../assets/dishes/chutney.jpg';
import juice from '../assets/dishes/juice.jpg';
import vada from '../assets/dishes/vada.jpg';
import biryani from '../assets/dishes/biryani_real.jpg';
import sweet from '../assets/dishes/sweet.jpg';
import tea from '../assets/dishes/tea.jpg';
import coffee from '../assets/dishes/coffee.jpg';
import halwa from '../assets/dishes/halwa.jpg';

// Fallback if some failed to download
const PLACEHOLDER = idli; 

const LIBRARY_MAP: Record<string, string> = {
  // Breakfast
  'idli': idli,
  'idly': idli,
  'இட்லி': idli,
  'dosa': dosa,
  'dosai': dosa,
  'தோசை': dosa,
  'roast': dosa,
  'uthappam': dosa,
  'parotta': parotta,
  'paratha': parotta,
  'பரோட்டா': parotta,
  'poori': poori,
  'puri': poori,
  'பூரி': poori,
  'vada': vada,
  'vadai': vada,
  'வடை': vada,
  'pongal': meals,
  'uppuma': meals,
  'appam': dosa,
  'idiyappam': parotta,

  // Lunch/Dinner
  'biryani': biryani,
  'briyani': biryani,
  'பிரியாணி': biryani,
  'rice': meals,
  'சாதம்': meals,
  'meals': meals,
  'thali': meals,
  'sambar': curry,
  'சாம்பார்': curry,
  'curry': curry,
  'kulambu': curry,
  'குழம்பு': curry,
  'gravy': curry,
  'kootu': curry,
  'kurma': curry,
  'paya': curry,
  'sukka': curry,
  'varuval': curry,
  'thokku': curry,
  'kothu': parotta,
  'podi': idli,
  'pep': curry,
  'masala': curry,

  // Proteins
  'chicken': curry,
  'mutton': curry,
  'fish': curry,
  'prawn': curry,
  'crab': curry,
  'egg': curry,
  'veg': curry,
  'paneer': curry,
  'gobi': starter,
  'mushroom': curry,

  // Sides/Starters
  'chutney': chutney,
  'சட்னி': chutney,
  'thuvaiyal': chutney,
  'starter': starter,
  '65': starter,
  'fry': starter,
  'dry': starter,
  'manchurian': starter,
  'kola': starter,
  'lollipop': starter,
  'chips': starter,
  'cutlet': starter,

  // Drinks
  'juice': juice,
  'tea': tea,
  'chai': tea,
  'coffee': coffee,
  'காபி': coffee,
  'தேநீர்': tea,
  'பால்': tea, // Milk fallback to tea

  // Sweets
  'sweet': sweet,
  'jamun': sweet,
  'halwa': halwa,
  'laddu': sweet,
  'peda': sweet,
  'pak': sweet,
  'அல்வா': halwa,
};

/**
 * Returns a local library image based on dish name keywords.
 * Returns null if no match is found.
 */
export const getLibraryImage = (nameEn?: string, nameTa?: string): string | null => {
  const searchStr = `${nameEn || ''} ${nameTa || ''}`.toLowerCase();
  
  // Find first keyword that matches
  for (const keyword in LIBRARY_MAP) {
    if (searchStr.includes(keyword)) {
      return LIBRARY_MAP[keyword];
    }
  }

  return null;
};
