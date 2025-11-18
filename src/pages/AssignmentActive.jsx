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
import { useNavigate } from "react-router-dom";
import { searchActiveAssignments } from "../api/assignmentService";

export default function AssignmentActive() {
  const PAGE_SIZE = 100;
  const navigate = useNavigate();

  const [pageData, setPageData] = useState({ 1: [] });
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCount, setCurrentCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const tableContainerRef = useRef(null);

  // ------------------ FETCH ASSIGNMENTS ------------------
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
        if (page === 1) setCurrentCount(res.totalCount ?? res.assignments.length);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ SEARCH HANDLER ------------------
  const handleSearch = (value) => {
    setSearch(value);
    setPageData({ 1: [] });
    setPageTokens({ 1: null });
    setCurrentPage(1);
    fetchAssignments(1, value.trim());
  };

  // ------------------ PAGINATION ------------------
  const handleNext = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (!pageData[nextPage]) fetchAssignments(nextPage, search);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      if (!pageData[prev]) fetchAssignments(prev, search);
    }
  };

  // ------------------ INITIAL LOAD ------------------
  useEffect(() => {
    fetchAssignments(1, "");
  }, []);

  // ------------------ FORMAT DATE ------------------
  const formatDate = (timestamp) => {
    if (!timestamp?._seconds) return "—";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min((currentPage - 1) * PAGE_SIZE + (pageData[currentPage]?.length || 0), currentCount);

  const paginatedRows = pageData[currentPage] || [];

  // ------------------ VIEW DETAIL ------------------
  const handleViewDetails = (assignment) => {
    navigate(`/home/assignmentsactive/detail/${assignment.id}`);
  };

  return (
    <Box sx={{ backgroundColor: "#f4f6f8", p: 1 }}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Active Assignments</Typography>
          <Button onClick={() => navigate("/home/assignmentsactive/assignments")} 
          sx={{ backgroundColor: "#1976d2", color: "#fff", borderRadius: "6px", px: 2, py: "6px", fontSize: "14px", fontWeight: 500, textTransform: "none", "&:hover": { backgroundColor: "#115293" } }} >
           + Assign </Button>
        </Box>

        {/* Search */}
        <Box sx={{ display: "flex", mb: 2 }}>
          <TextField
            placeholder="Search by Vehicle ID or Plate Number"
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: "55vh", "& .MuiTableCell-root": { padding: 0.5 } }} ref={tableContainerRef}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Plate Number", "Vehicle Model", "Rider Name", "Rider Phone", "Assignment Date", "Deposit Paid", "Status", "View"].map((col) => (
                  <TableCell key={col} sx={{ width: "12.5%" }}><b>{col}</b></TableCell>
                ))}
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
                      sx={{ color: "#1976d2", textTransform: "none", minWidth: 70 }}
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

        {/* Pagination */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ddd", pt: 1, px: 1 }}>
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
