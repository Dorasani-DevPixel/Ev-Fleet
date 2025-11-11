import api from "./apiClient"; // your axios instance

/**
 * Upload selected image files to the backend image endpoint
 * @param {string} assignmentId - Assignment ID
 * @param {Array<File>} files - Selected image files
 * @param {'return' | 'deposit'} type - Image type
 * @param {Function} uploadReturnPhotos - function to upload to storage (returns uploaded URLs)
 */
export const uploadEVImages = async (assignmentId, files, type, uploadReturnPhotos) => {
  if (!assignmentId) throw new Error("Assignment ID is required");
  if (!files || files.length === 0) throw new Error("No files selected");

  try {
    console.log("🚀 Uploading files to storage...");
    const data = await uploadReturnPhotos(files); // function you already use
    console.log("✅ Storage upload complete:", data.files);

    const payload = {
      type: type === "return" ? "return" : "deposit",
      transactionImages: data.files.map((file) => ({
        fileName: file.fileName,
        mimeType: file.mimeType,
        url: file.url,
      })),
    };

    console.log("📤 Sending metadata to backend:", payload);

    const response = await api.post(
      `https://evbackend-m56s.onrender.com/api/assignments/${assignmentId}/evimages`,
      payload
    );

    console.log("✅ EV images uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ uploadEVImages failed:", error);
    throw error;
  }
};
