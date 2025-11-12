import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../components/SearchBar";
import EVCard from "../components/EVCard";
import "./EVList.css";
import { Box, CircularProgress,IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
export default function EVList() {
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
   const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const TOKEN = import.meta.env.VITE_API_SECRET_KEY;

  const isFetchingRef = useRef(false);
  const debounceTimer = useRef(null);
  const activeRequestId = useRef(0); // 👈 track latest request version

  // ✅ Fetch all available EVs
  const fetchVehicles = async (pageToken = null, append = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const url = pageToken
        ? `${BASE_URL}/api/vehicles?status=Available&pageToken=${pageToken}`
        : `${BASE_URL}/api/vehicles?status=Available`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();

      setVehicles((prev) => {
        if (!append) return data.vehicles || [];
        const all = [...prev, ...(data.vehicles || [])];
        return Array.from(new Map(all.map((v) => [v.id, v])).values());
      });

      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load vehicle data");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ✅ Fetch count only for all EVs
  const fetchVehicleCount = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/vehicles/count?status=Available`,
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setTotalCount(data.vehicleCount || 0);
    } catch (err) {
      console.error("Error fetching vehicle count:", err);
    }
  };

  // ✅ Search with request version control
  const searchVehicles = async (query, pageToken = null, append = false) => {
    if (isFetchingRef.current) return;

    const currentRequestId = ++activeRequestId.current; // 🔹 new request version
    isFetchingRef.current = true;

    try {
      const url = pageToken
        ? `${BASE_URL}/api/vehicles/search?query=${encodeURIComponent(
            query
          )}&status=Available&pageToken=${pageToken}`
        : `${BASE_URL}/api/vehicles/search?query=${encodeURIComponent(
            query
          )}&status=Available`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      // ❗ Only update if this is the latest active request
      if (currentRequestId === activeRequestId.current) {
        setVehicles((prev) => {
          if (!append) return data.vehicles || [];
          const all = [...prev, ...(data.vehicles || [])];
          return Array.from(new Map(all.map((v) => [v.id, v])).values());
        });

        if (!append && data.totalCount !== undefined) {
          setTotalCount(data.totalCount);
        }

        setNextPageToken(data.nextPageToken || null);
      }
    } catch (err) {
      console.error("Error searching vehicles:", err);
      if (currentRequestId === activeRequestId.current) {
        setError("Search failed");
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchVehicleCount();
    fetchVehicles();
  }, []);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".ev-cards-scroll-container");
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 200 &&
        !loadingMore &&
        nextPageToken &&
        !isFetchingRef.current
      ) {
        setLoadingMore(true);
        if (search.trim()) {
          searchVehicles(search, nextPageToken, true);
        } else {
          fetchVehicles(nextPageToken, true);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, loadingMore, search]);

  // 🟢 Debounced search effect
  useEffect(() => {
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      // 🧩 Wait until initial load is complete
      if (loading && vehicles.length === 0) return;

      if (search.trim() === "") {
        setVehicles([]);
        setNextPageToken(null);
        fetchVehicleCount();
        fetchVehicles();
      } else {
        setVehicles([]);
        setNextPageToken(null);
        setLoading(true);
        searchVehicles(search);
      }
    }, 400);

    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  const filtered = vehicles.filter((ev) =>
    ev.plateNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ev-list-page">
   
      <div className="sticky-search-section">
        <div className="heading-row">
         <IconButton onClick={() => navigate("/home/assignmentsactive")} color="primary">
          <ArrowBackIcon />
        </IconButton>
          <h3 className="searchbar-heading">
           
            <strong> Link EV to Rider</strong>
          </h3>
          <p className="ev-list-count">
            <strong>Count: {totalCount}</strong>
          </p>
        </div>
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
          <CircularProgress />
        </Box>
      )}

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div className="ev-cards-scroll-container">
        <div
          className={`all-ev-cards ${filtered.length > 0 ? "has-cards" : ""}`}
        >
          {filtered.map((ev, i) => (
            <EVCard
              key={ev.id || i}
              ev={{
                id: ev.id,
                plate: ev.plateNumber,
                name: `${ev.type} ${ev.model}`,
                rent: ev.rentalRate,
                frequency: ev.rentalFrequency,
                deposit: ev.depositAmount,
                location: ev.location,
                status: ev.status,
              }}
            />
          ))}
        </div>

        {loadingMore && (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress size={28} />
          </Box>
        )}
      </div>
    </div>
  );
}
