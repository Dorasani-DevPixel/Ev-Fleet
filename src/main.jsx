import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { GlobalStyles } from "@mui/material";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import RiderAssignment from "./pages/RiderAssignment.jsx";
import ReturnEv from "./pages/ReturnEv.jsx";
import EVList from "./pages/EVList.jsx";
import VehicleTable from "./pages/VehicleTable.jsx";
import AssignmentsTable from "./pages/AssignmentsTable.jsx";
import ReturnEVList from "./pages/ReturnEVList.jsx";
import PersonnelTable from "./pages/PersonnelTable.jsx";
import AssignmentActive from "./pages/AssignmentActive.jsx";
import EVAssignmentDetailPage from "./pages/EVAssignmentDetailPage.jsx";
import EVReturnDetailPage from "./pages/EVReturnDetailPage.jsx";
import AssignmentsCompleted from "./pages/AssignmentsCompleted.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalStyles
        styles={{
          ":root": { fontFamily: '"Poppins", sans-serif' },
          "*": { fontFamily: '"Poppins", sans-serif !important' },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Home />} />

        {/* Parent route */}
        <Route path="/home" element={<Home />}>
          <Route path="vehicles" element={<VehicleTable />} />
          <Route path="assignmentsactive" element={<AssignmentActive />} />
          <Route
            path="assignmentscompleted"
            element={<AssignmentsCompleted />}
          />
          <Route path="assignmentsactive/assignments" element={<EVList />} />
          <Route
            path="assignmentscompleted/returns"
            element={<ReturnEVList />}
          />
          <Route
            path="assignmentsactive/detail/:id"
            element={<EVAssignmentDetailPage />}
          />

          <Route
            path="assignmentscompleted/detail/:id"
            element={<EVReturnDetailPage />}
          />

          <Route
            path="assignments/riderAssignment"
            element={<RiderAssignment />}
          />
          <Route path="returns/returnvehicle" element={<ReturnEv />} />
          <Route path="personnel" element={<PersonnelTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
