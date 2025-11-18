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
  Typography,
  CircularProgress,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useNavigate } from "react-router-dom";

import {
  fetchCompletedAssignments,
} from "../api/returnService";
import { searchCompletedAssignments } from "../api/assignmentService";
import { fetchCompleteCount } from "../api/assignmentService";

export default function AssignmentsCompleted() {
  const PAGE_SIZE = 100;

  const [pageData, setPageData] = useState({ 1: [] });
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0); // search-aware count
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const tableContainerRef = useRef(null);
  const navigate = useNavigate();

  const cleanSearchKey = (val) => val.replace(/\s+/g, "").trim();

  /** FETCH TOTAL COUNT */
  const getTotalCount = async () => {
    try {
      const data = await fetchCompleteCount();
      if (data?.totalCount !== undefined) {
        setTotalCount(data.totalCount);
        setCurrentCount(data.totalCount);
      }
    } catch (err) {
      console.error("Error fetching total count:", err);
    }
  };

  /** NORMAL PAGINATION FETCH */
  const loadCompletedAssignments = async (page = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const token = pageTokens[page] || "";
      const response = await fetchCompletedAssignments(token);
      const data = response.data;

      if (data?.assignments) {
        setPageData((prev) => ({ ...prev, [page]: data.assignments }));
        if (data.nextPageToken)
          setPageTokens((prev) => ({ ...prev, [page + 1]: data.nextPageToken }));
        // Update count
        if (page === 1) setCurrentCount(data.totalCount || data.assignments.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /** SEARCH API */
  const fetchSearchResults = async (page = 1, query = search) => {
    if (loading) return;
    setLoading(true);
    try {
      const token = pageTokens[page] || "";
      const res = await searchCompletedAssignments(query, token);
      if (res?.assignments) {
        setPageData((prev) => ({ ...prev, [page]: res.assignments }));
        if (res.nextPageToken)
          setPageTokens((prev) => ({ ...prev, [page + 1]: res.nextPageToken }));
        // Update count for search results
        if (page === 1) setCurrentCount(res.totalCount || res.assignments.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    const cleaned = cleanSearchKey(value);

    setPageData({ 1: [] });
    setPageTokens({ 1: null });
    setCurrentPage(1);

    if (!cleaned) {
      setIsSearching(false);
      loadCompletedAssignments(1);
      return;
    }

    setIsSearching(true);
    fetchSearchResults(1, cleaned);
  };

  const handleNext = () => {
    const nextPage = currentPage + 1;
    if (pageTokens[nextPage]) {
      setCurrentPage(nextPage);
      if (!pageData[nextPage]) {
        if (isSearching) fetchSearchResults(nextPage);
        else loadCompletedAssignments(nextPage);
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      if (!pageData[prev]) {
        if (isSearching) fetchSearchResults(prev);
        else loadCompletedAssignments(prev);
      }
    }
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

  const handleViewDetails = (assignment) => {
    navigate(`/home/assignmentscompleted/detail/${assignment.id}`);
  };

  const handleReturnNavigation = () => {
    navigate("/home/assignmentscompleted/returns");
  };

  useEffect(() => {
    loadCompletedAssignments(1);
    getTotalCount();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f4f6f8" }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* HEADER */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Completed Assignments</Typography>
          <Button
            onClick={handleReturnNavigation}
            sx={{ backgroundColor: "#1976d2", color: "#fff", borderRadius: "6px", px: 2, py: "6px", fontSize: "14px", fontWeight: 500, textTransform: "none", "&:hover": { backgroundColor: "#115293" } }} >
         
            + Return
          </Button>
        </Box>

        {/* SEARCH BAR */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
          <TextField
            placeholder="Search by Vehicle / Rider"
            variant="outlined"
            size="small"
            sx={{ width: "50%" }}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>

        {/* TABLE */}
        <TableContainer sx={{ maxHeight: "54vh", "& .MuiTableCell-root": { padding: 1 } }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>Plate Number</b></TableCell>
                <TableCell><b>Vehicle Model</b></TableCell>
                <TableCell><b>Rider Name</b></TableCell>
                <TableCell><b>Rider Phone</b></TableCell>
                <TableCell><b>Assignment Date</b></TableCell>
                <TableCell><b>Deposit Paid</b></TableCell>
                <TableCell><b>Deposit Returned</b></TableCell>
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
                  <TableCell>{a.depositAmountReturned ?? "—"}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="text"
                      sx={{ color: "#1976d2",textTransform: "none", minWidth: 70  }}
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

        {/* PAGINATION FOOTER */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
          <Typography variant="body2" sx={{ color: "gray" }}>
            {(() => {
              const start = (currentPage - 1) * PAGE_SIZE + 1;
              const end = Math.min(currentPage * PAGE_SIZE, currentCount);
              return `Showing ${start}–${end} of ${currentCount} assignments`;
            })()}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
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
