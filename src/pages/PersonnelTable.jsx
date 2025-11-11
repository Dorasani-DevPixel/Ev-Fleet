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
  Button,
  Modal,
  MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchPersonnelDashboard,searchPersonnel } from "../api/personnelService"; // ✅ API call
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
  const [pageData, setPageData] = useState({ 1: [] });
  const [loading, setLoading] = useState(false);
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const tableContainerRef = useRef(null);
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
  // ✅ Fetch personnel data from API
  const fetchPersonnel = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const token = pageTokens[page] || null;
      const response = await fetchPersonnelDashboard(token);
      const personnel = response?.personnel || [];

      setPageData((prev) => ({ ...prev, [page]: personnel }));

      if (response.nextPageToken) {
        setPageTokens((prev) => ({
          ...prev,
          [page + 1]: response.nextPageToken,
        }));
        setPageCount((prev) => Math.max(prev, page + 1));
      }
    } catch (err) {
      console.error("Error fetching personnel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel(1);
  }, []);

  // ✅ Infinite scroll logic
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
        const nextPage = currentPage + 1;
        if (pageTokens[nextPage] && !pageData[nextPage]) {
          fetchPersonnel(nextPage);
          setCurrentPage(nextPage);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentPage, pageTokens, pageData, loading]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    if (!pageData[value]) {
      fetchPersonnel(value);
    }
  };

  const paginatedRows = pageData[currentPage] || [];

  return (
    <Box sx={{ backgroundColor: "#f4f6f8"}}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* ✅ Header Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Personnel List
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              px: 2.5,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            onClick={handleOpenModal}
          >
            Add Personnel
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
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
            <MenuItem value="Rider">Rider</MenuItem>
            <MenuItem value="Area Manager">Area Manager</MenuItem>
            <MenuItem value="City Head">City Head</MenuItem>
            <MenuItem value="Regional Leader">Regional Leader</MenuItem>
          
          </TextField>
        </Box>

        {/* ✅ Table Section */}
        <TableContainer
          sx={{
            height: "55vh",
            overflow: "auto",
            "&::-webkit-scrollbar": { height: 8, width: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: 2,
            },
          }}
          ref={tableContainerRef}
        >
          <Table
            stickyHeader
            sx={{
              "& th, & td": {
                textAlign: "left",
                padding: "10px 16px",
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              },
              "& th": { fontWeight: "bold" },
              "& td, & th": {
                width: "80px",
                height: "40px",
              },
            }}
          >
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
                <TableCell>Notes</TableCell>
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
                    <TableCell>
                      <Chip
                        label={employment.label}
                        color={employment.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.supervisorId || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={assignment.label}
                        color={assignment.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.location || "N/A"}</TableCell>
                    <TableCell>{row.notes || "—"}</TableCell>
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

        {/* ✅ Pagination Footer */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "gray" }}>
            Page {currentPage} of {pageCount} — showing {paginatedRows.length} personnel
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
            <Typography variant="body2" sx={{ color: "gray" }}>
              Go to:
            </Typography>
            <TextField
              size="small"
              type="number"
              value={currentPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= pageCount) setCurrentPage(val);
                if (!pageData[val]) fetchPersonnel(val);
              }}
              sx={{ width: 70 }}
              inputProps={{ min: 1, max: pageCount }}
            />
          </Stack>
        </Box>
   
                 <AddPersonnelModal open={openModal} onClose={handleCloseModal} />
                      <EditPersonnelModal
                   open={editModalOpen}
                   onClose={() => setEditModalOpen(false)}
                   personnel={selectedPerson}
                  
                 />
      </Paper>
    </Box>
  );
}
