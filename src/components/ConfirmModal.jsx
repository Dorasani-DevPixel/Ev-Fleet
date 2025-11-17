import React from "react";
import Modal from "react-modal";
import "./ConfirmModal.css";
import { FaMotorcycle } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";
Modal.setAppElement("#root");

export default function ConfirmAssignmentModal({ isOpen, onClose, ev }) {
  if (!ev) return null;
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="confirm-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        {/* Vehicle Info */}
        <div className="modal-row">
          <div className="icon-circle blue">
            <FaMotorcycle size={20} />
          </div>
          <div className="modal-info">
            <h3 className="modal-plate">{ev.plate}</h3>
            <p className="modal-model">{ev.vehicleModel}</p>
          </div>
        </div>

        {/* Rider Info */}
        <div className="modal-row">
          <div className="icon-circle lightblue">
            <MdPerson size={22} />
          </div>
          <div className="modal-info">
            <h3 className="rider-name">{ev.riderName}</h3>
            <p className="rider-phone">{ev.riderPhone}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="modal-actions">
          <button
            className="confirm-btn"
            onClick={() => {
              console.log("Assignment ID:", ev.id);
              navigate("/home/returns/returnvehicle", {
                state: {
                  assignmentId: ev.id,
                  vehicleId: ev.plate,
                  vehicleModel: ev.vehicleModel,
                  riderName: ev.riderName,
                  depositAmount: ev.depositAmount,
                },
              });
            }}
          >
            Confirm
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
