import React, { useState, useRef } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";

export default function PaymentPage({
  depositAmount,
  setDepositAmount,
  notes1,
  setNotes1,
  totalDeposit,
  setTotalDeposit,
}) {
  const [isEditable, setIsEditable] = useState(false);

  // 🧠 Ref for focusing input when clicking the edit icon
  const inputRef = useRef(null);

  const handleEnableEdit = () => {
    setIsEditable(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {/* ====== STANDARD DEPOSIT SECTION ====== */}
      <Box sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontSize: "14px", fontWeight: "700", mb: 0.5 }}
        >
          STANDARD DEPOSIT AMOUNT
        </Typography>

        <Typography
          variant="h6"
          sx={{ fontSize: "20px", fontWeight: "600", mb: 2 }}
        >
          ₹{depositAmount}
        </Typography>

        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "13px",
            mb: 1,
            textTransform: "uppercase",
          }}
        >
          Deposit Amount Paid
        </Typography>

        <TextField
          fullWidth
          inputRef={inputRef}
          variant="outlined"
          value={totalDeposit}
          onChange={(e) => setTotalDeposit(e.target.value)}
          onFocus={() => setIsEditable(true)}
          placeholder={`${depositAmount}`}
          InputProps={{
            readOnly: !isEditable,
            startAdornment: (
              <InputAdornment position="start">
                <Typography sx={{ color: "#9c9c9c", fontSize: "15px" }}>
                  ₹
                </Typography>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <EditOutlinedIcon
                  sx={{ color: "#000", cursor: "pointer" }}
                  onClick={handleEnableEdit}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              height: "48px",
              backgroundColor: "#fff",
              "& fieldset": { borderColor: "#d9d9d9" },
              "&:hover fieldset": { borderColor: "#bfbfbf" },
              "&.Mui-focused fieldset": { borderColor: "#000" },
            },
            "& .MuiInputBase-input": {
              fontSize: "15px",
            },
          }}
        />

        {/* ====== ADDITIONAL NOTES SECTION ====== */}
        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          Additional Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Enter notes here..."
          value={notes1}
          onChange={(e) => setNotes1(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>
    </Box>
  );
}
