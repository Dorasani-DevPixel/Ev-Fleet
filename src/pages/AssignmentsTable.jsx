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
} from "@mui/material";
import { fetchReturnedAssignments } from "../api/assignmentService";
import EVList from "./EVList"; // ✅ import this to render on Create
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return { color: "success", label: "Active" };
    case "Pending":
      return { color: "warning", label: "Pending" };
    case "Completed":
      return { color: "info", label: "Completed" };
    case "Cancelled":
      return { color: "error", label: "Cancelled" };
    default:
      return { color: "default", label: status || "N/A" };
  }
};

export default function AssignmentsTable() {
  const [pageData, setPageData] = useState({ 1: [] });
  const [loading, setLoading] = useState(false);
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const tableContainerRef = useRef(null);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const fetchAssignments = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const token = pageTokens[page] || null;
      const response = await fetchReturnedAssignments(token);
      const assignments = response?.data?.assignments || [];

      setPageData((prev) => ({ ...prev, [page]: assignments }));

      if (response.data?.nextPageToken) {
        setPageTokens((prev) => ({
          ...prev,
          [page + 1]: response.data.nextPageToken,
        }));
        setPageCount((prev) => Math.max(prev, page + 1));
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments(1);
  }, []);

  // ✅ Infinite scroll
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
        const nextPage = currentPage + 1;
        if (pageTokens[nextPage] && !pageData[nextPage]) {
          fetchAssignments(nextPage);
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
      fetchAssignments(value);
    }
  };

  const paginatedRows = pageData[currentPage] || [];

 

  return (
    <Box sx={{ backgroundColor: "#f4f6f8", Height: "100vh"}}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* ✅ Header with Title & Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
            onClick={() => navigate("/home/assignments/assignment")} // ✅ toggles view
          >
            Create Assignment
          </Button>
        </Box>

        {/* ✅ Table */}
        <TableContainer sx={{ maxHeight: "70vh" }} ref={tableContainerRef}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>Assignment ID</b></TableCell>
                <TableCell><b>Plate Number</b></TableCell>
                <TableCell><b>Vehicle Model</b></TableCell>
                <TableCell><b>Rider Name</b></TableCell>
                <TableCell><b>Rider Phone</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Return Date</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.map((row, idx) => {
                const status = getStatusColor("Active");
                return (
                  <TableRow key={row.id || idx}>
                    <TableCell>{row.id || "N/A"}</TableCell>
                    <TableCell>{row.plateNumber || "N/A"}</TableCell>
                    <TableCell>{row.vehicleModel || "N/A"}</TableCell>
                    <TableCell>{row.riderName || "N/A"}</TableCell>
                    <TableCell>{row.riderPhone || "N/A"}</TableCell>
                    <TableCell>
                      <Chip label={status.label} color={status.color} size="small" />
                    </TableCell>
                    <TableCell>{row.returnDate || "N/A"}</TableCell>
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

        {/* ✅ Pagination Controls */}
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
            Page {currentPage} of {pageCount} — showing {paginatedRows.length} assignments
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
                if (!pageData[val]) fetchAssignments(val);
              }}
              sx={{ width: 70 }}
              inputProps={{ min: 1, max: pageCount }}
            />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
