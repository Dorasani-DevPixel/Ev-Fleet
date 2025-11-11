import api from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const fetchAssignmentImages = async (assignmentId, type = "deposit") => {
  try {
    const url = ENDPOINTS.ASSIGNMENT_IMAGES(assignmentId, type);
    const response = await api.get(url);
    console.log("✅ Image API Response:", response.data); // 👈 log here
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching images:", error);
    throw error;
  }
};
