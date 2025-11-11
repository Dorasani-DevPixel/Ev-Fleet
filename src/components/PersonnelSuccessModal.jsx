import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PersonnelSuccessModal({ open, onClose, personnel }) {
  if (!personnel) return null;

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
        Personnel ID Created
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
          <Typography fontWeight={600}>Name</Typography>
          <Typography>{personnel.data.name}</Typography>

          <Typography fontWeight={600}>Personnel ID</Typography>
          <Typography>{personnel.data.id}</Typography>

          <Typography fontWeight={600}>Position</Typography>
          <Typography>{personnel.data.position}</Typography>

          <Typography fontWeight={600}>Phone Number</Typography>
          <Typography>{personnel.data.phone}</Typography>

          {/* Conditionally render Supervisor Name */}
          {personnel.data.supervisorName && (
            <>
              <Typography fontWeight={600}>Supervisor Name</Typography>
              <Typography>{personnel.data.supervisorName}</Typography>
            </>
          )}

          {/* Conditionally render Supervisor ID */}
          {personnel.data.supervisorId && (
            <>
              <Typography fontWeight={600}>Supervisor ID</Typography>
              <Typography>{personnel.data.supervisorId}</Typography>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
