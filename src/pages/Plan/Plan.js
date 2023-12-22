import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, put } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI, updateAPI } from "../../helper/apiCallHelper";
import { toastMessage } from "../../utils/toastMessage";
import { useDebouncedValue } from "../../helper/debounce";
import { planFormFields, plantableColumns } from "../../constants/planPage";
import style from "./Plan.module.css";
import FormModal from "../../components/Custom/FormModal/FormModal";

export const Plan = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [message, setMessage] = useState("");
  const [viewData, setViewData] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const debouncedSearch = useDebouncedValue(search, 2000);

  const [visitsData, setVisitsData] = useState([]);

  const fetchVisits = async (searchValue) => {
    await get(`/dashboard/visit/getAllVisit?limit=10&page=1`)
      .then((res) => {
        console.log("res", res?.data);
        setVisitsData(
          res?.data.map((item) => ({
            ...item,
            action: { edit: true, delete: false },
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  useEffect(() => {
    if (search === "") {
      fetchVisits("");
    } else if (debouncedSearch) {
      fetchVisits(debouncedSearch);
    }
  }, [search, debouncedSearch, message, page]);

  const handleDisplay = (row) => {
    setViewData(row);
    setViewModal(true);
  };

  const handleDelete = (row) => {
    setDeleteUser(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteEvent = async (row) => {
    let url = `/vendors/event/remove/${row._id}`;
    let response = await deleteAPI(url);
    toastMessage(response, "success");
    setMessage(response);
    setDeleteModalOpen(false);
  };

  const handleStatus = (row) => {
    // Implement the status chnage for the selected row
    console.log("Delete clicked for row34:", row);
  };

  const handleActive = async (id, active, type) => {
    let updateValue = {};
    if (type === "published") {
      updateValue = {
        isPublished: active,
      };
    }
    if (type === "active") {
      updateValue = {
        isActive: active,
      };
    }
    let response = await updateAPI(
      `/admin/access-management/event-update/${id}`,
      updateValue
    );
    setMessage(response);
    toastMessage(response, "success");
  };

  const handleSearch = (searchText) => {
    setSearch(searchText);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleChange = (page) => {
    setPage(page);
  };

  const openModal = (type, dataForEdit) => {
    if (type === "add") {
      setIsModalOpen(true);
    } else if (type === "edit") {
      setEditModal(true);
      setEditData(dataForEdit);
    }
  };

  console.log("edit data", editData);

  const closeModal = (type) => {
    if (type === "add") {
      setIsModalOpen(false);
    } else if (type === "edit") {
      setEditModal(false);
      setEditData({});
    }
  };

  const handleSubmit = async (formData, isEditing) => {
    try {
      console.log("edit viists", formData, isEditing);
      await put(`/dashboard/visit/updateVisit?id=${formData._id}`, {
        dateOfVisit: `${formData?.dateOfVisit}T00:00:00.000Z`,
      });
    } catch (err) {
      console.error("Error:", err);
      setMessage("Error while processing the request");
    }
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Plan</Typography>
          <Searchbar
            search={handleSearch}
            placeholder={"Seach by email, employee id"}
            debounceTime={1000}
          />
          <CustomTable
            data={visitsData}
            columns={plantableColumns}
            handleEdit={(row) => openModal("edit", row)}
            handleDelete={handleDelete}
            handleStatus={handleStatus}
            handleDisplay={handleDisplay}
            handleActive={(row, active, type) =>
              handleActive(row, active, type)
            }
            handlePageChange={(page) => handleChange(page)}
            pageNumber={page}
            pageCount={pageCount}
            loading={loading}
          />
        </div>
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteEvent}
          data={deleteUser}
        />
      </Layout>
      <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={planFormFields}
        header={editModal ? "Edit Visit" : "Add Event Category"}
        initialData={editData}
        isEditing={editModal}
      />
    </>
  );
};
