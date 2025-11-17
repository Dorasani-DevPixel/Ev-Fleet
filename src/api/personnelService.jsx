import api from "./apiClient";
import { ENDPOINTS } from "./endpoints";
export const fetchPersonnelDashboard = async (pageToken = null) => {
  try {
    
    const url = pageToken
      ? `/personnel?pageToken=${pageToken}`
      : `/personnel`;
   
    const response = await api.get(url);
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error("Error fetching vehicle dashboard:", error);
    throw error;
  }
};
// ✅ Fetch Supervisor Name by ID
export const fetchSupervisorName = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.PERSONNEL_NAME(id));
    if (response.data.success) {
      // ✅ directly take "name" from response
      return response.data.name || "";
    }
    return "";
  } catch (error) {
    console.error("Error fetching supervisor name:", error);
    return "";
  }
};
export const checkPhoneNumber = async (phone) => {
  const response = await api.get(
    `https://evbackend-m56s.onrender.com/api/personnel/check-phone/${phone}`
  );
  return {
    exists: response.data?.exists || false,
    personnel: response.data?.personnel || null,
  };
};
export const addPersonnel = async (data) => {
  try {
    console.log("DATA...",data);
    const response = await api.post(ENDPOINTS.ADD_PERSONNEL, data);
    return response.data;
  } catch (error) {
    console.error("Error adding personnel:", error);
    throw error;
  }
};

export const updatePersonnel = async (id, data) => {
  try {
    const response = await api.put(ENDPOINTS.UPDATE_PERSONNEL(id), data);
    return response.data;
  } catch (error) {
    console.error("Error updating personnel:", error);
    throw error;
  }
};

// ✅ Search Personnel by query, position, and optional pageToken
export const searchPersonnel = async (query, position, pageToken = null) => {
  try {
    // Build URL dynamically
    let url = `https://evbackend-m56s.onrender.com/api/personnel/search?query=${encodeURIComponent(query)}&position=${encodeURIComponent(position)}`;
    if (pageToken) {
      url += `&pageToken=${encodeURIComponent(pageToken)}`;
    }

    // Call API
    const response = await api.get(url);
  console.log("response2",response);
    // Return response data
    return response.data;
  } catch (error) {
    console.error("Error searching personnel:", error);
    throw error;
  }
};
// Fetch Unique Positions
export const fetchUniquePositions = async () => {
  try {
    const response = await api.get(ENDPOINTS.UNIQUE_POSITIONS);
    // Assuming API returns { positions: [...] }
    console.log("response",response);
    return response.data.positions || [];
  } catch (error) {
    console.error("Error fetching unique positions:", error);
    return []; // fallback to empty array
  }
};
// Fetch personnel count by position
// Fetch personnel count by position using API client
export const fetchPersonnelCount = async (position = "All") => {
  try {
    const params = {};
    if (position && position !== "All") params.position = position;

    const response = await api.get("/personnel/count", { params });
    // Assuming API returns { count: number }
    console.log("response1",response);
    return response.data.total || 0;
  } catch (error) {
    console.error("Error fetching personnel count:", error);
    return 0;
  }
};


