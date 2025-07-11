export async function getData(dataType: string) {
  try {
    const baseUrl = 'https://protfolio-product-backend.vercel.app/api';
    const response = await fetch(`${baseUrl}/${dataType}`, { cache: "no-store" });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${dataType} data`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${dataType} data:`, error);
    return null;
  }
} 

// https://protfolio-product-backend.vercel.app/api/profile
// https://protfolio-product-backend.vercel.app/api/academic
// https://protfolio-product-backend.vercel.app/api/experience
// https://protfolio-product-backend.vercel.app/api/project
// https://protfolio-product-backend.vercel.app/api/skill
// https://protfolio-product-backend.vercel.app/api/award
// https://protfolio-product-backend.vercel.app/api/certification
// https://protfolio-product-backend.vercel.app/api/research