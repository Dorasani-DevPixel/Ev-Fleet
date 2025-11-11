import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import { MdPersonAddAlt, MdPersonRemoveAlt1 } from "react-icons/md";

function AssignmentHeader({
  vehicleNumber,
  vehicleName,
  rent,
  frequency,
  deposit,
  step,
  setStep,
  Personicon,
  hideBack = false,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      console.log("Im here 1");
    } else {
      console.log("Im here");
      navigate("/home/assignments"); 
    }
  };

  const handleInfo = () => {
    alert(
      `Vehicle Info:\n${vehicleNumber} - ${vehicleName}\nRent: ₹${rent} ${
        frequency ? ` (${frequency})` : ""
      }\nDeposit: ₹${deposit}`
    );
  };

  const handlePerson = () => {
    if (Personicon === "1") {
      alert("Add person clicked!");
    } else if (Personicon === "2") {
      alert("Remove person clicked!");
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
        justifyContent: "space-between",
      }}
    >
      {!hideBack && (
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
      )}

      <Box sx={{ flex: 1, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: "#002D72",
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
          Rent: ₹{rent} {frequency ? ` (${frequency})` : ""} &nbsp; | &nbsp;
          Deposit: ₹{deposit}
        </Typography>
      </Box>

      <IconButton
        onClick={Personicon ? handlePerson : handleInfo}
        sx={{ pr: 1 }}
      >
        {Personicon === "1" || Personicon === "2" ? (
          <Box></Box>
        ) : (
          <InfoOutlinedIcon sx={{ color: "#002D72", fontSize: 24 }} />
        )}
      </IconButton>
    </Box>
  );
}

export default AssignmentHeader;
