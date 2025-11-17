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

export default function ReturnEVList() {
  const [search, setSearch] = useState("");
  const [evList, setEvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [searchCount, setSearchCount] = useState(null);

  const scrollContainerRef = useRef(null);

  const isFetchingRef = useRef(false);
  const debounceTimer = useRef(null);
  const activeRequestId = useRef(0);

  const getAssignments = async (pageToken = null, append = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

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
        const all = append ? [...prev, ...mapped] : mapped;
        return Array.from(new Map(all.map((v) => [v.id, v])).values());
      });
    } catch (err) {
      setError(err.message);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getActiveCount = async () => {
    try {
      const res = await fetchActiveCount();
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const doSearchAssignments = async (
    query,
    pageToken = null,
    append = false
  ) => {
    if (isFetchingRef.current) return;

    const reqId = ++activeRequestId.current;
    isFetchingRef.current = true;

    try {
      const data = await searchAssignments(query, "Active", pageToken);

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

      if (reqId === activeRequestId.current) {
        setEvList((prev) => {
          if (!append) return mapped;

          const all = [...prev, ...mapped];
          return Array.from(new Map(all.map((v) => [v.id, v])).values());
        });

        if (!append && data.totalCount !== undefined) {
          setSearchCount(data.totalCount);
        }
        setNextPageToken(data.nextPageToken || null);
      }
    } catch (err) {
      if (reqId === activeRequestId.current) setSearchCount(0);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getAssignments();
    getActiveCount();
  }, []);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const bottomReached =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50;

      if (
        bottomReached &&
        nextPageToken &&
        !loadingMore &&
        !isFetchingRef.current
      ) {
        setLoadingMore(true);

        if (search.trim()) {
          doSearchAssignments(search.trim(), nextPageToken, true);
        } else {
          getAssignments(nextPageToken, true);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, loadingMore, search]);

  useEffect(() => {
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const query = search.trim();
      setEvList([]);
      setNextPageToken(null);

      if (query === "") {
        setSearchCount(null);
        getAssignments();
        getActiveCount();
      } else {
        setLoading(true);
        doSearchAssignments(query);
      }
    }, 500);

    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  return (
    <div className="return-ev-list-page">
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

      <div
        ref={scrollContainerRef}
        className="return-ev-cards-scroll-container"
        style={{ overflowY: "auto", maxHeight: "80vh" }}
      >
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress />
          </Box>
        )}

        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        <div
          className={`return-all-ev-cards ${
            evList.length > 0 ? "has-cards" : ""
          }`}
        >
          {evList.map((ev) => (
            <ReturnEVCard key={ev.id} ev={ev} />
          ))}
        </div>

        {loadingMore && (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </div>
    </div>
  );
}
