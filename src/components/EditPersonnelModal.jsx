import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonnelEditSuccessModal from "./PersonnelEditSuccessModal";
import { updatePersonnel, fetchSupervisorName } from "../api/personnelService";

export default function EditPersonnelModal({ open, onClose, personnel }) {
  const [formData, setFormData] = useState(personnel || {});
  const [loading, setLoading] = useState(false);
  const [loadingSupervisor, setLoadingSupervisor] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
    const personnelStatuses = ["Active", "Inactive", "On Leave", "Terminated"];
  const positions = ["Rider", "Area Manager", "City Head", "Regional Leader"];
 

  useEffect(() => {
    setFormData(personnel || {});
  }, [personnel]);

  // 🧠 Fetch supervisor name when supervisorId changes (onBlur)
  const handleSupervisorBlur = async () => {
    const id = formData.supervisorId?.trim();
    if (!id) {
     
      return;
    }

    setLoadingSupervisor(true);
    try {
      const name = await fetchSupervisorName(id);
      setFormData((prev) => ({
        ...prev,
        supervisorName: name || "No supervisor found",
      }));
    } catch (error) {
      console.error("Failed to fetch supervisor name:", error);
      setFormData((prev) => ({ ...prev, supervisorName: "No supervisor found" }));
    } finally {
      setLoadingSupervisor(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const id = formData.id;
     
      const { supervisorName, ...payload } = formData;

      const response = await updatePersonnel(id, payload);

      setLoading(false);
      setSuccessOpen(true);
      onClose();

      if (onSave) onSave(response);
    } catch (error) {
      console.error("❌ Error updating personnel:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Personnel Details
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* ID */}
            <TextField
              label="Personnel ID"
              name="id"
              value={formData.id || ""}
              fullWidth
              InputProps={{
                readOnly: true,
                sx: { height: 40 },
              }}
            />

            {/* Name */}
            <TextField
              label="Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              InputProps={{ sx: { height: 40 } }}
            />

            {/* Phone */}
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              fullWidth
              InputProps={{ sx: { height: 40 } }}
            />

            {/* Position */}
            <TextField
              select
              label="Position"
              name="position"
              value={formData.position || ""}
              onChange={handleChange}
              fullWidth
              InputProps={{ sx: { height: 40 } }}
            >
              {positions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>

            {/* Employment Status */}
            <TextField
              select
              label="Employment Status"
              name="employmentStatus"
              value={formData.employmentStatus || ""}
              onChange={handleChange}
              fullWidth
              InputProps={{ sx: { height: 40 } }}
            >{personnelStatuses.map((pos) => (
                            <MenuItem key={pos} value={pos}>
                              {pos}
                            </MenuItem>
                          ))}
                        </TextField>
            

          
             

            {/* Location */}
            <TextField
              label="Location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              fullWidth
              InputProps={{ sx: { height: 40 } }}
            />

            {/* Supervisor ID */}
            <TextField
              label="Supervisor ID"
              name="supervisorId"
              value={formData.supervisorId || ""}
              onChange={handleChange}
              onBlur={handleSupervisorBlur}
              fullWidth
              InputProps={{
                sx: { height: 40 },
                endAdornment: loadingSupervisor && <CircularProgress size={20} />,
              }}
            />

            {/* Supervisor Name (Auto populated) */}
            <TextField
              label="Supervisor Name"
              name="supervisorName"
              value={
                loadingSupervisor
                  ? "Fetching..."
                  : formData.supervisorName || ""
              }
              fullWidth
              InputProps={{
                readOnly: true,
                sx: { height: 40 },
              }}
              disabled
            />

            {/* Notes */}
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pb: 2,
          }}
        >
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <PersonnelEditSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        personnel={formData}
      />
    </>
  );
}
