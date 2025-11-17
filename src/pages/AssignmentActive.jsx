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
  Button,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { searchActiveAssignments } from "../api/assignmentService";
import { useNavigate } from "react-router-dom";

export default function AssignmentActive() {
  const PAGE_SIZE = 100;

  const [pageData, setPageData] = useState({ 1: [] });
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCount, setCurrentCount] = useState(0); // always from API
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const tableContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleViewDetails = (assignment) => {
    navigate(`/home/assignmentsactive/detail/${assignment.id}`);
  };

  const cleanSearchKey = (value) => value.replace(/\s+/g, "").trim();

  // Fetch assignments (search-aware)
  const fetchAssignments = async (page = 1, query = search) => {
    if (loading) return;
    setLoading(true);
    try {
      const pageToken = pageTokens[page] || "";
      const res = await searchActiveAssignments(query, pageToken);

      if (res?.assignments) {
        setPageData((prev) => ({ ...prev, [page]: res.assignments }));

        if (res.nextPageToken) {
          setPageTokens((prev) => ({ ...prev, [page + 1]: res.nextPageToken }));
        }

        // Always take totalCount from API response
        if (page === 1) {
          setCurrentCount(res.totalCount ?? res.assignments.length);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const cleaned = cleanSearchKey(value);
    setSearch(value);
    setPageData({ 1: [] });
    setPageTokens({ 1: null });
    setCurrentPage(1);

    fetchAssignments(1, cleaned); // fetch with search or empty string
  };

  const handleNext = () => {
    const nextPage = currentPage + 1;
    if (pageTokens[nextPage]) {
      setCurrentPage(nextPage);
      if (!pageData[nextPage]) fetchAssignments(nextPage, search);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      if (!pageData[prev]) fetchAssignments(prev, search);
    }
  };

  useEffect(() => {
    fetchAssignments(1, ""); // always use search API with empty string for default
  }, []);

  const paginatedRows = pageData[currentPage] || [];

  const formatDate = (timestamp) => {
    if (!timestamp?._seconds) return "—";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min((currentPage - 1) * PAGE_SIZE + paginatedRows.length, currentCount);

  return (
    <Box sx={{ backgroundColor: "#f4f6f8" }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Active Assignments</Typography>
          <Button
            onClick={() => navigate("/home/assignmentsactive/assignments")}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRadius: "6px",
              px: 2, py: "6px", fontSize: "14px", fontWeight: 500,
              textTransform: "none",
              "&:hover": { backgroundColor: "#115293" }
            }}
          >
            + Assign
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
          <TextField
            placeholder="Search by Vehicle ID or Plate Number"
            variant="outlined"
            size="small"
            sx={{ width: "50%" }}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>

        <TableContainer sx={{ maxHeight: "54vh", "& .MuiTableCell-root": { padding: 0 } }} ref={tableContainerRef}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>Plate Number</b></TableCell>
                <TableCell><b>Vehicle Model</b></TableCell>
                <TableCell><b>Rider Name</b></TableCell>
                <TableCell><b>Rider Phone</b></TableCell>
                <TableCell><b>Assignment Date</b></TableCell>
                <TableCell><b>Deposit Amount Paid</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>View</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((a, idx) => (
                <TableRow key={a.id || idx}>
                  <TableCell>{a.plateNumber || "—"}</TableCell>
                  <TableCell>{a.vehicleModel || "—"}</TableCell>
                  <TableCell>{a.riderName || "—"}</TableCell>
                  <TableCell>{a.riderPhone || "—"}</TableCell>
                  <TableCell>{formatDate(a.assignmentDate)}</TableCell>
                  <TableCell>{a.depositAmountPaid ?? "—"}</TableCell>
                  <TableCell>
                    <Chip label="Active" color="success" size="small" sx={{ fontWeight: "bold" }} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="text"
                      sx={{ color: "#1976d2" }}
                      onClick={() => handleViewDetails(a)}
                    >
                      View Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ddd", pt: 1, px: 2 }}>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Showing {start}–{end} of {currentCount} assignments
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
      </Paper>
    </Box>
  );
}
