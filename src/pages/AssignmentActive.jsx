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
import EditIcon from "@mui/icons-material/Edit";
import { fetchReturnedAssignments } from "../api/assignmentService";
import { useNavigate } from "react-router-dom";

export default function AssignmentActive() {
  const [pageData, setPageData] = useState({ 1: [] });
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const tableContainerRef = useRef(null);
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleEditClick = (assignment) => {
    setSelectedAssignment(assignment);
    setEditModalOpen(true);
  };

  const handleViewDetails = (assignment) => {
  navigate(`/home/assignmentsactive/detail/${assignment.id}`);
};


  const fetchAssignments = async (page = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      const token = pageTokens[page] || "";
      const res = await fetchReturnedAssignments(token);

      if (res?.data?.assignments) {
        const activeOnes = res.data.assignments.filter(
          (a) => a.status === "Active" || !a.status
        );

        setPageData((prev) => ({ ...prev, [page]: activeOnes }));
        if (res.data.nextPageToken) {
          setPageTokens((prev) => ({
            ...prev,
            [page + 1]: res.data.nextPageToken,
          }));
          setPageCount((prev) => Math.max(prev, page + 1));
        }
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
    if (!pageData[value]) fetchAssignments(value);
  };

  const handleAssignClick = () => {
    navigate("/home/assignmentsactive/assignments");
  };

  const paginatedRows = pageData[currentPage] || [];

  const formatDate = (timestamp) => {
    if (!timestamp?._seconds) return "—";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ backgroundColor: "#f4f6f8" }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Active Assignments
          </Typography>

          <Button
            onClick={handleAssignClick}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRadius: "8px",
              px: 2,
              py: 1,
              width: 150,
              fontSize: "20px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#115293" },
            }}
          >
            + Assign
          </Button>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: "60vh" }} ref={tableContainerRef}>
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
                  {/* ✅ Edit moved to first column */}
               

                  <TableCell>{a.plateNumber || "—"}</TableCell>
                  <TableCell>{a.vehicleModel || "—"}</TableCell>
                  <TableCell>{a.riderName || "—"}</TableCell>
                  <TableCell>{a.riderPhone || "—"}</TableCell>
                  <TableCell>{formatDate(a.assignmentDate)}</TableCell>
                  <TableCell>{a.depositAmountPaid ?? "—"}</TableCell>
                  <TableCell>
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          borderRadius: "6px",
                          color: "#1976d2",
                          borderColor: "#1976d2",
                          fontWeight: 500,
                          "&:hover": {
                            backgroundColor: "#1976d2",
                            color: "#fff",
                          },
                        }}
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

        {/* Pagination Footer */}
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
            <Typography variant="body2" sx={{ color: "gray" }}>Go to:</Typography>
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
