import React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const DeleteModal = ({ open, onClose, onDelete, data }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        lineHeight: "2rem",
      }}
    >
      <div
        style={{
          padding: 20,
          backgroundColor: "white",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Confirm Deletion</h2>
        <p style={{ fontWeight: "400", fontSize: "20px", marginTop: "1rem" }}>
          Are you sure you want to delete this item?
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "2rem",
          }}
        >
          <Button
            onClick={onClose}
            color="primary"
            variant="outlined"
            style={{ marginRight: 10 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onDelete(data)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
