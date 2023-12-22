import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, post, put } from "../../config/axios";
import { deleteAPI } from "../../helper/apiCallHelper";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { toastMessage } from "../../utils/toastMessage";
import FormModal from "../../components/Custom/FormModal/FormModal";
import { addonColumns, addonformFields } from "../../constants/addonPage";

const OfflineAddon = () => {
  const [addons, setAddons] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchEventCategories = async () => {
    await get(`/admin/dashboard/addon`)
      .then((res) => {
        let data = res?.data?.addons.filter((item) => item.type === "OFFLINE");
        setAddons(
          data?.map((item) => ({
            ...item,
            action: { edit: true, delete: true },
          }))
        );
        setMessage(res?.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  useEffect(() => {
    fetchEventCategories();
  }, [message]);

  const handleStatus = (row) => {
    console.log("Delete clicked for row34:", row);
  };

  const handleDelete = (row) => {
    setDeleteUser(row);
    setDeleteModalOpen(true);
  };

  const handleActive = async (id, active) => {
    let updateValue = {
      isActive: active,
    };
    let response = await put(`/admin/dashboard/addon/${id}`, updateValue);
    setMessage(response?.message);
    toastMessage(response?.message, "success");
  };

  const handleDeleteEventCategory = async (row) => {
    let url = `/admin/dashboard/addon/${row._id}`;
    let response = await deleteAPI(url);
    toastMessage(response, "success");
    setMessage(response);
    setDeleteModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const openModal = (type, dataForEdit) => {
    if (type === "add") {
      setIsModalOpen(true);
    } else if (type === "edit") {
      setEditModal(true);
      setEditData(dataForEdit);
    }
  };

  const closeModal = (type) => {
    if (type === "add") {
      setIsModalOpen(false);
    } else if (type === "edit") {
      setEditModal(false);
      setEditData({});
    }
  };

  const handleSubmit = async (formData, isEditing) => {
    formData.type = "OFFLINE";
    try {
      if (isEditing) {
        await put(`/admin/dashboard/addon/${editData._id}`, formData);

        setMessage("Successfully updated");
        setEditData({});
        setEditModal(false);
      } else {
        await post("/admin/dashboard/addon", formData);
        setMessage("Successfully added");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Error while processing the request");
    }
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Admin Add-On</Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "40%" }}></div>

            {/* <Button
              onClick={() => openModal("add")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold" }}
            >
              add points type
            </Button> */}
          </div>
          <CustomTable
            data={addons}
            columns={addonColumns}
            handleEdit={(row) => openModal("edit", row)}
            handleDelete={handleDelete}
            handleStatus={handleStatus}
            handleActive={(row, active) => handleActive(row, active)}
            pageNumber={1}
            pageCount={1}
            loading={loading}
          />
        </div>
      </Layout>
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteEventCategory}
        data={deleteUser}
      />
      <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={addonformFields}
        header={editModal ? "Edit Event Category" : "Add Event Category"}
        initialData={editData}
        isEditing={editModal}
      />
    </>
  );
};

export default OfflineAddon;
