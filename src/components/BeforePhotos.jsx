import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Modal,
  IconButton,
  Card,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchAssignmentImages } from "../api/imageService";

const BeforePhotos = ({ assignmentId,notes1,setNotes1,beforePhotos,setBeforePhotos }) => {
  
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");


  useEffect(() => {
    const getPhotos = async () => {
      try {
        const data = await fetchAssignmentImages(assignmentId, "deposit");
        console.log("📸 API Response:", data);
        setBeforePhotos(data.images || []);
      } catch (error) {
        console.error("❌ Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    if (assignmentId) getPhotos();
  }, [assignmentId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading images...
        </Typography>
      </Box>
    );
  }

  // ✅ Get formatted timestamp
  const formattedDate =
    beforePhotos.length > 0
      ? new Date(beforePhotos[0].timestamp).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "N/A";

  return (
    <Box
      sx={{
        maxWidth: 700,
        p: 2,
        borderRadius: 3,
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Before Photos
        </Typography>
        <Typography sx={{ color: "gray", fontSize: 14,mt:0.5 }}>
          {formattedDate}
        </Typography>
      </Box>

      <Typography sx={{ color: "gray", fontSize: 12, mb: 2 }}>
        Compare EV condition with photos taken during assignment
      </Typography>

     
      {beforePhotos.length === 0 ? (
        <Typography sx={{ color: "gray", textAlign: "center", mt: 2 }}>
          No photos available for this assignment.
        </Typography>
      ) : (
        <Grid container spacing={1}>
          {beforePhotos.map((photo, i) => (
            <Grid item xs={4} key={photo.id || i}>
              <Card
                sx={{
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.03)" },
                }}
                onClick={() => setPreviewPhoto(photo.url)}
              >
                <CardMedia
                  component="img"
                  height="80"
                  image={photo.url}
                  alt={`before-${i}`}
                  sx={{ borderRadius: 2 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

    
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 500, mb: 1 }}>
          Additional Notes
         
        </Typography>
        <TextField
          placeholder="Enter notes..."
          fullWidth
          variant="outlined"
          multiline
          minRows={2}
          value={notes1}
          onChange={(e) => setNotes1(e.target.value)}
        />
      </Box>

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
            alt="Full preview"
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
};

export default BeforePhotos;
