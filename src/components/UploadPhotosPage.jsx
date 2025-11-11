import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  TextField,
  Avatar,
  Modal,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

function UploadPhotosPage({ photos, setPhotos, onPhotoCountChange,setNotes2,notes2 }) {
  
  const [previewPhoto, setPreviewPhoto] = useState(null); 

  useEffect(() => {
    onPhotoCountChange(photos.length);
  }, [photos, onPhotoCountChange]);

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file: file,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleRemove = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        pt: "10px",
        pb: "20px",
      }}
    >
      <Box sx={{ px: { xs: 2, sm: 4 } }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Click Photos of the EV
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, mt: 0.5 }}
        >
          Make sure the rider is present during this step
        </Typography>

      
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Cover all angles as per{" "}
            <Typography
              component="span"
              sx={{ color: "primary.main", cursor: "pointer" }}
            >
              guide
            </Typography>
          </Typography>

      
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: photos.length < 3 ? "error.main" : "success.main",
            }}
          >
            {photos.length} 
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={4} sm={3}>
            <Box
              component="label"
              sx={{
                width: 120,
                height: { xs: 120, sm: 140 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #bbb",
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: "#fafafa",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "#f0f0f0",
                },
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleAddPhoto}
               
              />
              <AddCircleOutlineIcon sx={{ fontSize: 48, color: "#1976d2" }} />
            </Box>
          </Grid>

          {photos.map((photo, index) => (
            <Grid item xs={4} sm={3} key={index}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 120, sm: 140 },
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onClick={() => setPreviewPhoto(photo.url)} // 👈 Open full view
              >
                <Avatar
                  variant="square"
                  src={photo.url}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleRemove(index);
                  }}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "#fff" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          Additional Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Enter notes here..."
          value={notes2}
          onChange={(e) => setNotes2(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
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
}

export default UploadPhotosPage;
