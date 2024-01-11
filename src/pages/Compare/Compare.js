/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, put, post, postFiles } from "../../config/axios";
import { Button, Box, Modal, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI } from "../../helper/apiCallHelper";
import { useDebouncedValue } from "../../helper/debounce";
import { toastMessage } from "../../utils/toastMessage";
import FormModal from "../../components/Custom/FormModal/FormModal";
import {
  compareTableColumns,
  compareFormFields,
} from "../../constants/comparePage";
import styles from "./Compare.module.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(search, 2000);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  ///
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState({});

  const fetchUsers = async (searchValue) => {
    try {
      setLoading(true);
      const res = await get(
        `dashboard/visit/getAllVisit?page=${page}&limit=${10}&search=${searchValue}`
      );

      setUsers(
        res?.data.map((item) => ({
          ...item,
          action: { edit: false, delete: false },
        }))
      );
      setLoading(false);
      setPageCount(res?.totalPage);
    } catch (err) {
      console.error("Error:", err);
      setLoading(true);
    }
  };

  useEffect(() => {
    if (search === "") {
      fetchUsers("");
    } else if (debouncedSearch) {
      fetchUsers(debouncedSearch);
    }
  }, [search, debouncedSearch, message, page]);

  const handleEdit = (row) => {
    // Implement the edit action for the selected row
    openModal("edit", row);
  };

  const handleDelete = (row) => {
    setDeleteUser(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteUser = async (row) => {
    let url = `/api/app/user/updateUser?id=${row._id}`;
    let response = await deleteAPI(url);
    console.log("response", response);
    setDeleteModalOpen(false);
  };

  const handleStatus = (row) => {
    // Implement the status chnage for the selected row
    console.log("Delete clicked for row34:", row);
  };

  const handleActive = async (id, active) => {
    setLoading(true);
    let response = await put(
      `/api/dashboard/apputility/updateAppContent?id=${id}`,
      {
        active: active,
      }
    );
    setLoading(false);
    setMessage(response.message);
    toastMessage(response.message, "success");
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

  const closeModal = (type) => {
    if (type === "add") {
      setIsModalOpen(false);
    } else if (type === "edit") {
      setEditModal(false);
      setEditData({});
    }
  };

  const handleDisplay = (row) => {
    // Implement the edit action for the selected row
    console.log("Display", row);
    setViewData(row);
    setViewModal(true);
  };

  const handleSubmit = async (formData, isEditing, id) => {
    setLoading(true);
    try {
      if (isEditing) {
        let form = new FormData();
        form.append("file", formData?.assets);
        const res = await postFiles("/api/app/user/uploadImage", form);
        const { ...data } = formData;
        data.assets = res.data.url;
        let response = await put(
          `/api/dashboard/apputility/updateAppContent?id=${id}`,
          data
        );
        setMessage(response.message);
        toastMessage(response.message, "success");
      } else {
        formData = {
          ...formData,
          // category: `${category}`,
          type: "BLOGS",
        };
        let form = new FormData();
        form.append("file", formData?.assets);
        const res = await postFiles("/api/app/user/uploadImage", form);
        const { ...data } = formData;
        data.assets = res.data.url;
        await post("/api/dashboard/apputility/addAppContent", data);
        setMessage("Successfully added");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Error while processing the request");
      toastMessage("Error while updating", "error");
    }
    setLoading(false);
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Compare</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "40%" }}>
              <Searchbar
                search={handleSearch}
                placeholder={"Seach by name"}
                debounceTime={1000}
              />
            </div>
          </div>
          <CustomTable
            data={users}
            columns={compareTableColumns}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleStatus={handleStatus}
            handleDisplay={handleDisplay}
            handleActive={(row, active) => handleActive(row, active)}
            handlePageChange={(page) => handleChange(page)}
            pageNumber={page}
            pageCount={pageCount}
            loading={loading}
          />
        </div>
      </Layout>
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteUser}
        data={deleteUser}
      />
      <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={compareFormFields}
        header={editModal ? "Edit Blog" : "Add Blog"}
        initialData={editData}
        isEditing={editModal}
      />

      <Modal
        open={viewModal}
        onClose={() => {
          setViewModal(false);
          setViewData({});
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box className={styles.view_modal}>
          <Typography
            variant="h5"
            sx={{ p: 1 }}
            style={{ textAlign: "center" }}
          >
            Property Name
          </Typography>

          <Box
            style={{
              display: "flex",
              // justifyContent: "space-evenly",
              flexDirection: "column",
            }}
          >
            <table className={styles.view_table}>
              <thead className={styles.table_head}>
                <tr>
                  <th>Fields</th>
                  <th>Date</th>
                  <th>Date</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody className={styles.table_body}>
                <tr style={{ border: "1px solid black" }}>
                  <td>Title</td>
                  <td>{viewData?.title ? viewData?.title : "-"}</td>
                  <td>{viewData?.title ? viewData?.title : "-"}</td>
                  <td>{viewData?.title ? viewData?.title : "-"}</td>
                </tr>
                <tr style={{ border: "1px solid black" }}>
                  <td>Description</td>
                  <td>{viewData?.description ? viewData?.description : "-"}</td>
                  <td>{viewData?.description ? viewData?.description : "-"}</td>
                  <td>{viewData?.description ? viewData?.description : "-"}</td>
                </tr>
                <tr style={{ border: "1px solid black" }}>
                  <td>Image</td>
                  <td>
                    {viewData?.assets ? (
                      <div className={styles.image_container}>
                        <img
                          src={viewData?.assets}
                          alt={`Event`}
                          className={styles.image}
                        />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                <tr style={{ border: "1px solid black" }}>
                  <td>Author Name</td>
                  <td>{viewData?.authorName}</td>
                  <td>{viewData?.authorName}</td>
                  <td>{viewData?.authorName}</td>
                </tr>
                <tr style={{ border: "1px solid black" }}>
                  <td>Read Time</td>
                  <td>{viewData?.readTime}</td>
                </tr>
                <tr style={{ border: "1px solid black" }}>
                  <td>Publishing Date</td>
                  <td>{viewData?.createdAt}</td>
                  <td>{viewData?.createdAt}</td>
                  <td>{viewData?.createdAt}</td>
                </tr>
              </tbody>
            </table>
            <Button
              variant="contained"
              style={{ marginTop: "20px" }}
              onClick={() => {
                setViewModal(false);
                setViewData({});
              }}
            >
              close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Users;
