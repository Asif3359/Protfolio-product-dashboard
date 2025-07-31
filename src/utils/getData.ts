export async function getData(dataType: string) {
  try {
    const baseUrl = 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/${dataType}`, { 
      cache: "force-cache",
      next: { revalidate: 60 } // Revalidate every minute for faster updates
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${dataType} data`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${dataType} data:`, error);
    return null;
  }
}

export async function getDataById(dataType: string, id: string) {
  try {
    const baseUrl = 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/${dataType}/${id}`, { 
      cache: "force-cache",
      next: { revalidate: 60 } // Revalidate every minute for faster updates
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${dataType} data`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${dataType} data:`, error);
    return null;
  }
}
