import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import ProgressWithStops from "../components/ProgressWithStops";
import Search from "../components/Search";
import NextButton from "../components/NextButton";
import AssignmentHeader from "../components/AssignmentHeader";
import UploadPhotosPage from "../components/UploadPhotosPage";
import PaymentPage from "../components/PaymentPage";
import AssignmentCompleteScreen from "../components/AssignmentCompleteScreen";
import PaymentModals from "../components/PaymentModals";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

export default function RiderAssignment() {
  const [step, setStep] = useState(1);
  const [riderConfirmed, setRiderConfirmed] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [onlineAmount, setOnlineAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [storedVehicle, setStoredVehicle] = useState(null);
  const [storedRider, setStoredRider] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [notes2, setNotes2] = useState("");
  const [notes1, setNotes1] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [totalDeposit, setTotalDeposit] = useState("");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [cashReceivedModal, setCashReceivedModal] = useState(false);
  const [showAssignmentComplete, setShowAssignmentComplete] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [onlinePaymentDetails, setOnlinePaymentDetails] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const vehicleData = localStorage.getItem("selectedVehicle");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const TOKEN = import.meta.env.VITE_API_SECRET_KEY;

  useEffect(() => {
    if (vehicleData) {
      const parsedVehicle = JSON.parse(vehicleData);
      setStoredVehicle(parsedVehicle);
      setDepositAmount(parsedVehicle?.deposit || "");
    } else {
      navigate("/home");
    }
  }, [navigate]);

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setUploading(true);
      if (photos.length === 0) {
        alert("Please add at least one photo before proceeding.");
        setUploading(false);
        return;
      }

      try {
        const formData = new FormData();
        const options = {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        for (const photo of photos) {
          if (photo.file) {
            const compressedFile = await imageCompression(photo.file, options);
            formData.append("files", compressedFile);
          }
        }

        const res = await fetch(`${BASE_URL}/api/uploads/evImages`, {
          method: "POST",
          headers: { Authorization: `Bearer ${TOKEN}` },
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        localStorage.setItem("uploadedFiles", JSON.stringify(data.files));
        localStorage.setItem("photoNotes", notes2);
        setStep(3);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload photos. Please try again.");
      } finally {
        setUploading(false);
      }
    } else if (step === 3) {
    }
  };

  const handleGeneratePaymentQR = async () => {
    const amount = parseFloat(totalDeposit);
    const deposit = parseFloat(depositAmount);
    setPaymentMode("Online");
    setOnlineAmount(amount);
    if (isNaN(amount) || amount <= 0 || amount > deposit) {
      alert(`Enter a valid amount less than or equal to ₹${deposit}`);
      return;
    }

    try {
      setQrLoading(true);
      const res = await fetch(`${BASE_URL}/api/payments/create-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error("Failed to generate QR");
      const data = await res.json();

      if (data.success && data.image_url) {
        setQrImage(data.image_url);
        setQrModalOpen(true);
        startAutoPaymentCheck(data.qr_id);
      } else {
        alert("QR generation failed. Try again.");
      }
    } catch (err) {
      console.error("QR generation error:", err);
      alert("Error generating QR. Please try again.");
    } finally {
      setQrLoading(false);
    }
  };

  const handleAlternatePayment = async () => {
    const amount = parseFloat(totalDeposit);
    const deposit = parseFloat(depositAmount);
    setPaymentMode("Cash");
    setCashAmount(amount);
    console.log("Amount : ", amount);
    console.log("Offline Cash :", cashAmount);
    if (isNaN(amount) || amount <= 0 || amount > deposit) {
      alert(`Enter a valid amount less than or equal to ₹${deposit}`);
      return;
    }

    setCashReceivedModal(true);
    await finalizeAssignment({ cashAmount: amount });
    setTimeout(async () => {
      setCashReceivedModal(false);
      setShowAssignmentComplete(true);
    }, 3000);
  };

  const fetchPaymentDetails = async (transactionId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/payments/details/${transactionId}`
      );
      if (!res.ok) throw new Error("Failed to fetch payment details");

      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      return null;
    }
  };

  const startAutoPaymentCheck = (qrId) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      try {
        attempts++;
        const res = await fetch(
          `${BASE_URL}/api/payments/check-status/${qrId}`
        );
        if (!res.ok) throw new Error("Failed to check payment status");
        const data = await res.json();

        if (data.success && data.transaction?.status === "captured") {
          clearInterval(interval);
          setQrModalOpen(false);
          setPaymentInfo(data.transaction);
          setPaymentSuccessModal(true);
          const transactionId = data.transaction?.id;
          const fullDetails = await fetchPaymentDetails(transactionId);
          const amount = parseFloat(totalDeposit);
          if (fullDetails) setOnlinePaymentDetails(fullDetails);
          await finalizeAssignment({
            onlineAmount: amount,
            onlinePaymentDetails: fullDetails || null,
          });
          setTimeout(async () => {
            setPaymentSuccessModal(false);
            setShowAssignmentComplete(true);
          }, 4000);
        } else if (attempts >= 30) {
          clearInterval(interval);
          console.warn("⏹️ Payment polling stopped after 30 attempts");
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
        clearInterval(interval);
      }
    }, 3000);
  };

  const finalizeAssignment = async (overrideAmounts = {}) => {
    try {
      const riderData = localStorage.getItem("selectedRider");
      if (riderData) setStoredRider(JSON.parse(riderData));

      localStorage.setItem("paymentNotes", notes1);

      const paymentInfo = {
        totalDeposit: storedVehicle?.deposit || 0,
        onlineAmount:
          parseFloat(overrideAmounts.onlineAmount ?? onlineAmount) || 0,
        cashAmount: parseFloat(overrideAmounts.cashAmount ?? cashAmount) || 0,
        totalCollected:
          (parseFloat(overrideAmounts.onlineAmount ?? onlineAmount) || 0) +
          (parseFloat(overrideAmounts.cashAmount ?? cashAmount) || 0),
      };

      localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

      await createAssignment(overrideAmounts.onlinePaymentDetails);
    } catch (error) {
      console.error("Error finalizing assignment:", error);
    }
  };

  const createAssignment = async (paymentDetails = null) => {
    try {
      const storedVehicle = JSON.parse(localStorage.getItem("selectedVehicle"));
      const storedRider = JSON.parse(localStorage.getItem("selectedRider"));
      const uploadedFiles =
        JSON.parse(localStorage.getItem("uploadedFiles")) || [];
      const notes = localStorage.getItem("photoNotes") || "";
      const paymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
      console.log("Payment Info :", paymentInfo);
      const notes1 = localStorage.getItem("paymentNotes") || "";
      const depositNotes = [
        { content: notes || "", type: "image" },
        { content: notes1 || "", type: "payment" },
      ];

      const requestBody = {
        AssignedBy: userId,
        riderId: storedRider.id,
        vehicleId: storedVehicle.id,
        depositeAmount: paymentInfo.totalDeposit,
        depositAmountOnlinePaid: paymentInfo.onlineAmount,
        DepositAmountCashPaid: paymentInfo.cashAmount,
        transactionImages: uploadedFiles.map((file) => ({
          fileName: file.name,
          mimeType: file.type,
          url: file.url,
        })),
        depositNotes,
        ...(paymentDetails && { onlinePaymentDetails: paymentDetails }),
      };

      console.log("Final Request Body:", JSON.stringify(requestBody, null, 2));

      const res = await fetch(`${BASE_URL}/api/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      console.log("Assignment created successfully:", data);
    } catch (err) {
      console.error("Error creating assignment:", err);
    }
  };

  const isNextDisabled =
    (step === 1 && !riderConfirmed) ||
    (step === 2 && photoCount < 1) ||
    (step === 3 &&
      (!totalDeposit ||
        isNaN(parseFloat(totalDeposit)) ||
        parseFloat(totalDeposit) <= 0 ||
        parseFloat(totalDeposit) > parseFloat(depositAmount)));

  return (
    <>
      {storedVehicle && (
        <AssignmentHeader
          vehicleNumber={storedVehicle.plate}
          vehicleName={storedVehicle.name}
          rent={storedVehicle.rent}
          frequency={storedVehicle.frequency}
          deposit={storedVehicle.deposit}
          step={step}
          setStep={setStep}
          hideBack={showAssignmentComplete}
        />
      )}

      {/* --- Progress Bar --- */}
      <Box
        sx={{
          position: "fixed",
          top: 72,
          left: 0,
          width: "100vw",
          bgcolor: "white",
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          pt: "10px",
          pb: "30px",
        }}
      >
        <ProgressWithStops
          steps={[1, 2, 3]}
          labels={["Rider Selection", "Upload Photos", "Payment"]}
          activeStep={showAssignmentComplete ? 4 : step}
        />
      </Box>

      {/* --- Main Content --- */}
      <Box
        data-scroll-root="assignment-body"
        sx={{
          position: "absolute",
          top: 280,
          bottom: 80,
          left: 0,
          width: "100vw",
          overflowY: "auto",
          bgcolor: "white",
          zIndex: 1200,
        
        }}
      >
        {step === 1 ? (
          <Search
            setRiderConfirmed={setRiderConfirmed}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            goToNextStep={handleNext}
          />
        ) : step === 2 ? (
          <UploadPhotosPage
            photos={photos}
            setPhotos={setPhotos}
            onPhotoCountChange={(count) => setPhotoCount(count)}
            notes2={notes2}
            setNotes2={setNotes2}
          />
        ) : !showAssignmentComplete ? (
          <PaymentPage
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            notes1={notes1}
            setNotes1={setNotes1}
            totalDeposit={totalDeposit}
            setTotalDeposit={setTotalDeposit}
          />
        ) : (
          <AssignmentCompleteScreen
            riderName={storedRider?.name || "Unknown"}
            vehicleNumber={storedVehicle?.plate || "—"}
            paidAmount={parseFloat(totalDeposit) || 0}
            pendingAmount={
              (parseFloat(depositAmount) || 0) - (parseFloat(totalDeposit) || 0)
            }
            modeOfPayment={paymentMode}
          />
        )}
      </Box>

      {/* --- Footer Section --- */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "white",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "center",
          zIndex: 1200,
        }}
      >
        {step < 3 && (
          <NextButton
            onNext={handleNext}
            step={step}
            disabled={isNextDisabled || uploading}
          />
        )}
        {step === 3 && !showAssignmentComplete && (
          <NextButton
            onNext={handleGeneratePaymentQR}
            onAlternate={handleAlternatePayment}
            step={step}
            disabled={isNextDisabled || uploading}
            mode="assignment"
          />
        )}

        {step === 3 && showAssignmentComplete && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              padding: "0px",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/home/assignments")}
              sx={{
                bgcolor: "#002D72",
                color: "#fff",
                borderRadius: 2,
                width: "100vw",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": { bgcolor: "#001b52" },
              }}
            >
              Done
            </Button>

            {/* ✅ Location text below button */}
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                mb: 1,
                color: "gray",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              Hyderabad, Telangana
            </Typography>
          </Box>
        )}
      </Box>

      <PaymentModals
        qrModalOpen={qrModalOpen}
        setQrModalOpen={setQrModalOpen}
        qrImage={qrImage}
        qrLoading={qrLoading}
        paymentSuccessModal={paymentSuccessModal}
        paymentInfo={paymentInfo}
        cashReceivedModal={cashReceivedModal}
        totalDeposit={totalDeposit}
      />

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
    </>
  );
}
