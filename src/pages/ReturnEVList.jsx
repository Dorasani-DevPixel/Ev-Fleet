import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../components/SearchBar";
import ReturnEVCard from "../components/ReturnEVCard";
import {
  fetchReturnedAssignments,
  fetchActiveCount,
  searchAssignments,
} from "../api/assignmentService";
import { CircularProgress, Box } from "@mui/material";
import "./ReturnEVList.css";
import { MdAppBlocking } from "react-icons/md";

export default function ReturnEVList() {
  const [search, setSearch] = useState("");
  const [evList, setEvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [searchCount, setSearchCount] = useState(null);
  const [searching, setSearching] = useState(false);

  const scrollContainerRef = useRef(null);

  const getAssignments = async (pageToken = null, append = false) => {
    try {
      const res = await fetchReturnedAssignments(pageToken);
      const data = res.data;
      const assignments = Array.isArray(data) ? data : data.assignments || [];

      const mapped = assignments.map((a) => ({
        id: a.id,
        plate: a.plateNumber,
        vehicleId: a.vehicleId,
        vehicleModel: a.vehicleModel,
        riderId: a.riderId,
        riderName: a.riderName,
        riderPhone: a.riderPhone,
        status: a.assignmentStatus,
        depositAmount: a.depositAmount,
      }));

      setNextPageToken(data.nextPageToken || null);

      setEvList((prev) => {
        const combined = append ? [...prev, ...mapped] : mapped;
        const unique = Array.from(
          new Map(combined.map((item) => [item.id, item])).values()
        );
        return unique;
      });
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getActiveCount = async () => {
    try {
      const res = await fetchActiveCount();
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error("Error fetching active count:", err);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    getAssignments();
    getActiveCount();
  }, []);

  // ✅ Infinite scroll for assignment list
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const bottomReached =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10;

      if (bottomReached && nextPageToken && !loadingMore) {
        setLoadingMore(true);
        getAssignments(nextPageToken, true);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, loadingMore]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!search.trim()) {
        setSearchCount(null);
        getAssignments();
        getActiveCount();
        return;
      }

      setSearching(true);
      try {
        const data = await searchAssignments(search.trim(), "Active");

        const assignments = Array.isArray(data) ? data : data.assignments || [];

        const mapped = assignments.map((a) => ({
          id: a.id,
          plate: a.plateNumber,
          vehicleId: a.vehicleId,
          vehicleModel: a.vehicleModel,
          riderId: a.riderId,
          riderName: a.riderName,
          riderPhone: a.riderPhone,
          status: a.assignmentStatus,
          depositAmount: a.depositAmount,
        }));

        setEvList(mapped);

        // ✅ Use totalCount from API response if available
        if (data.totalCount !== undefined) {
          setSearchCount(data.totalCount);
          console.log("Search result total count:", data.totalCount);
        } else {
          setSearchCount(mapped.length);
        }
      } catch (err) {
        console.error("Error searching:", err);
        setSearchCount(0);
      } finally {
        setSearching(false);
      }
    };

    const debounce = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(debounce);
  }, [search]);

  // ✅ Client-side filter (optional - can be kept for instant local filter)
  const filtered = evList.filter((ev) =>
    ev.plate?.toLowerCase().includes(search.toLowerCase())
  );

  console.log("Filtered EV list:", filtered);

  return (
    <div className="return-ev-list-page">
      {/* Header + Search bar */}
      <div className="return-sticky-search-section">
        <h3 className="return-searchbar-heading">
          <strong>Unlink EV From Rider</strong>
          <p className="return-ev-list-count">
            <strong>
              Count:{" "}
              {search.trim()
                ? searchCount !== null
                  ? searchCount
                  : "Loading..."
                : totalCount !== null
                ? totalCount
                : "Loading..."}
            </strong>
          </p>
        </h3>
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* EV Cards container */}
      <div
        className="return-ev-cards-scroll-container"
        ref={scrollContainerRef}
        style={{ overflowY: "auto", maxHeight: "80vh" }}
      >
        {/* Loader */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress />
          </Box>
        )}

        {/* Error message */}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {/* EV cards list */}
        <div
          className={`return-all-ev-cards ${
            filtered.length > 0 ? "has-cards" : ""
          }`}
        >
          {filtered.map((ev) => (
            <ReturnEVCard key={ev.id} ev={ev} />
          ))}
        </div>

        {/* Loading more (pagination) */}
        {loadingMore && (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </div>
    </div>
  );
}
