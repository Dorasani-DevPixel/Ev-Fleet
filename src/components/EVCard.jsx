import React from "react";
import "./EVCard.css";
import { MdPersonAddAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function EVCard({ ev }) {
  const navigate = useNavigate();
  const handleAssign = (vehicle) => {
    localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));
    navigate("/home/assignments/riderAssignment");
  };
  return (
    <div className="evCard">
      <div className="evCard-left">
        <h3 className="evCard-plate">{ev.plate}</h3>
        <p className="evCard-model">{ev.name}</p>
      </div>

      <div className="evCard-right">
        <div className="evCard-pricing">
          <p className="evCard-rent">
            Rent: ₹{ev.rent}
            {ev.frequency ? ` (${ev.frequency})` : ""}
          </p>
          <p className="evCard-deposit">Deposit: ₹{ev.deposit}</p>
        </div>

        <button
          type="button"
          className="evCard-assignBtn"
          onClick={() => handleAssign(ev)}
        >
          <MdPersonAddAlt
            className="evCard-icon"
            size={20}
            style={{ fill: "#1e4c9a" }}
          />
        </button>
      </div>
    </div>
  );
}
