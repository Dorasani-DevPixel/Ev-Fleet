import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  TextField,
  InputAdornment,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { grey } from "@mui/material/colors";
import { createDepositNote } from "../api/assignmentService";

export default function EVCondition({
  title = "EV Condition",
  beforePhotos = [],
  afterPhotos = [],
  showBefore = true,
  showAfter = true,
  notesProp = [],
  afterNotesProp = [],
  assignmentId
}) {
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [beforeNotes, setBeforeNotes] = useState([]);
  const [afterNotes, setAfterNotes] = useState([]);

  // if showBefore is false → use beforePhotos for afterPhotos
  afterPhotos = !showBefore ? beforePhotos : afterPhotos;

  // useEffect(() => {
  //   if (notesProp?.length) {
  //     const mappedNotes = notesProp.map((n) => ({
  //       name: "Admin",
  //       text: n.content,
  //       date: n.createdDate || "-",
  //     }));
  //     setBeforeNotes(mappedNotes);
  //   }
  //   if (afterNotesProp?.length) {
  //     const mappedAfter = afterNotesProp.map((n) => ({
  //       name: "Admin",
  //       text: n.content,
  //       date: n.createdDate || "-",
  //     }));
  //     setAfterNotes(mappedAfter);
  //   }
  // }, [notesProp,afterNotesProp]);

  useEffect(() => {
  const mappedBefore =
  notesProp
    ?.sort((a, b) => b.sequence - a.sequence) // 🆕 latest (highest sequence) first
    ?.map((n) => ({
      name: "Admin",
      text: n.content,
      date: n.createdDate || "-",
    })) || [];


  // ✅ only set when beforeNotes is empty (prevents overwriting new notes)
  if (mappedBefore.length && beforeNotes.length === 0) {
    setBeforeNotes(mappedBefore);
  }

  const mappedAfter =
    afterNotesProp
     ?.sort((a, b) => b.sequence - a.sequence)
     .map((n) => ({
      name: "Admin",
      text: n.content,
      date: n.createdDate || "-",
    })) || [];

  if (mappedAfter.length && afterNotes.length === 0) {
    setAfterNotes(mappedAfter);
  }
  }, [notesProp, afterNotesProp]);

  const [showBeforeAdd, setShowBeforeAdd] = useState(false);
  const [beforeNoteText, setBeforeNoteText] = useState("");


   const handleAddBeforeNote = async () => {
    if (beforeNoteText.trim() === "") return;

    const newNote = {
      name: "Admin Name",
      text: beforeNoteText,
      date: new Date().toLocaleDateString("en-GB"),
    };

    try {
      // 🔹 Send API call
      await createDepositNote(assignmentId, beforeNoteText, "image", "deposit");
      console.log("🟢 Before Image Note created successfully");

      // 🔹 Update UI immediately
      setBeforeNotes((prev) => [newNote, ...prev]);
      setBeforeNoteText("");
      setShowBeforeAdd(false);
    } catch (error) {
      console.error("❌ Failed to create image note:", error);
      alert("Failed to create image note. Please try again.");
    }
  };

  // ✅ Notes for After Photos
  // const [afterNotes, setAfterNotes] = useState(defaultAfterNotes);
  const [showAfterAdd, setShowAfterAdd] = useState(false);
  const [afterNoteText, setAfterNoteText] = useState("");

  const handleAddAfterNote = async () => {
    if (afterNoteText.trim() === "") return;

    const newNote = {
      name: "Admin Name",
      text: afterNoteText,
      date: new Date().toLocaleDateString("en-GB"),
    };

    try {
      // 🔹 Send API call with proper type & phase
      await createDepositNote(assignmentId, afterNoteText, "image", "return");
      console.log("🟣 After Image Note created successfully");

      // 🔹 Update UI immediately
      setAfterNotes((prev) => [newNote, ...prev]);
      setAfterNoteText("");
      setShowAfterAdd(false);
    } catch (error) {
      console.error("❌ Failed to create after image note:", error);
      alert("Failed to create after image note. Please try again.");
    }
  };


  return (
    <Box sx={{ px: 0.5 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, fontSize: "16px", mb: 2 }}
      >
        {title}
      </Typography>

      {/* BEFORE PHOTOS */}
      {showBefore && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            <strong>Before Photos</strong>
          </Typography>

          <Grid container spacing={1}>
            {beforePhotos.map((photo, index) => (
              <Grid item xs={4} key={`before-${index}`}>
                <Card
                  sx={{ borderRadius: 2, cursor: "pointer" }}
                  onClick={() => setPreviewPhoto(photo)}
                >
                  <CardMedia
                    component="img"
                    height="80"
                    image={photo}
                    alt={`before-${index}`}
                    sx={{ borderRadius: 2 }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Notes for Before Photos */}
          <Box sx={{ mt: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "gray",
                  letterSpacing: 0.5,
                }}
              >
                NOTES
              </Typography>

              <IconButton
                onClick={() => setShowBeforeAdd(!showBeforeAdd)}
                size="small"
              >
                {showBeforeAdd ? (
                  <CloseIcon sx={{ fontSize: 20 }} />
                ) : (
                  <AddIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Box>

            {showBeforeAdd && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add note for before photos"
                  value={beforeNoteText}
                  onChange={(e) => setBeforeNoteText(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleAddBeforeNote}>
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {beforeNotes.map((note, index) => (
              <Card
                key={`before-note-${index}`}
                variant="outlined"
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  borderRadius: 2,
                  mt: 1,
                  backgroundColor: grey[200],
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
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
        </Box>
      )}

      {/* AFTER PHOTOS */}
      {showAfter && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            {showBefore ? <strong>After Photos</strong> : <strong>Photos</strong>}
          </Typography>

          <Grid container spacing={1}>
            {afterPhotos.map((photo, index) => (
              <Grid item xs={4} key={`after-${index}`}>
                <Card
                  sx={{ borderRadius: 2, cursor: "pointer" }}
                  onClick={() => setPreviewPhoto(photo)}
                >
                  <CardMedia
                    component="img"
                    height="80"
                    image={photo}
                    alt={`after-${index}`}
                    sx={{ borderRadius: 2 }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Notes for After Photos */}
          <Box sx={{ mt: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "gray",
                  letterSpacing: 0.5,
                }}
              >
                NOTES
              </Typography>

              <IconButton
                onClick={() => setShowAfterAdd(!showAfterAdd)}
                size="small"
              >
                {showAfterAdd ? (
                  <CloseIcon sx={{ fontSize: 20 }} />
                ) : (
                  <AddIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Box>

            {showAfterAdd && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add note for after photos"
                  value={afterNoteText}
                  onChange={(e) => setAfterNoteText(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleAddAfterNote}>
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {afterNotes.map((note, index) => (
              <Card
                key={`after-note-${index}`}
                variant="outlined"
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  borderRadius: 2,
                  mt: 1,
                  backgroundColor: grey[200],
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
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
        </Box>
      )}

      {/* Fullscreen Preview Modal */}
      <Modal
        open={!!previewPhoto}
        onClose={() => setPreviewPhoto(null)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0,0,0,0.85)",
        }}
      >
        <Box sx={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }}>
          <img
            src={previewPhoto}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
          <IconButton
            onClick={() => setPreviewPhoto(null)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "#fff" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </Box>
  );
}
