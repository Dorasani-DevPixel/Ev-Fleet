import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, CircularProgress } from "@mui/material";
import AssignmentHeader from "../components/AssignmentHeader";
import EVCondition from "../components/EVCondition";
import RiderDetails from "../components/RiderDetails";
import DepositStatus from "../components/DepositStatus";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAssignmentDetails } from "../api/assignmentService";
import { useParams } from "react-router-dom";
export default function EVReturnDetailPage() {
  const [step, setStep] = useState(1);
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos, setAfterPhotos] = useState([]);
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [beforeImageNotes, setBeforeImageNotes] = useState([]);
  const [afterImageNotes, setAfterImageNotes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) {
          console.warn("Missing assignment ID:");
          setLoading(false);
          return;
        }

        console.log("Fetching return details for ID:", id);
        const data = await fetchAssignmentDetails(id);

        const assignment = data?.assignment || data;
        setAssignmentData(assignment);

        const beforeImageNotes =
          assignment?.notes
            ?.filter(
              (note) => note.type === "image" && note.phase === "deposit"
            )
            ?.sort((a, b) => a.sequence - b.sequence) || [];

        const afterImageNotes =
          assignment?.notes
            ?.filter((note) => note.type === "image" && note.phase === "return")
            ?.sort((a, b) => a.sequence - b.sequence) || [];

        setBeforeImageNotes(beforeImageNotes);
        setAfterImageNotes(afterImageNotes);
        const before =
          assignment?.transactionImages
            ?.filter((img) => img.type === "deposit")
            ?.map((img) => img.url) || [];

        const after =
          assignment?.transactionImages
            ?.filter((img) => img.type === "return")
            ?.map((img) => img.url) || [];

        setBeforePhotos(before);
        setAfterPhotos(after);
      } catch (error) {
        console.error("Error fetching assignment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleNavigate = (page) => {
    if (page === "home") navigate("/Home");
    else navigate(`/Home/${page}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!assignmentData) {
    return (
      <Box textAlign="center" mt={10}>
        ¯ No return assignment details found.
      </Box>
    );
  }

  // ✅ filter only return notes
  // const depositNotes =
  //   assignmentData?.notes?.filter((note) => note.type === "return") || [];

  const depositNotes =
    assignmentData?.notes
      ?.filter((note) => note.type === "payment")
      ?.sort((a, b) => a.sequence - b.sequence) || [];

  const beforeImages =
    assignmentData?.transactionImages
      ?.filter((img) => img.type === "deposit")
      ?.map((img) => img.url) || [];

  const afterImages =
    assignmentData?.transactionImages
      ?.filter((img) => img.type === "return")
      ?.map((img) => img.url) || [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f9f9f9",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pb: 10,
        }}
      >
        <AssignmentHeader
          vehicleNumber={assignmentData?.plateNumber || "N/A"}
          vehicleName={assignmentData?.vehicleModel || "Unknown"}
          vehicleImage="/images/vehicle.jpg"
          rent={assignmentData?.rent || "N/A"}
          deposit={assignmentData?.depositAmount || "N/A"}
          step={step}
          setStep={setStep}
          Personicon="1"
        />

        <RiderDetails
          riderName={assignmentData?.riderName || "N/A"}
          riderNumber={assignmentData?.riderPhone || "N/A"}
          assignmentDate={
            assignmentData?.assignmentDate
              ? new Date(assignmentData.assignmentDate).toLocaleDateString(
                  "en-IN"
                )
              : "N/A"
          }
          returnDate={
            assignmentData?.returnDate
              ? new Date(assignmentData.returnDate).toLocaleDateString("en-IN")
              : "N/A"
          }
          showReturnDate={true}
        />

        <Box sx={{ mt: 1 }}>
          <DepositStatus
            isReturned={true}
            depositAmountProp={assignmentData?.depositAmount}
            returnedAmountProp={assignmentData?.depositAmountReturned}
            assignmentId={assignmentData?.id}
            notesProp={depositNotes}
            phase="return"
          />
        </Box>

        <Card
          sx={{
            mt: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            bgcolor: "#fff",
          }}
        >
          <CardContent>
            <EVCondition
              beforePhotos={beforePhotos}
              afterPhotos={afterPhotos}
              assignmentId={assignmentData?.id}
              setBeforePhotos={setBeforePhotos}
              setAfterPhotos={setAfterPhotos}
              showBefore={true}
              showAfter={true}
              notesProp={beforeImageNotes}
              afterNotesProp={afterImageNotes}
            />
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "#fff",
          boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
          zIndex: 100,
        }}
      ></Box>
    </Box>
  );
}
