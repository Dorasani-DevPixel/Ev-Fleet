import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavigationTabs from "./NavigationTabs";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tabs should match NavigationTabs order
  const tabs = [
    { label: "Personnel", path: "personnel" },
    { label: "EV Vehicles", path: "vehicles" },
    { label: "EV Assignment", path: "assignmentsactive" },
    { label: "EV Returns", path: "assignmentscompleted" },
  ];

  const [activeTab, setActiveTab] = useState(0);

  const user = location.state || {
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
  };

  // Detect active tab from URL
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/home/personnel")) {
      setActiveTab(0);
    } 
    else if (path.includes("/home/vehicles")) {
      setActiveTab(1);
    } 
    else if (path.includes("/home/assignmentsactive")) {
      setActiveTab(2);
    }
    else if (path.includes("/home/assignmentscompleted")) {
      setActiveTab(3);
    }

    // ⭐ Special rule: If inside riderAssignment → keep Assignment Tab active
    if (path.includes("riderAssignment")) {
      setActiveTab(2);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ bgcolor: "#f9f9f9" }}>
      {/* Sticky Navigation */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "white",
          zIndex: 1100,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={(index) => navigate(`/home/${tabs[index].path}`)}
          user={user}
        />
      </Box>

      {/* Page Content */}
      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
