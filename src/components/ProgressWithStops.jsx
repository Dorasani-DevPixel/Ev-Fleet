import React from "react";
import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function ProgressWithStops({ steps, labels, activeStep }) {
  const stepArray = Array.isArray(steps)
    ? steps
    : Array.from({ length: steps }, (_, i) => i + 1);

  const circleDiameter = 36;
  const lineThickness = 3;

  return (
    <Box sx={{ width: "100%", px: 4, boxSizing: "border-box" }}>
      <Box
        sx={{
          position: "fixed",
          display: "flex",
          top:180,
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          mt: 1.5,
        }}
      >
        {/* === Base Gray Line (starts at end of 1st circle, ends at start of last circle) === */}
        <Box
          sx={{
            position: "absolute",
            top: `${circleDiameter / 2}px`,
            left: `calc(${100 / (stepArray.length * 2)}%)`,
            right: `calc(${100 / (stepArray.length * 2)}%)`,
            height: `${lineThickness}px`,
            backgroundColor: "#D1D1D1",
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />

        {/* === Active Blue Line === */}
        <Box
          sx={{
            position: "absolute",
            top: `${circleDiameter / 2}px`,
            left: `calc(${100 / (stepArray.length * 2)}%)`,
            height: `${lineThickness}px`,
            backgroundColor: "#002D72",
            zIndex: 1,
            transform: "translateY(-50%)",
            width:
              activeStep === 1
                ? "0%"
                : `calc(((100% - ${100 / stepArray.length}%) / ${
                    stepArray.length - 1
                  }) * ${Math.min(activeStep - 1, stepArray.length - 1)})`,
          }}
        />

        {/* === Circles and Labels === */}
        {stepArray.map((num, index) => {
          const isCompleted = num < activeStep;
          const isActive = num === activeStep;

          return (
            <Box
              key={num}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                zIndex: 2,
                flex: 1,
              }}
            >
              {/* Step Circle */}
              <Box
                sx={{
                  width: circleDiameter,
                  height: circleDiameter,
                  borderRadius: "50%",
                  backgroundColor:
                    isCompleted || isActive ? "#002D72" : "#C6C6C6",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  zIndex: 3,
                }}
              >
                {isCompleted ? (
                  <CheckIcon sx={{ fontSize: 20, color: "white" }} />
                ) : (
                  num
                )}
              </Box>

              {/* Step Label */}
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontSize: { xs: "0.75rem", sm: "0.9rem" },
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#002D72" : "#555",
                  maxWidth: { xs: 80, sm: 120 },
                  textAlign: "center",
                  lineHeight: 1.2,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {labels[index]}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
