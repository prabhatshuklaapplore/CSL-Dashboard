import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Button, Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, post, put, postFiles } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI, updateAPI } from "../../helper/apiCallHelper";
import { toastMessage } from "../../utils/toastMessage";
import {
  featureformFields,
  teamstableColumns,
  bulkUploadFields,
} from "../../constants/teamPage";
import { useDebouncedValue } from "../../helper/debounce";
import FormModal from "../../components/Custom/FormModal/FormModal";
import AddIcon from "@mui/icons-material/Add";

export const Team = () => {
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
  const [isBulkUpload, setIsBulkUpload] = useState(false);
  const [editData, setEditData] = useState({});
  const debouncedSearch = useDebouncedValue(search, 2000);

  const fetchEvents = async (searchValue) => {
    await get(
      `/dashboard/dashUser/getAllAppUsers?page=${page}&limit=${10}&admin`
    )
      .then((res) => {
        console.log("res", res?.data);
        setEvents(
          res?.data.map((item) => ({
            ...item,
            action: { edit: true, delete: false },
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
    console.log("Delete clicked for row 34:", row);
  };

  const handleActive = async (id, active) => {
    let response = await put(`/dashboard/dashUser/updateAccount?id=${id}`, {
      active: active,
    });
    setMessage(`${active}-${response.message}`);
    toastMessage(response.message, "success");
  };

  const handleSubmit = async (formData, isEditing) => {
    console.log("Handle submit");
    try {
      if (isEditing) {
        console.log("data", formData);
        await put(
          `/dashboard/dashUser/updateAccount?id=${editData._id}`,
          formData
        );
        setMessage("Event Successfully updated");
        setEditData({});
        setEditModal(false);
      } else {
        console.log("data", formData);
        await post(`dashboard/dashUser/addAccount`, formData);
        console.log("Successfully added data");
        setMessage("Successfully added");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error:", err);
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
    } else if (type === "bulkUpload") {
      setIsBulkUpload(true);
    }
  };

  console.log("edit data", editData);

  const closeModal = (type) => {
    if (type === "add") {
      setIsModalOpen(false);
    } else if (type === "edit") {
      setEditModal(false);
      setEditData({});
    } else if (type === "bulkUpload") {
      setIsBulkUpload(false);
    }
  };

  const handleSwitch = (row) => {
    console.log("switch ", row);
  };

  const handleBulkUpload = async (formData) => {
    try {
      let form = new FormData();
      form.append("file", formData?.allTeamData);
      const res = await postFiles("/dashboard/dashUser/uploadFile", form);
      console.log(res);
      setMessage(res.message);
      toastMessage(res.message, "success");
    } catch (err) {
      console.error("Error:", err);
      setMessage("Error while processing the request");
      toastMessage("Error while updating", "error");
    }
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Team</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "70%" }}>
              <Searchbar
                search={handleSearch}
                placeholder={"Seach by email , employee id"}
                debounceTime={1000}
              />
            </div>

            <Button
              onClick={() => openModal("add")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold" }}
            >
              Add Member
            </Button>

            <Button
              onClick={() => openModal("bulkUpload")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold" }}
            >
              Bulk Upload
            </Button>
          </div>
          <CustomTable
            data={events}
            columns={teamstableColumns}
            // handleEdit={(row) => openModal("edit", row)}
            handleEdit={(row) => openModal("edit", row)}
            handleDelete={handleDelete}
            handleStatus={handleStatus}
            handleActive={(row, active) => handleActive(row, active)}
            handlePageChange={(page) => handleChange(page)}
            handleDisplay={handleDisplay}
            pageNumber={page}
            pageCount={pageCount}
            loading={loading}
          />
        </div>
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          data={deleteUser}
        />
      </Layout>
      <FormModal
        isOpen={isModalOpen || editModal || isBulkUpload}
        onClose={() =>
          closeModal(editModal ? "edit" : isBulkUpload ? "bulkUpload" : "add")
        }
        onSubmit={isBulkUpload ? handleBulkUpload : handleSubmit}
        fields={isBulkUpload ? bulkUploadFields : featureformFields}
        header={
          isBulkUpload
            ? "Bulk Upload"
            : editModal
            ? "Edit Member"
            : "Add Member"
        }
        initialData={editData}
        isEditing={editModal}
        isBulkUpload={isBulkUpload}
        link={
          "https://csl-assets-1.s3.ap-south-1.amazonaws.com/public/8ma6h8ma6hSample_Team+(2).xlsx"
        }
      />
    </>
  );
};
