import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function AssignmentCompleteScreen({
  riderName = "",
  vehicleNumber = "",
  paidAmount = 0,
  pendingAmount = 0,
  modeOfPayment = "Online",
}) {
  return (
    <Box
      sx={{
        position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    p: 3,
      }}
    >
      {/* ===== Title ===== */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "700",
          color: "#002D72",
          mb: 3,
          textAlign: "center",
        }}
      >
        Assignment Complete
      </Typography>

      {/* ===== Details ===== */}
      <Box sx={{ width: "100%"}}>
        <Typography
          variant="body1"
          sx={{ color: "#002D72", fontWeight: "600", mb: 0.5 }}
        >
          Rider: <span style={{ color: "#000" }}>{riderName}</span>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#002D72", fontWeight: "600", mb: 1.5 }}
        >
          Vehicle Number: <span style={{ color: "#000" }}>{vehicleNumber}</span>
        </Typography>

        <Typography sx={{ mb: 0.5 }}>
          Deposit Amount Paid:{" "}
          <span style={{ fontWeight: 600 }}>₹{paidAmount}</span>
        </Typography>

        <Typography sx={{ mb: 0.5 }}>
          Mode of payment:{" "}
          <span
            style={{
              color: modeOfPayment === "Online" ? "green" : "#b58b00",
              fontWeight: 600,
            }}
          >
            {modeOfPayment}
          </span>
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Deposit Pending:{" "}
          <span style={{ fontWeight: 600 }}>₹{pendingAmount}</span>
        </Typography>
      </Box>
    </Box>
  );
}
