import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

export default function ReturnPayment({
  amountPaid,
  setAmountPaid,
  notes,
  setNotes,
  depositAmount,
  vehicleStatus,
  setVehicleStatus,
}) {
  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        bgcolor: "white",
        borderRadius: 3,
        mt: 4,
        p: 2,
      }}
    >
      {/* ✅ Vehicle Status Dropdown */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Vehicle Status
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <Select
          value={vehicleStatus}
          onChange={(e) => setVehicleStatus(e.target.value)}
          displayEmpty
          sx={{
            borderRadius: "12px",
            height: 45,
            fontWeight: 500,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d3d3d3",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#999",
            },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
            },
          }}
        >
          <MenuItem value="" disabled>
            Select Vehicle Status
          </MenuItem>
          <MenuItem value="Idle" sx={{ color: "green", fontWeight: 600 }}>
            Is in good condition
          </MenuItem>
          <MenuItem value="Repair" sx={{ color: "#b38b00", fontWeight: 600 }}>
            Needs Repair
          </MenuItem>
        </Select>
      </FormControl>

      <Typography variant="h6" fontWeight="bold">
        Total Deposit: {depositAmount}
      </Typography>

      <TextField
        fullWidth
        type="number"
        label="Amount Returned"
        value={amountPaid}
        onChange={(e) => setAmountPaid(e.target.value)}
        sx={{
          mt: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 15,
          },
        }}
      />

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
        Additional Notes
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={2}
        placeholder="Enter notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
}
