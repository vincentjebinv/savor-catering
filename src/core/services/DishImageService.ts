/**
 * DishImageService.ts
 * 
 * Exclusively using DuckDuckGo for the most accurate dish images.
 * Results are proxied through our own server to avoid CORS issues.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const findDishImages = async (dishName: string): Promise<string[]> => {
  if (!dishName.trim()) return [];

  console.log("Searching DuckDuckGo via Backend for:", dishName);
  try {
    const query = encodeURIComponent(`${dishName} dish food`);
    const response = await fetch(`${API_BASE_URL}/api/image-search?q=${query}`);
    const data = await response.json();

    if (data.images && Array.isArray(data.images)) {
      return data.images;
    }
  } catch (error) {
    console.error("DuckDuckGo Proxy Error:", error);
  }

  return [];
};
