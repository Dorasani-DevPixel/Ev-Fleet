import api from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Fetch assignments based on assignedBy and status, with pagination
 * @param {string} assignedBy - ID of the assigner (e.g., "IOO-646")
 * @param {string} status - Active or Inactive
 * @param {number} page - current page
 * @param {number} limit - number of records per page
 */
export const fetchAssignmentsByStatus = async (assignedBy, status, page = 1, limit = 5) => {
  const response = await api.get(`${ENDPOINTS.ASSIGNMENTS1}`, {
    params: { assignedBy, status, page, limit },
  });
  return response.data;
};
