import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import logoWhizzy from "../assets/logo-whizzy.png";
import { useNavigate } from "react-router-dom";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
export default function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const TOKEN = import.meta.env.VITE_API_SECRET_KEY;

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("Recaptcha verified");
          },
        }
      );
    }
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const checkResponse = await fetch(`${BASE_URL}/api/auth/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ phone }),
      });

      const checkData = await checkResponse.json();
      console.log("Check Data :", checkData);
      if (!checkData.success || !checkData.user || !checkData.user.id) {
        setError(
          "Please check the phone number and try again.If it’s correct but still not recognized, contact the admin for assistance."
        );
        return;
      }

      localStorage.setItem("userId", checkData.user.id);
      localStorage.setItem("userName", checkData.user.name);
      console.log("User ID stored:", checkData.user.id);
      console.log("User Name stored:", checkData.user.name);
      await setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = `+91${phone}`;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;

      setShowOtp(true);
      console.log("OTP sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to send OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await window.confirmationResult.confirm(code);
      const user = result.user;
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      navigate("/home");
    } catch (error) {
      console.error("OTP verification failed:", error);

      if (error.code === "auth/invalid-verification-code") {
        setError("Invalid OTP. Please check and try again.");
      } else if (error.code === "auth/session-expired") {
        setError("OTP expired. Please request a new one.");
        setShowOtp(false);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        overflow: "hidden",
        px: 2,
        m: 0,
        p: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          pt: 4,
          pb: 2,
          flexShrink: 0,
        }}
      >
        <img
          src={logoWhizzy}
          alt="Whizzy Logo"
          style={{
            maxWidth: "150px",
            width: "100%",
            height: "auto",
            marginBottom: "8px",
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            color: "#000",
          }}
        >
          Your Delivery Partner
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#777",
            fontSize: "0.8rem",
            mt: 0.3,
          }}
        >
          Version 1.0
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mt: 2,
            mb: 0.5,
            fontSize: { xs: "1.4rem", sm: "1.6rem" },
          }}
        >
          {showOtp ? "Enter OTP Code" : "Login"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
          }}
        >
          {showOtp
            ? `Enter the 6-digit code sent to +91 ${phone}`
            : "Login using your phone number"}
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "90%",
          maxWidth: 400,
          gap: 2,
          pb: 4,
          pt: "15px",
          overflowY: "auto",
          mx: "auto",
          mt: 4,
        }}
      >
        {!showOtp ? (
          <>
            <TextField
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              fullWidth
              variant="outlined"
              size="medium"
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
              error={!!error}
              helperText={error}
              inputProps={{
                maxLength: 10,
              }}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleSendOtp}
              disabled={loading}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
                py: 1.3,
                fontSize: "1rem",
              }}
            >
              {loading ? "Sending OTP..." : "Login"}
            </Button>
          </>
        ) : (
          <>
            {/* ✅ OTP Input Row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1.5,
                my: 2,
              }}
            >
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value.replace(/\D/g, ""), index)
                  }
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "1.2rem",
                      width: "40px",
                      height: "40px",
                      padding: 0,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      padding: 0,
                      "& input": { textAlign: "center" },
                    },
                  }}
                />
              ))}
            </Box>
            {error && (
              <Typography
                variant="body2"
                sx={{
                  color: "error.main",
                  textAlign: "center",
                  mb: 1,
                  fontWeight: "bold",
                }}
              >
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
                py: 1.3,
                fontSize: "1rem",
              }}
              onClick={handleVerifyOtp}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}
        <div id="recaptcha-container"></div>
      </Box>
    </Box>
  );
}
