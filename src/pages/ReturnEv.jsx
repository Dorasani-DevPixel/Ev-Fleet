import React, { useState } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import ProgressWithStops from "../components/ProgressWithStops";
import { useLocation, useNavigate } from "react-router-dom";
import NextButton from "../components/NextButton";
import ReturnHeader from "../components/ReturnHeader";
import UploadPhotosPage from "../components/UploadPhotosPage";
import ReturnPayment from "../components/ReturnPayment";
import BeforePhotos from "../components/BeforePhotos";
import { uploadReturnPhotos, updateAssignment } from "../api/returnService";

export default function ReturnEv() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [amountPaid, setAmountPaid] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const location = useLocation();
  const { assignmentId, vehicleId, vehicleModel, riderName, depositAmount } =
    location.state || {};
  const [notes, setNotes] = useState("");
  const [notes1, setNotes1] = useState("");
  const [notes2, setNotes2] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("");
  const [returnCompleting, setReturnCompleting] = useState(false);

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (photos.length === 0) {
        alert("Please upload at least one photo before proceeding.");
        return;
      }

      try {
        setUploading(true);
        console.log("Uploading return photos...");
        const data = await uploadReturnPhotos(photos);
        console.log("Uploaded files:", data.files);
        localStorage.setItem("returnedFiles", JSON.stringify(data.files));
        setStep(3);
      } catch (error) {
        console.error("Upload error in ReturnEv.jsx:", error);
        alert("Failed to upload photos. Please try again.");
      } finally {
        setUploading(false);
      }
    } else if (step === 3) {
      try {
        setReturnCompleting(true);
        const returnedFiles =
          JSON.parse(localStorage.getItem("returnedFiles")) || [];

        const response = await updateAssignment(assignmentId, {
          transactionImages: returnedFiles,
          amountPaid: amountPaid || 0,
          notes1,
          notes2,
          notes3: notes,
          vehicleStatus: vehicleStatus,
        });
        console.log("Assignment updated successfully:", response.data);
        setOpenModal(true);
      } catch (error) {
        console.error("Update error:", error);
        alert("Failed to update assignment. Please try again.");
      } finally {
        setReturnCompleting(false); // 🔥 stop spinner
      }
    }
  };

  const handleBack = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));
  const isNextDisabled =
    (step === 2 && photoCount < 1) || (step === 3 && !vehicleStatus);

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("home/assignmentscompleted");
  };

  return (
    <>
      <ReturnHeader
        vehicleNumber={vehicleId}
        vehicleName={vehicleModel}
        riderName={riderName}
        vehicleImage="/images/vehicle.jpg"
        step={step}
        setStep={setStep}
      />

      <Box
        sx={{
          position: "fixed",
          top: 72,
          left: 0,
          width: "100vw",
          bgcolor: "white",
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <ProgressWithStops
          steps={[1, 2, 3]}
          labels={["Check Vehicle", "Upload Photos", "Return Deposit"]}
          activeStep={step}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 280,
          bottom: 80,
          left: 0,
          width: "100vw",
          overflowY: "auto",
          bgcolor: "white",
          zIndex: 900,
          py: 1,
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        }}
      >
        {step === 1 ? (
          <BeforePhotos
            assignmentId={assignmentId}
            notes1={notes1}
            setNotes1={setNotes1}
            beforePhotos={beforePhotos}
            setBeforePhotos={setBeforePhotos}
          />
        ) : step === 2 ? (
          <UploadPhotosPage
            photos={photos}
            setPhotos={setPhotos}
            notes2={notes2}
            setNotes2={setNotes2}
            onPhotoCountChange={(count) => setPhotoCount(count)}
          />
        ) : (
          <ReturnPayment
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            notes={notes}
            setNotes={setNotes}
            depositAmount={depositAmount}
            vehicleStatus={vehicleStatus}
            setVehicleStatus={setVehicleStatus}
          />
        )}
      </Box>

      <NextButton
        onNext={handleNext}
        step={step}
        disabled={isNextDisabled}
        paymentReceivedNow={true}
        mode="return"
      />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: 2,
            p: 2,
            boxShadow: 24,
            width: "90%",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            EV Return Complete
          </Typography>

          <Typography variant="body1" sx={{ mb: 1, color: "#002D72" }}>
            Return Amount: ₹{amountPaid || 0}
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
            <strong style={{ color: "black" }}>{riderName}</strong> returned the
            vehicle successfully!
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleCloseModal}
            sx={{ borderRadius: 2, px: 4, bgcolor: "#002D72" }}
          >
            Okay
          </Button>
        </Box>
      </Modal>
      {uploading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            flexDirection: "column",
          }}
        >
          <div className="spinner" />
          <Typography sx={{ mt: 2, color: "#002D72", fontWeight: 600 }}>
            Uploading photos... please wait
          </Typography>
        </Box>
      )}
      {returnCompleting && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
            flexDirection: "column",
          }}
        >
          <div className="spinner" />
          <Typography sx={{ mt: 2, color: "#002D72", fontWeight: 600 }}>
            Completing return... please wait
          </Typography>
        </Box>
      )}
    </>
  );
}
