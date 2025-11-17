import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  Card,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { addDeposit, createDepositNote } from "../api/assignmentService";

export default function DepositStatusReturn({
  isReturned,
  depositAmountPaid,
  depositAmount,
  returnedAmountProp,
  notesProp = [],
  assignmentId,
  phase = "deposit",
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newDeposit, setNewDeposit] = useState("");

  const [notes, setNotes] = useState(
    notesProp.length > 0
      ? notesProp
          .sort((a, b) => b.sequence - a.sequence)
          .map((n) => ({
            name: "Admin",
            text: n.content,
            date: n.createdDate || "-",
          }))
      : []
  );

  const [depositAmountPaidState, setDepositAmountPaid] = useState(depositAmountPaid);

  const handleAddDeposit = async () => {
    if (!newDeposit || Number(newDeposit) <= 0) return;

    try {
      // 1️⃣ Add deposit via API
      const res = await addDeposit(assignmentId, Number(newDeposit));
      console.log("✅ Deposit amount updated successfully:", res);

      // 2️⃣ Create a note for this deposit
      const note = await createDepositNote(
        assignmentId,
        `Added deposit amount ₹${newDeposit}`,
        "PAYMENT",
        phase
      );

      // 3️⃣ Update UI
      setDepositAmountPaid((prev) => prev + Number(newDeposit));
      setNotes((prev) => [
        {
          name: "Admin",
          text: `Added deposit amount ₹${newDeposit}`,
          date: new Date().toISOString(),
        },
        ...prev,
      ]);

      setNewDeposit("");
      setShowAdd(false);

    } catch (error) {
      console.error("❌ Failed to add deposit amount:", error);
      alert("Failed to add deposit amount. Please try again.");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, bgcolor: "#fff", border: "1px solid #eee" }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, fontSize: "16px" }}>
        Deposit Status
      </Typography>

      {/* Standard Deposit */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Standard Deposit
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          ₹{depositAmount}
        </Typography>
      </Box>

      {/* Deposit Amount Paid */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Deposit Amount Paid
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          ₹{depositAmountPaidState}
        </Typography>
      </Box>

      {/* Add Deposit Amount */}
    
    </Paper>
  );
}
