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
  CircularProgress,
  Typography,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { checkPlateNumber, addVehicle } from "../api/vehicleService";
import VehicleSuccessModal from "./VehicleSuccessModal";
export default function AddVehicleModal({ open, onClose }) {
  const [form, setForm] = useState({
    model: "",
    plateNumber: "",
    type: "",
    depositAmount: "",
    rentalRate: "",
    rentalFrequency: "",
    location: "",
    vendorName: "",
    status: "",
    batteryType: "",
  });
  const [vehicleSuccessOpen, setVehicleSuccessOpen] = useState(false);
  const [addedVehicle, setAddedVehicle] = useState(null);

  const [errors, setErrors] = useState({ plateNumber: "" });
  const [loadingPlate, setLoadingPlate] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
   const frequencies = ["Per Day", "Per Week", "Per Month"];
   const statuses = [ "New Deploy","Active","Repair","Accident","Idle","FR","PS"];
  useEffect(() => {
    if (!open) {
      setForm({
        model: "",
        plateNumber: "",
        type: "",
        depositAmount: "",
        rentalRate: "",
        rentalFrequency: "",
        location: "",
        vendorName: "",
        status: "",
        batteryType: "",
      });
      setErrors({ plateNumber: "" });
      setLoadingPlate(false);
      setLoadingSave(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "plateNumber") setErrors({ ...errors, plateNumber: "" });
  };

  const handlePlateBlur = async () => {
    const plate = form.plateNumber.trim();
    if (!plate) return;

    setLoadingPlate(true);
    try {
      const res = await checkPlateNumber(plate);
      if (res.exists) {
        setErrors({ ...errors, plateNumber: "Vehicle already exists with this plate number" });
      } else {
        setErrors({ ...errors, plateNumber: "" });
      }
    } catch {
      setErrors({ ...errors, plateNumber: "Failed to validate plate number" });
    } finally {
      setLoadingPlate(false);
    }
  };

  const handleSave = async () => {
    if (Object.values(form).some((val) => !val)) return;
    if (errors.plateNumber) return;

    setLoadingSave(true);
    try {
      const res = await addVehicle(form);
      console.log("Vehicle added:", res.data);
      setAddedVehicle(res.data);
       setVehicleSuccessOpen(true);     // Open the success modal
       onClose(); 
     
    } catch {
      alert("Failed to add vehicle");
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <>
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 600, borderRadius: "16px", p: 1 } }}
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
        Enter Vehicle Details
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, overflowY: "visible !important" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Model */}
          <TextField
            required
            label="Model"
            name="model"
            value={form.model}
            onChange={handleChange}
            variant="outlined"
            placeholder="Enter Model"
            fullWidth
            size="small"
            InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
          />

          {/* Plate Number */}
          <TextField
            required
            label="Plate Number"
            name="plateNumber"
            value={form.plateNumber}
            onChange={handleChange}
            onBlur={handlePlateBlur}
            variant="outlined"
            placeholder="Enter Plate Number"
            fullWidth
            size="small"
            error={!!errors.plateNumber}
            helperText={errors.plateNumber}
            InputProps={{ endAdornment: loadingPlate && <CircularProgress size={20} /> }}
            InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
          />

          {/* Type */}
          <TextField
            required
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            variant="outlined"
            placeholder="Enter Type"
            fullWidth
            size="small"
            InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
          />
          {/* Status */}
          <TextField
            select
            required
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            variant="outlined"
            placeholder="Enter Status"
            fullWidth
            size="small"
            InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
          >  {statuses.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)} </TextField>
          {/* Deposit Amount */}
          <TextField
            required
            label="Deposit Amount"
            name="depositAmount"
            type="number"
            value={form.depositAmount}
            onChange={handleChange}
            variant="outlined"
            placeholder="Enter Deposit Amount"
            fullWidth
            size="small"
            InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
          />

          {/* Rental Rate */}
          <TextField
            required
            label="Rental Rate"
            name="rentalRate"
            value={form.rentalRate}
            onChange={handleChange}
            variant="outlined"
            placeholder="Enter Rental Rate"
            fullWidth
            size="small"
            InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
          />

          {/* Rental Frequency */}
          <TextField
            required
            select 
            label="Rental Frequency"
            name="rentalFrequency"
            value={form.rentalFrequency}
            onChange={handleChange}
            variant="outlined"
            placeholder="Enter Rental Frequency"
            fullWidth
            size="small"
            InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
          >
          {frequencies.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)} </TextField>

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

          {/* Vendor Name */}
          <TextField
            required
            label="Vendor Name"
            name="vendorName"
            value={form.vendorName}
            onChange={handleChange}
            variant="outlined"
            placeholder="Enter Vendor Name"
            fullWidth
            size="small"
            InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
          />

          

          {/* Battery Type */}
          <TextField
            required
            label="Battery Type"
            name="batteryType"
            value={form.batteryType}
            onChange={handleChange}
            variant="outlined"
            placeholder="Enter Battery Type"
            fullWidth
            size="small"
            InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2, pt: 1 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: Object.values(form).every((val) => val) ? "#1976d2" : "#ccc",
            color: "#fff",
            textTransform: "none",
            borderRadius: "8px",
            width: "150px",
            height: "36px",
            "&:hover": {
              backgroundColor: Object.values(form).every((val) => val) ? "#1565c0" : "#ccc",
            },
          }}
          disabled={loadingSave || !!errors.plateNumber}
        >
          {loadingSave ? <CircularProgress size={24} color="inherit" /> : "Add Vehicle"}
        </Button>
      </DialogActions>
    </Dialog>
    <VehicleSuccessModal
  open={vehicleSuccessOpen}
  onClose={() => setVehicleSuccessOpen(false)}
  vehicle={addedVehicle}
/>
</>
  );
}
