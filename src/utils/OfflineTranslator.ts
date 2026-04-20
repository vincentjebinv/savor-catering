// 📖 THE OFFLINE DICTIONARY
// Add as many catering words here as you like!
const EN_TO_TA: { [key: string]: string } = {
  // Categories
  "breakfast": "காலை உணவு",
  "lunch": "மதிய உணவு",
  "dinner": "இரவு உணவு",
  "snacks": "சிற்றுண்டி",
  "drinks": "பானங்கள்",
  "sweets": "இனிப்புகள்",
  "starters": "தொடக்க உணவுகள்",
  "main course": "முக்கிய உணவு",

  // Common Items
  "idly": "இட்லி",
  "dosa": "தோசை",
  "vadai": "வடை",
  "pongal": "பொங்கல்",
  "poori": "பூரி",
  "chapatthi": "சப்பாத்தி",
  "parotta": "பரோட்டா",
  "rice": "சாதம்",
  "biryani": "பிரியாணி",
  "sambar": "சாம்பார்",
  "rasam": "ரசம்",
  "curd": "தயிர்",
  "salad": "சாலட்",
  
  // Meats & Veg
  "chicken": "சிக்கன்",
  "mutton": "மட்டன்",
  "fish": "மீன்",
  "egg": "முட்டை",
  "vegetable": "காய்கறி",
  "paneer": "பன்னீர்",
  "mushroom": "காளான்",
  "gobi": "கோபி",
  
  // Styles
  "fry": "வறுவல்",
  "gravy": "குழம்பு",
  "masala": "மசாலா",
  "soup": "சூப்",
  "65": "65",
  "roast": "ரோஸ்ட்",
  "plain": "சாதா",
  "ghee": "நெய்",
  "onion": "வெங்காயம்",
  "tomato": "தக்காளி"
};

// Create a reverse dictionary for Tamil -> English
const TA_TO_EN: { [key: string]: string } = Object.fromEntries(
  Object.entries(EN_TO_TA).map(([en, ta]) => [ta, en])
);

// 🇬🇧 English -> 🇹🇳 Tamil
export const toTamil = (text: string): string => {
  if (!text) return "";
  
  // Split sentence into words, translate each, join back
  return text.toLowerCase().split(' ').map(word => {
    // Remove punctuation for lookup (simple version)
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
    return EN_TO_TA[cleanWord] || word; // Return translated word OR original if not found
  }).join(' ');
};

// 🇹🇳 Tamil -> 🇬🇧 English
export const toEnglish = (text: string): string => {
  if (!text) return "";
  
  return text.split(' ').map(word => {
    return TA_TO_EN[word] || word;
  }).join(' ');
};