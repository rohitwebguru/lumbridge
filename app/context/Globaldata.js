
 export const fetchScopesUsingSlug = async (slug) => {
  try {
      const response = await fetch('http://localhost:3000/api/get-link-from-scope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  slug ,
      });

      const data = await response.json();

      if (data.success && data.data.scopes) {
          return data.data.scopes; 
      } else {
          console.error('Failed to fetch scopes:', data.message);
          return [];
      }
  } catch (error) {
      console.error('Error fetching scopes:', error);
      return [];
  }
};