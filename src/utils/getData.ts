export async function getData(dataType: string) {
  try {
    const baseUrl = 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/${dataType}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${dataType} data`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${dataType} data:`, error);
    return null;
  }
} 

// http://localhost:3000/api/profile
// http://localhost:3000/api/academic
// http://localhost:3000/api/experience
// http://localhost:3000/api/project
// http://localhost:3000/api/skill
// http://localhost:3000/api/award
// http://localhost:3000/api/certification
// http://localhost:3000/api/research