import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function VehicleSuccessModal({ open, onClose, vehicle }) {
  if (!vehicle) return null;

  const handleClose = () => {
    onClose(); // Close modal
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: 500, borderRadius: "16px", p: 3 },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 600,
          fontSize: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Vehicle Added Successfully
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: 2,
            columnGap: 4,
          }}
        >
          <Typography fontWeight={600}>Model</Typography>
          <Typography>{vehicle.model}</Typography>

          <Typography fontWeight={600}>Plate Number</Typography>
          <Typography>{vehicle.plateNumber}</Typography>

          <Typography fontWeight={600}>Type</Typography>
          <Typography>{vehicle.type}</Typography>

          <Typography fontWeight={600}>Deposit Amount</Typography>
          <Typography>{vehicle.depositAmount}</Typography>

          <Typography fontWeight={600}>Rental Rate</Typography>
          <Typography>{vehicle.rentalRate}</Typography>

          <Typography fontWeight={600}>Rental Frequency</Typography>
          <Typography>{vehicle.rentalFrequency}</Typography>

          <Typography fontWeight={600}>Location</Typography>
          <Typography>{vehicle.location}</Typography>

          <Typography fontWeight={600}>Vendor Name</Typography>
          <Typography>{vehicle.vendorName}</Typography>

          <Typography fontWeight={600}>Status</Typography>
          <Typography>{vehicle.status}</Typography>

          <Typography fontWeight={600}>Battery Type</Typography>
          <Typography>{vehicle.batteryType}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
