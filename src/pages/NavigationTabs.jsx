import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography, Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
export default function NavigationTabs({ activeTab, onTabChange, user }) {
  const handleChange = (event, newValue) => {
    if (onTabChange) onTabChange(newValue);
  };
   const navigate = useNavigate();
   const handleLogout = async () => {
  try {
    // 🔥 Firebase logout (kills session)
    await signOut(auth);
    console.log("Firebase session cleared");

    // 🗑 Clear stored user data
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("authToken");

    // 🔄 Redirect to login
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Error while logging out:", error);
  }
};
  return (
    <Box sx={{ width: "100%", mb: 2, borderBottom: "1px solid #e0e0e0" }}>
      {/* Header container */}
      <Box sx={{ position: "relative", display: "flex", alignItems: "center", mb: 2 }}>
        {/* Title centered */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          EV Fleet Dashboard
        </Typography>

        {/* Right side: Avatar + Logout */}
        <Box sx={{ marginLeft: "75%", display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid #ccc",
              borderRadius: 2,
              px: 2,
              py: 0.5,
              width:200,
              backgroundColor: "#fff",
            }}
          >
             <Avatar sx={{ width: 32, height: 32 }}>
                {user.userName ? user.userName[0].toUpperCase() : "U"}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user.userName || "User"}({user.userId})
                </Typography>
             
              </Box>
          </Box>

          <Button variant="outlined" color="secondary" size="small"  onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="navigation tabs"
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Personnel" value={0} />
        <Tab label="EV Vehicles" value={1} />
        <Tab label="EV Assignment" value={2} />
        <Tab label="EV Returns" value={3} />
      </Tabs>
    </Box>
  );
}
