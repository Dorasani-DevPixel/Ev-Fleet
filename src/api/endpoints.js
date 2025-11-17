export const ENDPOINTS = {
  ASSIGNMENTS: "/assignments?status=Active",
  ASSIGNMENTS_COMPLETED: "/assignments?status=Completed",
  UPLOAD_RETURN_PHOTOS: "/uploads/evImages",
  ASSIGNMENT_IMAGES: (assignmentId, type = "deposit") =>
    `/assignments/${assignmentId}/images/${type}`,
  ASSIGNMENT_COUNT: "/assignments/count",
  VEHICLES: "/vehicles",
  ASSIGNMENTS1: "/assignments",
  RETURNS:"assignments/lite/Active",
   VEHICLES_DASHBOARD: "/vehicles/dashboard",
    PERSONNEL: "/personnel",
  PERSONNEL_NAME: (id) => `/personnel/name/${id}`,
   ADD_PERSONNEL: "/personnel/addpersonnel",
   UPDATE_PERSONNEL: (id) => `/personnel/update/${id}`,
   UNIQUE_POSITIONS: "/personnel/unique/positions",
};
