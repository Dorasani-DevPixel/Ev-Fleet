import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  TextField,
  CircularProgress,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Button,
  IconButton,
} from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import {
  fetchVehicleDashboard,
  fetchVehicleFiltersMetadata,
  fetchVehicleStatusCount,
   fetchVehiclesWithFilters
} from "../api/vehicleService";

import AddVehicleModal from "../components/AddVehicleModal";
import EditVehicleModal from "../components/EditVehicleModal";

// ----------------------------------------------------------------------
// Status color helper
// ----------------------------------------------------------------------
const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return { color: "success", label: "Active" };
    case "Idle":
      return { color: "warning", label: "Idle" };
    case "Repair":
      return { color: "error", label: "Repair" };
    case "Deployment Pending":
      return { color: "info", label: "Deployment Pending" };
    case "Police Station":
      return { color: "secondary", label: "Police Station" };
    default:
      return { color: "default", label: status || "N/A" };
  }
};

export default function VehicleTable() {
  const PAGE_SIZE = 100;

  // ------------------ STATE ------------------
  const [pageData, setPageData] = useState({ 1: [] });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [totalCount, setTotalCount] = useState(0);

  const tableContainerRef = useRef(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  // Dropdowns
  const [statuses, setStatuses] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);

  // Modals
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // ------------------ MODAL HANDLERS ------------------
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditModalOpen(true);
  };

  const handleEditSave = (updatedVehicle) => {
    console.log("Updated Vehicle Data:", updatedVehicle);
  };

  // ------------------ DEBOUNCE SEARCH ------------------
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ------------------ FETCH FILTER METADATA ------------------
  const loadFilters = async () => {
    try {
      const res = await fetchVehicleFiltersMetadata();
      if (res) {
        setStatuses(res.statuses || []);
        setVendors(res.vendors || []);
        setLocations(res.locations || []);
      }
    } catch (error) {
      console.error("Error fetching filter metadata:", error);
    }
  };

  // ------------------ FETCH VEHICLES ------------------
 const fetchVehicles = async (page) => {
  if (loading) return;

  setLoading(true);
  try {
    const token = pageTokens[page] || "";

    const useFilterAPI =
      debouncedSearchTerm.trim().length >= 1 ||
      statusFilter !== "All" ||
      vendorFilter !== "All" ||
      locationFilter !== "All";

    // Always call the filter API
    const body = {
      vehicleNumber: debouncedSearchTerm.trim()
        ? debouncedSearchTerm.replace(/\s+/g, "")
        : "",
      status: statusFilter === "All" ? "" : statusFilter,
      vendorName: vendorFilter === "All" ? "" : vendorFilter,
      location: locationFilter === "All" ? "" : locationFilter,
      pageToken: token,
    };

    const response = await fetch("https://evbackend-vajk.onrender.com/api/vehicles/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer D8hL9H7s3RjP1qz0WzS8f9GhdsY1oP5J7V0yN3qS2E8",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.success) {
      setPageData((prev) => ({ ...prev, [page]: data.vehicles || [] }));
      setPageTokens((prev) => ({
        ...prev,
        [page + 1]: data.nextPageToken || null,
      }));
      // ✅ Update totalCount dynamically
      if (page === 1) setTotalCount(data.totalCount || data.vehicles.length);
    }
  } catch (err) {
    console.error("Error fetching vehicles:", err);
  } finally {
    setLoading(false);
  }
};


  // ------------------ INITIAL LOAD ------------------
  useEffect(() => {
    fetchVehicles(1);
    loadFilters();
  }, []);

  // ------------------ FETCH ON FILTER CHANGE ------------------
  useEffect(() => {
    setPageData({});
    setPageTokens({ 1: null });
    setCurrentPage(1);
    fetchVehicles(1);
  }, [debouncedSearchTerm, statusFilter, vendorFilter, locationFilter]);

  // ------------------ PAGINATION ------------------
  const handleNext = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (!pageData[nextPage]) fetchVehicles(nextPage);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      if (!pageData[prev]) fetchVehicles(prev);
    }
  };

  // ------------------ FILTER CURRENT PAGE ------------------
  const paginatedRows = (pageData[currentPage] || []).filter((row) => {
    const matchesSearch =
      row.plateNumber?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      row.vendorName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      row.location?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const matchesVendor = vendorFilter === "All" || row.vendorName === vendorFilter;
    const matchesLocation =
      locationFilter === "All" || row.location === locationFilter;

    return matchesSearch && matchesStatus && matchesVendor && matchesLocation;
  });

  // ------------------ UI ------------------
  return (
    <Box sx={{ backgroundColor: "#f4f6f8" }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>EV Fleet</Typography>
          <Button variant="contained" onClick={handleOpenModal}>+ Add Vehicle</Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2, flexWrap: "wrap", backgroundColor: "#fff", p: 1, borderRadius: 1 }}>
          <TextField size="small" placeholder="Search by Vehicle Number" variant="outlined" sx={{ width: 700 }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Vendor</InputLabel>
            <Select value={vendorFilter} label="Vendor" onChange={(e) => setVendorFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              {vendors.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Location</InputLabel>
            <Select value={locationFilter} label="Location" onChange={(e) => setLocationFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              {locations.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: "55vh", "& .MuiTableCell-root": { padding: 0 } }} ref={tableContainerRef}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>Vendor</b></TableCell>
                <TableCell><b>Vehicle Number</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Location</b></TableCell>
                <TableCell><b>Rental Rate</b></TableCell>
                <TableCell><b>Model</b></TableCell>
                <TableCell><b>Make</b></TableCell>
                <TableCell><b>Battery Type</b></TableCell>
                <TableCell><b>Edit</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, idx) => {
                const status = getStatusColor(row.status);
                return (
                  <TableRow key={row.id || idx}>
                    <TableCell>{row.vendorName || "N/A"}</TableCell>
                    <TableCell>{row.plateNumber || "N/A"}</TableCell>
                    <TableCell><Chip label={status.label} color={status.color} size="small" /></TableCell>
                    <TableCell>{row.location || "N/A"}</TableCell>
                    <TableCell>₹{row.rentalRatePerDay || 0}</TableCell>
                    <TableCell>{row.model || "N/A"}</TableCell>
                    <TableCell>{row.type || "N/A"}</TableCell>
                    <TableCell>{row.batteryType || "N/A"}</TableCell>
                    <TableCell><Button variant="text" sx={{ color: "#1976d2" }} onClick={() => handleEditClick(row)}>Edit</Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {loading && <Box sx={{ textAlign: "center", my: 2 }}><CircularProgress /></Box>}

        {/* Pagination */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ddd", pt: 1, px: 1 }}>
          <Typography variant="body2" sx={{ color: "gray" }}>
            {(() => {
              const start = (currentPage - 1) * PAGE_SIZE + 1;
              const end = Math.min(currentPage * PAGE_SIZE, totalCount);
              return `Showing ${start}–${end} of ${totalCount} vehicles`;
            })()}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handlePrev} disabled={currentPage === 1} sx={{ background: "#f2f2f2" }}>
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={handleNext} disabled={!pageTokens[currentPage + 1]} sx={{ background: "#f2f2f2" }}>
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Modals */}
        <AddVehicleModal open={openModal} onClose={handleCloseModal} />
        <EditVehicleModal open={editModalOpen} onClose={() => setEditModalOpen(false)} vehicle={selectedVehicle} onSave={handleEditSave} />
      </Paper>
    </Box>
  );
}
