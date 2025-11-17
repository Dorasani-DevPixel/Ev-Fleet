import React, { useState, useEffect } from "react";
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
  Button,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import {
  fetchPersonnelDashboard,
  searchPersonnel,
  fetchUniquePositions,
} from "../api/personnelService";
import AddPersonnelModal from "../components/AddPersonnelModal";
import EditPersonnelModal from "../components/EditPersonnelModal";

// ✅ Status color helper
const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return { color: "success", label: "Active" };
    case "Inactive":
      return { color: "error", label: "Inactive" };
    case "On Leave":
      return { color: "warning", label: "On Leave" };
    default:
      return { color: "default", label: status || "N/A" };
  }
};

export default function PersonnelTable() {
  const PAGE_SIZE = 100;
  const [positions, setPositions] = useState([]);
  const [pageData, setPageData] = useState({ 1: [] });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalPersonnel, setTotalPersonnel] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const handleEditClick = (person) => {
    setSelectedPerson(person);
    setEditModalOpen(true);
  };

  // ✅ Fetch unique positions
  useEffect(() => {
    const getPositions = async () => {
      const data = await fetchUniquePositions();
      setPositions(data);
    };
    getPositions();
  }, []);

  // ✅ Fetch personnel data (first page or search)
  const fetchPersonnel = async (page = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      let response;

      // Search or filter applied
      if (searchQuery.trim() || (positionFilter && positionFilter !== "All")) {
        response = await searchPersonnel(searchQuery.trim(), positionFilter);
      } else {
        response = await searchPersonnel("", "")
      }

      const personnel = response?.personnel || [];
      setPageData({ [page]: personnel });

      // ✅ Update total personnel
      if (response?.totalCount !== undefined) {
        setTotalPersonnel(response.totalCount);
      }

      setPageCount(Math.ceil((response?.totalCount || personnel.length) / PAGE_SIZE));
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching personnel:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchPersonnel(1);
  }, []);

  // ✅ Search + Filter debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPersonnel(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, positionFilter]);

  const handlePersonnelUpdate = (updatedPerson) => {
    setPageData((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((page) => {
        newData[page] = newData[page].map((p) =>
          p.id === updatedPerson.id ? updatedPerson : p
        );
      });
      return newData;
    });
  };

  const handleNext = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= pageCount) {
      setCurrentPage(nextPage);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const paginatedRows = pageData[currentPage] || [];

  return (
    <Box sx={{ backgroundColor: "#f4f6f8" }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Personnel List</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              px: 2.5,
              "&:hover": { backgroundColor: "#1565c0" },
            }}
            onClick={handleOpenModal}
          >
            Add Personnel
          </Button>
        </Box>

        {/* Search + Filter */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search ID / Phone / Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 1000 }}
          />
          <TextField
            select
            size="small"
            label="Position"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            sx={{ width: 400 }}
          >
            <MenuItem value="All">All</MenuItem>
            {positions.map((pos) => (
              <MenuItem key={pos} value={pos}>{pos}</MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Table */}
        <TableContainer sx={{ height: "55vh", overflow: "auto" }}>
          <Table stickyHeader sx={{ "& th, & td": { whiteSpace: "normal" }, "& .MuiTableCell-root": { padding: 0 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Personnel Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Employment Status</TableCell>
                <TableCell>Supervisor ID</TableCell>
                <TableCell>Assignment Status</TableCell>
                <TableCell>Location</TableCell>
               
                <TableCell>Edit Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, idx) => {
                const employment = getStatusColor(row.employmentStatus);
                const assignment = getStatusColor(row.assignmentStatus);
                return (
                  <TableRow key={row.id || idx}>
                    <TableCell>{row.id || ""}</TableCell>
                    <TableCell>{row.name || "N/A"}</TableCell>
                    <TableCell>{row.phone || "N/A"}</TableCell>
                    <TableCell>{row.position || "N/A"}</TableCell>
                    <TableCell><Chip label={employment.label} color={employment.color} size="small" /></TableCell>
                    <TableCell>{row.supervisorId || "N/A"}</TableCell>
                    <TableCell><Chip label={assignment.label} color={assignment.color} size="small" /></TableCell>
                    <TableCell>{row.location || "N/A"}</TableCell>
                   
                    <TableCell>
                      <Button variant="text" onClick={() => handleEditClick(row)} sx={{ color: "#1976d2", textTransform: "none" }}>Edit</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </TableContainer>

        {/* Pagination Footer */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
          <Typography variant="body2" sx={{ color: "gray" }}>
            {`Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, totalPersonnel)} of ${totalPersonnel} personnel`}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button onClick={handlePrev} disabled={currentPage === 1} variant="outlined" sx={{ minWidth: "40px", padding: "5px" }}>
              <NavigateBeforeIcon />
            </Button>
            <Button onClick={handleNext} disabled={currentPage >= pageCount} variant="outlined" sx={{ minWidth: "40px", padding: "5px" }}>
              <NavigateNextIcon />
            </Button>
          </Box>
        </Box>

        {/* Modals */}
        <AddPersonnelModal open={openModal} onClose={handleCloseModal} />
        <EditPersonnelModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          personnel={selectedPerson}
          onUpdate={handlePersonnelUpdate}
        />
      </Paper>
    </Box>
  );
}
