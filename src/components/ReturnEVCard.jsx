import React, { useState } from "react";
import "./ReturnEVCard.css";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import ConfirmModal from "./ConfirmModal";

export default function ReturnEVCard({ ev }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="returnCard">
      <div className="returnCard-left">
        <div className="returnCard-topRow">
          <span className="returnCard-plate">{ev.plate}</span>
          <span className="returnCard-model">{ev.vehicleModel}</span>
        </div>
        <p className="returnCard-rider">Rider: {ev.riderName}</p>
      </div>

      <button
        className="returnCard-removeBtn"
        onClick={() => setIsModalOpen(true)}
      >
        <MdPersonRemoveAlt1 className="returnCard-icon" size={18} />
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ev={ev}
      />
    </div>
  );
}
