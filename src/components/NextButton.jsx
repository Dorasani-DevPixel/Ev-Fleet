import { Button, Box, Typography } from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";

function NextButton({
  onNext,
  onAlternate, // optional callback for Alternate Method
  step = 1,
  location = "Hyderabad, Telangana",
  disabled = false,
  paymentReceivedNow,
  mode = "assignment", // 👈 'assignment' or 'return'
}) {
  let buttonLabel = "Next →";

  if (step === 3 && !paymentReceivedNow) {
    buttonLabel = "Online Payment";
  } else if (step === 3 && paymentReceivedNow) {
    buttonLabel = "Complete Return";
  }

  const showAlternate = mode === "assignment" && step === 3; // 👈 only for RiderAssignment

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 1,
        pb: 1,
        zIndex: 1300,
        boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {step === 3 ? (
        <>
          {/* --- Main Button (Online / Payment Complete) --- */}
          <Button
            variant="contained"
            fullWidth
            disabled={disabled}
            startIcon={mode === "assignment" ? <QrCode2Icon /> : null}
            onClick={!disabled ? onNext : undefined}
            sx={{
              bgcolor: disabled ? "grey.400" : "#002D72",
              color: "#fff",
              py: 1.8,
              borderRadius: 2,
              textTransform: "none",
              mx: 2,
              fontSize: "1rem",
              fontWeight: 500,
              "&:hover": {
                bgcolor: disabled ? "grey.500" : "#001a4d",
              },
            }}
          >
            {buttonLabel}
          </Button>

          {/* --- Alternate Method (Only for RiderAssignment) --- */}
          {showAlternate && (
            <Button
              variant="outlined"
              fullWidth
              onClick={onAlternate}
              sx={{
                borderColor: "#B0B0B0",
                color: "#6C6C6C",
                py: 1.5,
                mt: 1.2,
                borderRadius: 2,
                textTransform: "none",
                mx: 2,
                fontSize: "0.95rem",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#8A8A8A",
                  bgcolor: "#f8f8f8",
                },
              }}
            >
              Alternate Method
            </Button>
          )}

          {/* --- Location Label --- */}
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "gray",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {location}
          </Typography>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            fullWidth
            disabled={disabled}
            onClick={!disabled ? onNext : undefined}
            sx={{
              bgcolor: disabled ? "grey.400" : "#002D72",
              color: "#fff",
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              mx: 2,
              "&:hover": {
                bgcolor: disabled ? "grey.500" : "#002D72",
              },
            }}
          >
            {buttonLabel}
          </Button>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "gray",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {location}
          </Typography>
        </>
      )}
    </Box>
  );
}

export default NextButton;
