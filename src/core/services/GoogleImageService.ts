/**
 * GoogleImageService.ts
 * 
 * Searches Google Images for high-quality food photos.
 * Free tier: 100 queries / day.
 */

// 🔑 Google API Key and Search Engine ID (CX) from environment variables
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_SEARCH_CX = import.meta.env.VITE_GOOGLE_SEARCH_CX;

export const findGoogleImages = async (dishName: string): Promise<string[]> => {
  if (!dishName.trim() || !GOOGLE_API_KEY || !GOOGLE_SEARCH_CX) return [];

  console.log("Searching Google for:", dishName);
  try {
    // 🔍 Simplified query for better reliability
    const query = encodeURIComponent(`${dishName} dish food`);
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${query}&searchType=image&num=5`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("Google Image Response:", data);

    if (data.items && data.items.length > 0) {
      return data.items.map((item: any) => item.link);
    } else if (data.error) {
      console.error("Google API Error:", data.error.message);
      // alert("Google Search Error: " + data.error.message); // Temporarily enable for user to see
    }
  } catch (error) {
    console.error("Google Image Search Network Error:", error);
  }

  return [];
};
