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

