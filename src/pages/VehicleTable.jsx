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
  Pagination,
  Stack,
  TextField,
  CircularProgress,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
   Modal,Button,IconButton,
} from "@mui/material";
import { fetchVehicleDashboard, fetchVehicleFiltersMetadata } from "../api/vehicleService";
import CloseIcon from "@mui/icons-material/Close";
import AddVehicleModal from "../components/AddVehicleModal";
import EditVehicleModal from "../components/EditVehicleModal";

// ✅ Status color helper
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
  const [pageData, setPageData] = useState({ 1: [] });
  const [loading, setLoading] = useState(false);
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const tableContainerRef = useRef(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  // Dropdown data
  const [statuses, setStatuses] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
   const [newVehicle, setNewVehicle] = useState({
    vendor: "",
    vehicleName: "",
    location: "",
    rent: "",
    make: "",
    variant: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const handleEditClick = (vehicle) => {
  setSelectedVehicle(vehicle);
  setEditModalOpen(true);
  };
  const handleEditSave = (updatedVehicle) => {
  console.log("Updated Vehicle Data:", updatedVehicle);
  // 🧠 Here you can later call your PUT/PATCH API to update in backend
};
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
  // Load dropdown metadata
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

  // Fetch vehicles (decide between dashboard or filter API)
  const fetchVehicles = async (page) => {
    if (loading) return;
    setLoading(true);

    try {
      const token = pageTokens[page] || "";

      // ✅ Use filter API if search >=3 chars or any filter applied
      const useFilterAPI =
        searchTerm.trim().length >= 3 ||
        statusFilter !== "All" ||
        vendorFilter !== "All" ||
        locationFilter !== "All";

      if (useFilterAPI) {
        const body = {
          vehicleNumber:
            searchTerm.trim().length >= 3
              ? searchTerm.replace(/\s+/g, "")
              : "",
          status: statusFilter === "All" ? "" : statusFilter,
          vendorName: vendorFilter === "All" ? "" : vendorFilter,
          location: locationFilter === "All" ? "" : locationFilter,
          pageToken: token,
        };

        const response = await fetch(
          "https://evbackend-vajk.onrender.com/api/vehicles/filter",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer D8hL9H7s3RjP1qz0WzS8f9GhdsY1oP5J7V0yN3qS2E8",
            },
            body: JSON.stringify(body),
          }
        );

        const data = await response.json();
        if (data.success) {
          setPageData((prev) => ({ ...prev, [page]: data.vehicles || [] }));
          setPageTokens((prev) => ({
            ...prev,
            [page + 1]: data.nextPageToken || null,
          }));
          setPageCount((prev) => Math.max(prev, page + 1));
        }
      } else {
        // Existing dashboard API
        const response = await fetchVehicleDashboard(token);
        const vehicles = response?.vehicles || [];
        setPageData((prev) => ({ ...prev, [page]: vehicles }));

        if (response.nextPageToken) {
          setPageTokens((prev) => ({
            ...prev,
            [page + 1]: response.nextPageToken,
          }));
          setPageCount((prev) => Math.max(prev, page + 1));
        }
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run on mount
  useEffect(() => {
    fetchVehicles(1);
    loadFilters();
  }, []);

  // ✅ Trigger API whenever search or filters change
  useEffect(() => {
    // reset first page on filter change
    setPageData({});
    setPageTokens({ 1: null });
    setCurrentPage(1);

    const useFilterAPI =
      searchTerm.trim().length >= 3 ||
      statusFilter !== "All" ||
      vendorFilter !== "All" ||
      locationFilter !== "All";

    if (useFilterAPI || searchTerm === "") {
      fetchVehicles(1);
    }
  }, [searchTerm, statusFilter, vendorFilter, locationFilter]);

  // Infinite scroll
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
        const nextPage = currentPage + 1;
        if (pageTokens[nextPage] && !pageData[nextPage]) {
          fetchVehicles(nextPage);
          setCurrentPage(nextPage);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentPage, pageTokens, pageData, loading]);

  // Pagination
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    if (!pageData[value]) {
      fetchVehicles(value);
    }
  };

  // Local filter for current page
  const paginatedRows = (pageData[currentPage] || []).filter((row) => {
    const matchesSearch =
      row.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const matchesVendor = vendorFilter === "All" || row.vendorName === vendorFilter;
    const matchesLocation = locationFilter === "All" || row.location === locationFilter;

    return matchesSearch && matchesStatus && matchesVendor && matchesLocation;
  });

  return (
    <Box sx={{ backgroundColor: "#f4f6f8" }}>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* Search and Filter Bar */}
        {/* Header Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            EV Fleet
          </Typography>
          <Box>
            <button
              style={{
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
              }}
               onClick={handleOpenModal}
            >
              + Add Vehicle
            </button>
          </Box>
        </Box>
          


        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 2,
            flexWrap: "wrap",
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 2,
            p: 1,
            borderRadius: 1,
          }}
        >
        
          <TextField
            size="small"
            placeholder="Search by Vehicle Number"
            variant="outlined"
            sx={{ width: 700 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Vendor</InputLabel>
            <Select
              value={vendorFilter}
              label="Vendor"
              onChange={(e) => setVendorFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {vendors.map((vendor) => (
                <MenuItem key={vendor} value={vendor}>
                  {vendor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={locationFilter}
              label="Location"
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Vehicle Table */}
        <TableContainer sx={{ maxHeight: "55vh" }} ref={tableContainerRef}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "12%", pr: 1 }}><b>Vendor</b></TableCell>
                <TableCell><b>Vehicle Number</b></TableCell>
                <TableCell sx={{ width: "8%" }}><b>Status</b></TableCell>
                <TableCell><b>Location</b></TableCell>
                <TableCell><b>Rental Rate (₹/day)</b></TableCell>
                <TableCell><b>Model</b></TableCell>
                <TableCell><b>Make</b></TableCell>
                <TableCell><b>Battery Type</b></TableCell>
                <TableCell><b>Edit Data</b></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, idx) => {
                const status = getStatusColor(row.status);
                return (
                  <TableRow key={row.id || idx}>
                    <TableCell sx={{ pr: 1 }}>{row.vendorName || "N/A"}</TableCell>
                    <TableCell>{row.plateNumber || "N/A"}</TableCell>
                    <TableCell>
                      <Chip label={status.label} color={status.color} size="small" />
                    </TableCell>
                    <TableCell>{row.location || "N/A"}</TableCell>
                    <TableCell>₹{row.rentalRatePerDay || 0}</TableCell>
                    <TableCell>{row.model || "N/A"}</TableCell>
                    <TableCell>{row.type || "N/A"}</TableCell>
                    <TableCell>{row.batteryType || "N/A"}</TableCell>
                    <TableCell>
                    <Button
                      variant="text"
                      onClick={() => handleEditClick(row)}
                      sx={{ color: "#1976d2", textTransform: "none" }}
                    >
                      Edit
                    </Button>
                  </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Pagination */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Page {currentPage} of {pageCount} — showing {paginatedRows.length} vehicles
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              color="primary"
            />
            <Typography variant="body2" sx={{ color: "gray" }}>Go to:</Typography>
            <TextField
              size="small"
              type="number"
              value={currentPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= pageCount) setCurrentPage(val);
                if (!pageData[val]) fetchVehicles(val);
              }}
              sx={{ width: 70 }}
              inputProps={{ min: 1, max: pageCount }}
            />
          </Stack>
        </Box>
        <AddVehicleModal  open={openModal} onClose={handleCloseModal} />
        <EditVehicleModal
  open={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  vehicle={selectedVehicle}
  onSave={handleEditSave}
/>

      </Paper>
    </Box>
  );
}
