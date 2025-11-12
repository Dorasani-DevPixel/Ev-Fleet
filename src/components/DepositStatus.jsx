import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  Card,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import { createDepositNote,updateDepositDetails } from "../api/assignmentService";

export default function DepositStatus({
  isReturned,
  depositAmountProp,
  returnedAmountProp,
  notesProp = [],
  assignmentId,
  phase = "deposit",
}) {
  const [depositAmount, setDepositAmount] = useState(depositAmountProp || 0);
  const [editMode, setEditMode] = useState(false);

  const [returnedAmount] = useState(returnedAmountProp || 0);
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

  const [showAdd, setShowAdd] = useState(false);
  const [noteText, setNoteText] = useState("");

  const handleNewNote = async () => {
    if (noteText.trim() === "") return;
    try {
      const res = await createDepositNote(assignmentId, noteText, "payment", phase);
      console.log("🟢 Deposit note created successfully:", res);

      const newNote = {
        name: "Admin Name",
        text: noteText,
        date: new Date().toLocaleDateString("en-GB"),
      };

      setNotes((prev) => [newNote, ...prev]);
      setNoteText("");
      setShowAdd(false);
    } catch (error) {
      console.error("❌ Failed to create deposit note:", error);
      alert("Failed to save note. Please try again.");
    }
  };

  const handleSaveDeposit = async () => {
  console.log("💾 Saving new deposit amount:", depositAmount);

  try {
    const res = await updateDepositDetails(assignmentId, Number(depositAmount));
    console.log("✅ Deposit amount updated successfully:", res);

    alert("Deposit amount updated successfully!");
    setEditMode(false);
  } catch (error) {
    console.error("❌ Failed to update deposit amount:", error);
    alert("Failed to update deposit amount. Please try again.");
  }
};


  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: "#fff",
        border: "1px solid #eee",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 1, fontSize: "16px", color: "#000" }}
      >
        Deposit Status
      </Typography>

      {/* Deposit Amount */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          Deposit Amount
        </Typography>
        <IconButton
          onClick={() => setEditMode(!editMode)}
          size="small"
          color={editMode ? "error" : "primary"}
        >
          {editMode ? <CloseIcon sx={{ fontSize: 20 }} /> : <EditIcon sx={{ fontSize: 20 }} />}
        </IconButton>
      </Box>

      {editMode ? (
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <TextField
            size="small"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            sx={{ width: "120px", mr: 1 }}
          />
          <IconButton color="success" onClick={handleSaveDeposit}>
            <SaveIcon />
          </IconButton>
        </Box>
      ) : (
        <Typography variant="h6" sx={{ color: "#1E4C9A", mb: 1 }}>
          ₹{depositAmount}
        </Typography>
      )}

      {/* Deposit Returned */}
      {isReturned && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              Deposit Amount Returned
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: "#1E4C9A", mb: 2 }}>
            ₹{returnedAmount}
          </Typography>
        </>
      )}

      {/* Notes Section */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "gray", letterSpacing: 0.5 }}
          >
            NOTES
          </Typography>

          <IconButton onClick={() => setShowAdd(!showAdd)} size="small">
            {showAdd ? (
              <CloseIcon sx={{ fontSize: 20 }} />
            ) : (
              <AddIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Box>

        {showAdd && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add notes"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleNewNote}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {notes.map((note, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              p: 1.5,
              mb: 1.5,
              borderRadius: 2,
              mt: 2,
              backgroundColor: grey[200],
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {note.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "gray" }}>
                {note.date}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 0.5, color: "gray", fontSize: "0.85rem" }}
            >
              {note.text}
            </Typography>
          </Card>
        ))}
      </Box>
    </Paper>
  );
}
