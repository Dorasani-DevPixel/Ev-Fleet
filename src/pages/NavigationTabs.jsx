import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography } from "@mui/material";

export default function NavigationTabs({ activeTab, onTabChange }) {
  const handleChange = (event, newValue) => {
    if (onTabChange) onTabChange(newValue);
  };

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
         
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        EV Fleet Management
      </Typography>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="navigation tabs"
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Vehicles" value={0} />
        <Tab label="Assignments" value={1} />
        <Tab label="Returns" value={2} />
        <Tab label="Personnel" value={3} />
      </Tabs>
    </Box>
  );
}
