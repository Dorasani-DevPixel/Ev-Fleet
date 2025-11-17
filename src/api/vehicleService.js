import api from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Fetch overall vehicle status counts (Active, Available, Total)
 */
export const fetchVehicleStatusCount = async () => {
  const response = await api.get(`${ENDPOINTS.VEHICLES}/statusCount`);
  return response.data;
};

/**
 * Fetch vehicle count by specific status (e.g., Available or Active)
 * @param {string} status - vehicle status (e.g. "Available", "Active")
 */
export const fetchVehicleCountByStatus = async (status) => {
  const response = await api.get(`${ENDPOINTS.VEHICLES}/count?status=${status}`);
  return response.data;
};
export const fetchAssignmentsByStatus = async (status, pageToken = null) => {
  try {
    const url = pageToken
      ? `/assignments?status=${status}&pageToken=${pageToken}`
      : `/assignments?status=${status}`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching assignments by status:", error);
    throw error;
  }
};

/**
 * Fetch vehicle dashboard data (with optional pagination)
 * @param {string|null} pageToken - optional pagination token
 * @returns {Promise<Object>} API response data
 */
export const fetchVehicleDashboard = async (pageToken = null) => {
  try {
    
    const url = pageToken
      ? `/vehicles/dashboard?pageToken=${pageToken}`
      : `/vehicles/dashboard`;

    const response = await api.get(url);
    return response.data; 
  } catch (error) {
    console.error("Error fetching vehicle dashboard:", error);
    throw error;
  }
};
export const fetchVehicleFiltersMetadata = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.VEHICLES}/filters/metadata`);
    console.log("response",response);
    return response.data?.data || { statuses: [], vendors: [], locations: [] };
  } catch (error) {
    console.error("Error fetching vehicle filters metadata:", error);
    return { statuses: [], vendors: [], locations: [] };
  }
};
export const checkPlateNumber = async (plateNumber) => {
  try {
    const res = await api.get(`${ENDPOINTS.VEHICLES}/check`, {
      params: { plateNumber },
    });
    return res.data;
  } catch (err) {
    console.error("checkPlateNumber error:", err);
    throw err;
  }
};
export const addVehicle = async (vehicleData) => {
  try {
    const res = await api.post(`${ENDPOINTS.VEHICLES}/add`, vehicleData);
    return res.data;
  } catch (err) {
    console.error("addVehicle error:", err);
    throw err;
  }
};
export const updateVehicle = async (vehicleId, data) => {
  try {
    const response = await api.put(`${ENDPOINTS.VEHICLES}/update/${vehicleId}`, data);
    return response.data;
  } catch (error) {
    console.error("updateVehicle error:", error);
    throw error;
  }
};
/**
 * Fetch vehicles using filters and optional pagination
 * @param {Object} params - Filter parameters
 * @param {string} params.vehicleNumber
 * @param {string} params.status
 * @param {string} params.vendorName
 * @param {string} params.location
 * @param {string|null} params.pageToken
 * @returns {Promise<Object>} API response data
 */
export const fetchVehiclesWithFilters = async ({
  vehicleNumber = "",
  status = "",
  vendorName = "",
  location = "",
  pageToken = null,
}) => {
  try {
    const body = {
      vehicleNumber: vehicleNumber.replace(/\s+/g, ""),
      status,
      vendorName,
      location,
      pageToken,
    };

    const response = await api.post(`${ENDPOINTS.VEHICLES}/filter`, body);
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicles with filters:", error);
    throw error;
  }
};
