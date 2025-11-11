import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PersonnelEditSuccessModal({ open, onClose, personnel }) {
  if (!personnel) return null;

  const handleClose = () => {
    onClose();
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
        Personnel Profile Edited
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
          <Typography fontWeight={600}>Personnel ID</Typography>
          <Typography>{personnel.id || "N/A"}</Typography>

          <Typography fontWeight={600}>Name</Typography>
          <Typography>{personnel.name || "N/A"}</Typography>

          <Typography fontWeight={600}>Phone</Typography>
          <Typography>{personnel.phone || "N/A"}</Typography>

          <Typography fontWeight={600}>Position</Typography>
          <Typography>{personnel.position || "N/A"}</Typography>

          <Typography fontWeight={600}>Employment Status</Typography>
          <Typography>{personnel.employmentStatus || "N/A"}</Typography>

          <Typography fontWeight={600}>Assignment Status</Typography>
          <Typography>{personnel.assignmentStatus || "N/A"}</Typography>

          <Typography fontWeight={600}>Supervisor ID</Typography>
          <Typography>{personnel.supervisorId || "N/A"}</Typography>

          <Typography fontWeight={600}>Location</Typography>
          <Typography>{personnel.location || "N/A"}</Typography>

          <Typography fontWeight={600}>Notes</Typography>
          <Typography>{personnel.notes || "—"}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
