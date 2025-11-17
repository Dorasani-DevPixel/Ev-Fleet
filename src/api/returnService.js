
import api from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Upload return photos for a vehicle (with console tracking)
 * @param {Array} photos - Array of photo objects (each containing a file)
 * @returns {Promise<Object>} - API response containing uploaded file URLs
 */

export const fetchCompletedAssignments = async (pageToken = null) => {
  const url = pageToken
    ? `${ENDPOINTS.ASSIGNMENTS_COMPLETED}&pageToken=${pageToken}`
    : ENDPOINTS.ASSIGNMENTS_COMPLETED;
  return await api.get(url);
};
export const uploadReturnPhotos = async (photos) => {
  console.log("📸 Starting upload of return photos...");

  const formData = new FormData();

  photos.forEach((photo, index) => {
    if (photo.file) {
      console.log(`🖼️ Adding file [${index + 1}]:`, photo.file.name);
      formData.append("files", photo.file);
    } else {
      console.warn(`⚠️ Skipping photo [${index + 1}] — no file found`);
    }
  });

  try {
    const response = await api.post(ENDPOINTS.UPLOAD_RETURN_PHOTOS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`📤 Upload progress: ${progress}%`);
      },
    });

    console.log("✅ Upload successful! Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Upload failed:", error.response?.data || error.message);
    throw error;
  }
};

export const updateAssignment = async (assignmentId, { transactionImages, amountPaid, notes1, notes2, notes3, vehicleStatus }) => {
 
  const safeTransactionImages = Array.isArray(transactionImages)
    ? transactionImages.map((file, index) => ({
        fileName: file.fileName || `returnImage_${index + 1}`,
        mimeType: file.mimeType || "image/jpeg",
        url: file.url || "",
      }))
    : [];
    const returnNotes = [
    {
      content: notes1 || "",
      type: "image",
      phase: "deposit",
    },
    {
      content: notes2 || "",
      type: "image",
      phase: "return",
    },
    {
      content: notes3 || "",
      type: "payment",
      phase: "return",
    },
  ];

  const payload = {
    transactionImages: safeTransactionImages,
    depositAmountReturned: Number(amountPaid) || 0,
    returnNotes,
    vehicleStatus: vehicleStatus,
  };
 
  const requestBody =  payload ;
  console.log("Sending PUT request body:", JSON.stringify(requestBody, null, 2));

  try {
    const response = await api.put(`/assignments/${assignmentId}/update`, requestBody, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Assignment updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating assignment:", error.response?.data || error);
    throw error;
  }
};



