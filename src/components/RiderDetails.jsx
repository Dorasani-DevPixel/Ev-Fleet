import React from "react";
import { Box, Typography } from "@mui/material";

export default function RiderDetails({
  riderName,
  riderNumber,
  assignmentDate,
  returnDate,
  showReturnDate = false,
}) {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E0E0E0",
        px:2,
        mt:10,
        pb:2
      }}
    >
      
      <Typography
        sx={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          color: "#1A1A1A",
          mb: 2,
          mt:1
        }}
      >
        Rider Details
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: "#9E9E9E",
            mb: 0.5,
          }}
        >
          Rider Name
        </Typography>
        <Typography
          sx={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#1A237E",
          }}
        >
          {riderName}
        </Typography>
      </Box>

   
      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: "#9E9E9E",
            mb: 0.5,
          }}
        >
          Rider Number
        </Typography>
        <Typography
          sx={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#1A237E",
          }}
        >
          {riderNumber}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: showReturnDate ? "row" : "column",
          justifyContent: showReturnDate ? "space-between" : "flex-start",
          gap: showReturnDate ? "40px" : "16px",
          flexWrap: "wrap",
        }}
      >
       
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: "#9E9E9E",
              mb: 0.5,
            }}
          >
            Assignment Date
          </Typography>
          <Typography
            sx={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              color: "#1A237E",
            }}
          >
            {assignmentDate}
          </Typography>
        </Box>

        {showReturnDate && (
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "#9E9E9E",
                mb: 0.5,
              }}
            >
              Return Date
            </Typography>
            <Typography
              sx={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#1A237E",
              }}
            >
              {returnDate || "—"}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
