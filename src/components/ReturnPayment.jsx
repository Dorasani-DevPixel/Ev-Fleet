import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";

export default function ReturnPayment({ amountPaid, setAmountPaid,notes,setNotes,depositAmount }) {
 

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        bgcolor: "white",
        borderRadius: 3,
        mt: 4,
        p: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Total Deposit: {depositAmount}
      </Typography>

      <TextField
        fullWidth
        type="number"
        label="Amount Returned"
        value={amountPaid}
        onChange={(e) => setAmountPaid(e.target.value)}
        sx={{
          mt: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 15,
          },
        }}
      />

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
        Additional Notes
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={2}
        placeholder="Enter notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
}
