import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { useNavigate, useLocation } from "react-router-dom";

export default function TopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Map routes to tab values
  const pathToValue = {
    "/personnel": "1",
    "/vehicles": "2",
    "/assignment": "3",
    "/returns": "4",
  };

  const valueToPath = {
    "1": "/personnel",
    "2": "/vehicles",
    "3": "/assignment",
    "4": "/returns",
  };

  const [value, setValue] = React.useState(
    pathToValue[location.pathname] || "1"
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(valueToPath[newValue]);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="desktop top navigation tabs"
            variant="fullWidth"
            centered
          >
            <Tab label="Personnel" value="1" sx={{ mx: 3, minWidth: 150 }} />
            <Tab label="Vehicles" value="2" sx={{ mx: 3, minWidth: 150 }} />
            <Tab label="Assignment" value="3" sx={{ mx: 3, minWidth: 150 }} />
            <Tab label="Returns" value="4" sx={{ mx: 3, minWidth: 150 }} />
          </TabList>
        </Box>
      </TabContext>
    </Box>
  );
}
