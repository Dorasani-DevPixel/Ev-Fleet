import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

function ReturnHeader({ vehicleNumber, vehicleName, rent, deposit, step, setStep, riderName }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        py: 1.2,
        position: "fixed",
        top: 100,
        left: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // 👈 Center the content
      }}
    >
      {/* Back button on absolute left */}
      <IconButton
        onClick={handleBack}
        sx={{
          position: "absolute",
          left: 8, // small padding from left edge
          color: "#000",
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 24 }} />
      </IconButton>

      {/* Centered Info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.8,
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: "#115293",
              fontSize: { xs: "0.95rem", sm: "1rem" },
            }}
          >
            {vehicleNumber}
          </Typography>
          <Typography
            sx={{
              color: "#000",
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
            }}
          >
            | {vehicleName}
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.75rem", sm: "0.8rem" },
            mt: 0.3,
          }}
        >
          Rider: {rent || riderName}
        </Typography>
      </Box>
    </Box>
  );
}

export default ReturnHeader;
