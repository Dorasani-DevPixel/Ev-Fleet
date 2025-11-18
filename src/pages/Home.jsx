import React, { useEffect } from "react";
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
  const user = location.state || {
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
  };
  // Detect active tab from path
  const activeTab = tabs.findIndex((tab) => location.pathname.includes(tab.path));

  // Redirect /home to first tab (Personnel)
  useEffect(() => {
    if (location.pathname === "/home") {
      navigate(`/home/${tabs[0].path}`, { replace: true });
    }
  }, [location.pathname, navigate, tabs]);

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
        activeTab={activeTab >= 0 ? activeTab : 0}
        onTabChange={(index) => navigate(`/home/${tabs[index].path}`)}
        user={user}
      />
      </Box>
  {/* Outlet content fills remaining space */}
  <Box sx={{ mt: 2}}>
        <Outlet />
      </Box>
    </Box>
  );
}
