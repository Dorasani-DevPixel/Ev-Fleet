import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchSupervisorName, checkPhoneNumber, addPersonnel } from "../api/personnelService";
import PersonnelSuccessModal from "./PersonnelSuccessModal";

export default function AddPersonnelModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    position: "",
    location: "",
    supervisorId: "",
    supervisorName: "",
  });

  useEffect(() => {
    if (!open) {
      setForm({
        name: "",
        phone: "",
        position: "",
        location: "",
        supervisorId: "",
        supervisorName: "",
      });
      setErrors({ phone: "" });
      setLoadingPhone(false);
      setLoadingSupervisor(false);
    }
  }, [open]);

  const [loadingSupervisor, setLoadingSupervisor] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [errors, setErrors] = useState({ phone: "" });
  const [successData, setSuccessData] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const positions = ["Rider", "City Head", "Regional Leader","EV Executive","EV Admin"];
  const personnelStatuses = ["Active", "Inactive", "On Leave", "Terminated"];

  // Update field values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "phone") {
      setErrors({ ...errors, phone: "" });
    }
  };

  // Fetch supervisor name
  const handleSupervisorBlur = async () => {
    const id = form.supervisorId.trim();
    if (!id) {
      setForm((prev) => ({ ...prev, supervisorName: "" }));
      return;
    }

    setLoadingSupervisor(true);
    try {
      const name = await fetchSupervisorName(id);
      setForm((prev) => ({
        ...prev,
        supervisorName: name || "No supervisor found",
      }));
    } catch (error) {
      console.error("Failed to fetch supervisor name:", error);
      setForm((prev) => ({ ...prev, supervisorName: "No supervisor found" }));
    } finally {
      setLoadingSupervisor(false);
    }
  };

  // Check if phone exists
  const handlePhoneBlur = async () => {
    const phone = form.phone.trim();
    if (!phone) return;

    setLoadingPhone(true);
    try {
      const response = await checkPhoneNumber(phone);
      if (response.exists) {
        const person = response.personnel;
        const message = `This phone number already exists:
ID: ${person.id}
Name: ${person.name}
Phone: ${person.phone}`;

        setErrors({ ...errors, phone: message });
      } else {
        setErrors({ ...errors, phone: "" });
      }
    } catch (error) {
      console.error("Failed to check phone number:", error);
      setErrors({ ...errors, phone: "Failed to verify phone number" });
    } finally {
      setLoadingPhone(false);
    }
  };

  // Save handler
  const handleSave = async () => {
    if (!form.name || !form.phone || !form.position || !form.location) return;
    if (errors.phone) return;

    try {
      const data = {
        name: form.name,
        phone: form.phone,
        position: form.position,
        supervisorId: form.supervisorId,
        supervisorName: form.supervisorName,
        location: form.location,
      };
      const result = await addPersonnel(data);

      onClose(); 
      setSuccessData(result);   
      setSuccessOpen(true);      
      console.log("Saved:", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: 600, borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
          }}
        >
          Enter Personnel Details
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2, overflowY: "visible !important" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Name */}
            <TextField
              required
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              variant="outlined"
              placeholder="Enter Name"
              fullWidth
              size="small"
              InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
            />

            {/* Phone */}
            <TextField
              required
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handlePhoneBlur}
              variant="outlined"
              placeholder="Enter Phone Number"
              fullWidth
              size="small"
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                endAdornment: loadingPhone && <CircularProgress size={20} />,
              }}
              InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
            />

            {/* Position */}
            <TextField
              required
              select
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              variant="outlined"
              placeholder="Select Position"
              fullWidth
              size="small"
              InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
            >
              {positions.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </TextField>
             {/* Status */}
            <TextField
              required
              select
              label="Status"
              name="Status"
              value={form.personnelStatuses}
              onChange={handleChange}
              variant="outlined"
              placeholder="Select Position"
              fullWidth
              size="small"
              InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
            >
              {personnelStatuses.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </TextField>
            {/* Location */}
            <TextField
              required
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              variant="outlined"
              placeholder="Enter Location"
              fullWidth
              size="small"
              InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
            />

            {/* Supervisor ID */}
            <TextField
              label="Supervisor ID"
              name="supervisorId"
              value={form.supervisorId}
              onChange={handleChange}
              onBlur={handleSupervisorBlur}
              variant="outlined"
              placeholder="Enter Supervisor ID"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: loadingSupervisor && <CircularProgress size={20} />,
              }}
            />

            {/* Supervisor Name */}
            <TextField
              label="Supervisor Name"
              name="supervisorName"
              value={loadingSupervisor ? "Fetching..." : form.supervisorName || ""}
              variant="outlined"
              placeholder="Supervisor Name"
              fullWidth
              size="small"
              disabled
            />
          </Box>
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={{ justifyContent: "center", pb: 2, pt: 1 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor:
                form.name && form.phone && form.position && form.location
                  ? "#1976d2"
                  : "#ccc",
              color: "#fff",
              textTransform: "none",
              borderRadius: "8px",
              width: "150px",
              height: "36px",
              "&:hover": {
                backgroundColor:
                  form.name && form.phone && form.position && form.location
                    ? "#1565c0"
                    : "#ccc",
              },
            }}
          >
            Add Personnel
          </Button>
        </DialogActions>
      </Dialog>

      <PersonnelSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        personnel={successData}
      />
    </>
  );
}
