import api from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const fetchReturnedAssignments = async (pageToken = null) => {
  const url = pageToken
    ? `${ENDPOINTS.ASSIGNMENTS}&pageToken=${pageToken}`
    : ENDPOINTS.ASSIGNMENTS;
  return await api.get(url);
};
export const fetchActiveCount = async () => {
  const response = await api.get(`${ENDPOINTS.ASSIGNMENT_COUNT}?status=Active`);
  return response.data;
};
export const searchAssignments = async (query, status = "Active") => {
  try {
    const res = await api.get(
      `/assignments/search?query=${encodeURIComponent(query)}&status=${status}`
    );
    return res.data;
  } catch (err) {
    console.error("Error searching assignments:", err);
    throw err;
  }
};
export const fetchAssignmentsByAssigned = async (assignedBy, status, pageToken = null) => {
  let url = `${ENDPOINTS.ASSIGNMENTS1}?assignedBy=${assignedBy}&status=${status}`;
  console.log(url);
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }

  const response = await api.get(url);
  console.log(response);
  return response.data;
};

export const fetchAssignmentDetails = async (assignmentId) => {
  const url = `${ENDPOINTS.ASSIGNMENTS1}/${assignmentId}/details`;
  const response = await api.get(url);
  return response.data;
};

export const updateDepositDetails = async (assignmentId, depositAmount) => {
  try {
    const url = `${ENDPOINTS.ASSIGNMENTS1}/${assignmentId}/edit`;
    console.log("PUT URL:", url);
    console.log("Request body:", { epositAmountCashPaid });

    const response = await api.put(
      url,
      { epositAmountCashPaid }, // ✅ sends { "depositAmount": 50090 }
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update deposit details:", error);
    throw error;
  }
};
export const updateReturnDepositDetails = async (assignmentId, depositAmountReturned) => {
  try {
    const url = `${ENDPOINTS.ASSIGNMENTS1}/${assignmentId}/edit`;
    console.log("PUT URL:", url);
    console.log("Request body:", { depositAmountReturned }); // ✅ fixed variable name

    const response = await api.put(
      url,
      { depositAmountReturned }, // ✅ sends { "depositAmountReturned": 50090 }
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update deposit details:", error);
    throw error;
  }
};

export const createDepositNote = async (assignmentId, content, type, phase) => {
  try {
    const url = `${ENDPOINTS.ASSIGNMENTS1}/${assignmentId}/notes`;

    // 🔹 Dynamic payload based on what you pass
    const body = {
      content,
      type,   // e.g., "PAYMENT" or "IMAGE"
      phase,  // e.g., "deposit" or "return"
    };

    console.log("📤 Creating note:", body);

    const response = await api.post(url, body, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("🟢 Note created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create deposit note:", error);
    throw error;
  }
};

export const searchActiveAssignments = async (query, pageToken = null) => {
  try {
    let url = `/assignments/search?query=${encodeURIComponent(query)}&status=Active`;

    if (pageToken) url += `&pageToken=${pageToken}`;

    console.log("🔵 Search API URL:", url);

    const res = await api.get(url);

    console.log("🟢 Search API Response:", res.data);

    return res.data;

  } catch (err) {
    console.error("❌ Error searching assignments:", err);
    throw err;
  }
};
