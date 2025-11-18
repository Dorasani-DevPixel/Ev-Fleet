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
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateVehicle } from "../api/vehicleService"; // ✅ import API function
import VehicleEditSuccessModal from "./VehicleEditSuccessModal";
export default function EditVehicleModal({ open, onClose, vehicle }) {
  const [formData, setFormData] = useState(vehicle || {});
  console.log("data",formData);
  const [loading, setLoading] = useState(false);
   const [addedVehicle, setAddedVehicle] = useState(null);
    const [vehicleSuccessOpen, setVehicleSuccessOpen] = useState(false);
  const frequencies = ["Per Day", "Per Week", "Per Month"];
     const statuses = [ "New Deploy","Active","Repair","Accident","Idle","FR","PS"];
  useEffect(() => {
    setFormData(vehicle || {});
    console.log("data",formData);
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const vehicleId = formData?.plateNumber; // you said plateNumber = docId
      let rentalRatePerDay = Number(formData.rentalRate) || 0;
      const freq = (formData.rentalFrequency || "").toLowerCase();

      // 🧮 Calculate based on frequency (your logic)
      if (freq.includes("week")) {
        rentalRatePerDay = rentalRatePerDay / 7;
      } else if (freq.includes("month")) {
        rentalRatePerDay = rentalRatePerDay / 30;
      } else if (freq.includes("year")) {
        rentalRatePerDay = rentalRatePerDay / 365;
      }

      // round to 2 decimals for consistency
      rentalRatePerDay = Number(rentalRatePerDay.toFixed(2));
        console.log("edit",formData);
        const updatedData = {
        ...formData,
        rentalRatePerDay,
        updatedAt: new Date().toISOString(),
      };
      const res = await updateVehicle(vehicleId, updatedData);
      console.log("✅ Vehicle updated:", res);
      setAddedVehicle(res.data);
       setVehicleSuccessOpen(true);     // Open the success modal
       onClose(); 

    } catch (error) {
      console.error("❌ Error updating vehicle:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit EV Details
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
          {/* Vehicle Number - at top and not editable */}
          <TextField
            label="Vehicle Number"
            name="plateNumber"
            value={formData.plateNumber || ""}
            fullWidth
            InputProps={{
              readOnly: true,
              sx: { height: 40 },
            }}
          />

          <TextField
            label="Vendor"
            name="vendorName"
            value={formData.vendorName || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{ sx: { height: 40 } }}
          />
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{ sx: { height: 40 } }}
          > {statuses.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)} </TextField>
          <TextField
            select
            label="Assignment Status"
            name="assignmentStatus"
            value={formData.assignmentStatus || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{ sx: { height: 40 } }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
          </TextField>
          <TextField
            label="Location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{ sx: { height: 40 } }}
          />
          <TextField
            label="Rent Amount (₹)"
            name="rentalRate"
            value={formData.rentalRate || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{ sx: { height: 40 } }}
          />
           <TextField
            select 
            label="Rental Frequency"
            name="rentalFrequency"
            value={formData.rentalFrequency}
            onChange={handleChange}
            fullWidth
            InputProps={{ sx: { height: 40 } }}
          >
          {frequencies.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)} </TextField>
          <TextField
            label="Model"
            name="model"
            value={formData.model || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{ sx: { height: 40 } }}
          />
          <TextField
            label="Make"
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{ sx: { height: 40 } }}
          />
          <TextField
            label="Battery Type"
            name="batteryType"
            value={formData.batteryType || ""}
            onChange={handleChange}
            fullWidth
            InputProps={{ sx: { height: 40 } }}
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
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
       <VehicleEditSuccessModal
      open={vehicleSuccessOpen}
      onClose={() => setVehicleSuccessOpen(false)}
      vehicle={addedVehicle}
    />
    </>
  );
}
