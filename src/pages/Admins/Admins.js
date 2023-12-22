/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Button, Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, patch, post } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import FormModal from "../../components/Custom/FormModal/FormModal";
import AddIcon from "@mui/icons-material/Add";
import { deleteAPI } from "../../helper/apiCallHelper";
import { adminTableColumns, adminformFields } from "../../constants/adminPage";
import { useDebouncedValue } from "../../helper/debounce";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 2000);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const [formFields, setFormFields] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async (searchValue) => {
    await get(
      `/admin/access-management/admins?search=${searchValue}&page=${page}&limit=${20}`
    )
      .then((res) => {
        setAdmins(
          res?.data.map((item) => ({
            ...item,
            action: { edit: true, delete: true },
          }))
        );
        setPageCount(res?.totalPage);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  useEffect(() => {
    if (search === "") {
      fetchAdmins("");
    } else if (debouncedSearch) {
      fetchAdmins(debouncedSearch);
    }
  }, [search, debouncedSearch, page]);

  const fetchPermissions = async () => {
    await get(`/admin/permissions`)
      .then((res) => {
        let data = res?.data?.permissions;
        setPermissions(
          data.map((item) => ({
            label: item.name,
            value: item._id,
          }))
        );
        let arr = adminformFields(
          data.map((item) => ({
            label: item.name,
            value: item._id,
          }))
        );
        setFormFields(arr);
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    fetchAdmins();
    fetchPermissions();
  }, [message]);

  const handleDelete = (row) => {
    setDeleteUser(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteAdmin = async (row) => {
    let url = `/admin/auth/delete-admin/${row._id}`;
    let response = await deleteAPI(url);
    console.log("response", response);
    setDeleteModalOpen(false);
  };

  const handleStatus = (row) => {
    // Implement the status chnage for the selected row
    console.log("Delete clicked for row34:", row);
  };

  const handleSearch = (searchText) => {
    setSearch(searchText);
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
    try {
      if (isEditing) {
        formData = {
          ...formData,
          permissionsId: formData.permissions.map((p) => p.value),
        };
        const { permissions, ...data } = formData;
        await patch("/admin/auth/edit", data);
        setMessage("Successfully updated");
        setEditData({});
        setEditModal(false);
      } else {
        formData = {
          ...formData,
          permissionsId: formData.permissions.map((p) => p.value),
        };
        const { permissions, ...data } = formData;

        await post("/admin/auth/register", { data });
        setMessage("Successfully added");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Error while processing the request");
    }
  };

  const handleChange = (page) => {
    setPage(page);
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Admins</Typography>
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
                placeholder={"Seach by name, email"}
                debounceTime={1000}
              />
            </div>

            <Button
              onClick={() => openModal("add")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold" }}
            >
              add members
            </Button>
          </div>

          <CustomTable
            data={admins}
            columns={adminTableColumns}
            handleEdit={(row) => openModal("edit", row)}
            handleDelete={handleDelete}
            handleStatus={handleStatus}
            handlePageChange={(page) => handleChange(page)}
            pageNumber={page}
            pageCount={pageCount}
            loading={loading}
          />
        </div>
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteAdmin}
          data={deleteUser}
        />
      </Layout>

      <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={
          editModal
            ? formFields.filter((field) => field.name !== "password")
            : formFields
        }
        header={editModal ? "Edit Admin" : "Add Admin"}
        initialData={editData}
        isEditing={editModal}
      />
    </>
  );
};

export default Admins;
