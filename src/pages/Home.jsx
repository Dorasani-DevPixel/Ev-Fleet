import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavigationTabs from "./NavigationTabs";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Vehicles", path: "vehicles" },
    { label: "Assignments", path: "assignments" },
    { label: "Return EV", path: "return-ev" },
    { label: "Personnel", path: "personnel" },
  ];

  // Detect active tab from current path
  const activeTab = tabs.findIndex(tab =>
    location.pathname.includes(tab.path)
  );

  // Default route
  useEffect(() => {
    if (location.pathname === "/home") {
      navigate("/home/vehicles");
    }
  }, [location.pathname, navigate]);

  return (
    <Box sx={{  bgcolor: "#f9f9f9", Height: "100vh" }}>
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
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
