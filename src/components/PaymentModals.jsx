// src/components/PaymentModals.jsx
import React from "react";
import { Box, Modal, Typography, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PaymentModals({
  qrModalOpen,
  setQrModalOpen,
  qrImage,
  qrLoading,
  paymentSuccessModal,
  paymentInfo,
  cashReceivedModal,
  totalDeposit,
}) {
  return (
    <>
      {/* --- QR LOADING OVERLAY --- */}
      {qrLoading && !qrModalOpen && (
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
            flexDirection: "column",
            zIndex: 2500,
          }}
        >
          <CircularProgress sx={{ color: "#002D72" }} />
          <Typography sx={{ mt: 2, color: "#002D72", fontWeight: 600 }}>
            Generating QR... please wait
          </Typography>
        </Box>
      )}

      {/* --- QR MODAL --- */}
      <Modal open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: 3,
            p: 2,
            width: "90vw",
            maxWidth: 360,
            maxHeight: "85vh",
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 24,
            position: "relative",
          }}
        >
          <CloseIcon
            onClick={() => setQrModalOpen(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
              color: "#555",
              "&:hover": { color: "black" },
              zIndex: 10,
            }}
          />
          <Box
            component="img"
            src={qrImage}
            alt="Payment QR"
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              objectFit: "contain",
              maxHeight: "100%",
            }}
          />
        </Box>
      </Modal>

      {/* --- PAYMENT SUCCESS MODAL --- */}
      <Modal open={paymentSuccessModal} onClose={() => {}}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: 3,
            p: 3,
            width: "90%",
            maxWidth: 400,
            textAlign: "center",
            boxShadow: 24,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: "3px solid #2ECC71",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "#2ECC71", fontSize: 36 }}>✓</Typography>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Transaction Successful
          </Typography>
          <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
            Received Payment of
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#002D72" }}>
            ₹{paymentInfo?.amount?.toFixed(2)}
          </Typography>
        </Box>
      </Modal>

      {/* --- CASH RECEIVED MODAL --- */}
      <Modal open={cashReceivedModal} onClose={() => {}}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: 3,
            p: 3,
            width: "90%",
            maxWidth: 400,
            textAlign: "center",
            boxShadow: 24,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: "3px solid #2ECC71",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "#2ECC71", fontSize: 36 }}>✓</Typography>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Cash Received
          </Typography>
          <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
            Received Payment of
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#002D72" }}>
            ₹{parseFloat(totalDeposit).toFixed(2)}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
