import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Modal,
  Button,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

export default function Search({
  setRiderConfirmed,
  selectedRow,
  setSelectedRow,
  goToNextStep,
}) {
  const [query, setQuery] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);
  const [riders, setRiders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMinCharMessage, setShowMinCharMessage] = useState(false);
  const [error, setError] = useState("");
  const [status] = useState("Available");
  const isFetchingRef = useRef(false);
  const debounceTimer = useRef(null); // ⏱ debounce timer

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const TOKEN = import.meta.env.VITE_API_SECRET_KEY;

  const fetchRiders = async (searchKey = "", pageToken = null) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      let url = `${BASE_URL}/api/riders/search?status=${status}`;
      if (searchKey) url += `&query=${encodeURIComponent(searchKey)}`;
      if (pageToken) url += `&pageToken=${pageToken}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      setRiders((prev) => {
        const all = pageToken
          ? [...prev, ...(data.riders || [])]
          : data.riders || [];
        const unique = Array.from(new Map(all.map((r) => [r.id, r])).values());
        return unique;
      });

      setTotalCount(data.totalCount || 0);
      setNextPageToken(data.nextPageToken || null);
      setError("");
    } catch (err) {
      console.error("Error fetching riders:", err);
      setError("Failed to fetch riders");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  const [assignedRider, setAssignedRider] = useState(
    selectedRow?.rider || null
  );
  useEffect(() => {
    if (selectedRow?.rider) setAssignedRider(selectedRow.rider);
  }, [selectedRow]);

  // ✅ Debounced query typing logic
  useEffect(() => {
    clearTimeout(debounceTimer.current);

    const trimmedQuery = query.trim();

    debounceTimer.current = setTimeout(() => {
      if (trimmedQuery.length === 0) {
        setRiders([]);
        setTotalCount(0);
        setNextPageToken(null);
        setShowMinCharMessage(false);
        return;
      }

      if (trimmedQuery.length < 3) {
        setShowMinCharMessage(true);
        setRiders([]);
        setTotalCount(0);
        setNextPageToken(null);
        return;
      }

      setShowMinCharMessage(false);
      setRiders([]);
      setNextPageToken(null);
      fetchRiders(trimmedQuery);
    }, 400); // waits 400ms after user stops typing

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  // ✅ Infinite scroll listener
  useEffect(() => {
    const scroller = document.querySelector(
      '[data-scroll-root="assignment-body"]'
    );
    if (!scroller) return;

    const handleScroll = () => {
      const nearBottom =
        scroller.scrollHeight - scroller.scrollTop <=
        scroller.clientHeight + 100;
      if (nearBottom && nextPageToken && !isFetchingRef.current) {
        fetchRiders(query, nextPageToken);
      }
    };

    scroller.addEventListener("scroll", handleScroll);
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, query]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
       

      }}
    >
      {/* 🔒 Sticky Search Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          bgcolor: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          borderBottom: "1px solid #eee",
          backdropFilter: "blur(4px)",
        }}
      >
        <Box
          sx={{
            width: { xs: "94%", sm: "96%", md: "98%", lg: "80%" },
            mx: "auto",
            pt: 1.5,
            pb: 1,
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            sx={{ fontWeight: "bold", textAlign: "left", width: "100%" }}
          >
            Search Rider
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by ID, name or phone number"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              bgcolor: "#fff",
              borderRadius: "30px",
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#888" }} />
                </InputAdornment>
              ),
            }}
          />

          {showMinCharMessage && (
            <Typography
              variant="body2"
              sx={{
                color: "red",
                width: "100%",
                textAlign: "left",
                mt: 0.5,
                ml: 1,
              }}
            >
              Enter at least 3 characters to search
            </Typography>
          )}

          {query && !showMinCharMessage && (
            <Typography
              variant="subtitle2"
              sx={{
                width: "100%",
                textAlign: "left",
                color: "text.secondary",
                mt: 1,
                fontWeight: 500,
              }}
            >
              {totalCount} Result{totalCount !== 1 ? "s" : ""} for “{query}”
            </Typography>
          )}
        </Box>
      </Box>

      {/* ✅ Assigned Rider */}
      {assignedRider && (
        <Paper
          elevation={3}
          sx={{
            width: { xs: "94%", sm: "96%", md: "98%", lg: "80%" },
            p: 1,
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#f0f7ff",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#1976d2" }}>
              {assignedRider.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>
                {assignedRider.name}
              </Typography>
              <Typography color="text.secondary">
                ID: {assignedRider.id || assignedRider.riderId}
              </Typography>
              <Typography color="text.secondary">
                +91 {assignedRider.phone}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            color="error"
            variant="outlined"
            sx={{ borderRadius: 2 }}
            onClick={() => {
              setAssignedRider(null);
              setSelectedRow((prev) => ({ ...prev, rider: null }));
              setRiderConfirmed(false);
            }}
          >
            Remove
          </Button>
        </Paper>
      )}

      {/* ✅ Rider List */}
      {!assignedRider && query && (
        <Box
          sx={{
            width: { xs: "94%", sm: "96%", md: "98%", lg: "80%" },
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            mt: 1.5,
            pb: 4,
          }}
        >
          {error && (
            <Typography sx={{ color: "red", textAlign: "center", mt: 1 }}>
              {error}
            </Typography>
          )}

          {riders.length > 0
            ? riders.map((rider, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 3,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    "&:hover": {
                      bgcolor: "#f9f9f9",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "#1976d2" }}>
                      {rider.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>
                        {rider.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {rider.id}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    color="primary"
                    onClick={() => setSelectedRider(rider)}
                  >
                    <PersonAddAltIcon />
                  </IconButton>
                </Paper>
              ))
            : !loading &&
              !error && (
                <Typography sx={{ color: "gray", textAlign: "center", mt: 2 }}>
                  No results found
                </Typography>
              )}

          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={2}
            >
              <CircularProgress size={28} />
            </Box>
          )}
        </Box>
      )}

      {/* ✅ Confirm Modal */}
      <Modal open={!!selectedRider}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: 3,
            width: "85%",
            maxWidth: 400,
            p: 3,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {selectedRider && (
            <>
              <Avatar
                sx={{
                  bgcolor: "#1976d2",
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  fontSize: 30,
                }}
              >
                {selectedRider.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {selectedRider.name} (
                {selectedRider.id || selectedRider.riderId})
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                +91 {selectedRider.phone}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: "#1976d2",
                  borderRadius: 2,
                  mb: 1.5,
                  "&:hover": { bgcolor: "#115293" },
                }}
                onClick={() => {
                  setRiderConfirmed(true);
                  setSelectedRow((prev) => ({
                    ...prev,
                    rider: selectedRider,
                  }));
                  setAssignedRider(selectedRider);
                  localStorage.setItem(
                    "selectedRider",
                    JSON.stringify(selectedRider)
                  );
                  goToNextStep();
                }}
              >
                Confirm
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{ borderRadius: 2 }}
                onClick={() => setSelectedRider(null)}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
