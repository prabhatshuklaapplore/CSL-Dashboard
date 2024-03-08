import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Box, Button, Modal, Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, put } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI, updateAPI } from "../../helper/apiCallHelper";
import { toastMessage } from "../../utils/toastMessage";
import {
  eventsFormFields,
  indPerformancestableColumns,
} from "../../constants/individualPerformancePage";
import { useDebouncedValue } from "../../helper/debounce";
import FormModal from "../../components/Custom/FormModal/FormModal";

export const IndividualPerformance = () => {
  const [events, setEvents] = useState([]);
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

  const fetchEvents = async (searchValue) => {
    await get(
      `dashboard/visit/getAllVisit?search=${searchValue}&page=${page}&limit=${10}`
    )
      .then((res) => {
        console.log("res", res?.data);
        setEvents(
          res?.data.map((item) => ({
            ...item,
            action: { edit: true, delete: true },
          }))
        );
        setPageCount(res?.totalPage);
        setMessage(res?.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  useEffect(() => {
    if (search === "") {
      fetchEvents("");
    } else if (debouncedSearch) {
      fetchEvents(debouncedSearch);
    }
  }, [search, debouncedSearch, message, page]);

  // const handleEdit = (row) => {
  //   // Implement the edit action for the selected row
  //   console.log("Edit clicked for row 12:", row);
  // };

  const handleDisplay = (row) => {
    // Implement the edit action for the selected row
    console.log("Display", row);
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

  const handleSubmit = async (formData, isEditing) => {
    try {
      if (isEditing) {
        console.log("data", formData);
        debugger;
        await put(
          `/admin/access-management/event-update/${editData._id}`,
          formData
        );
        setMessage("Event Successfully updated");
        setEditData({});
        setEditModal(false);
      } else {
        // await post("/admin/dashboard/addon", formData);
        setMessage("Successfully added");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error:", err);
      // setMessage("Error while processing the request");
    }
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

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Individual Performance</Typography>
          <Searchbar
            search={handleSearch}
            placeholder={"Seach by employee id, property id"}
            debounceTime={1000}
          />
          <CustomTable
            data={events}
            columns={indPerformancestableColumns}
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
    </>
  );
};
