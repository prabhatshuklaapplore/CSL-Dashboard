import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Button, Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, postFiles } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import { deleteAPI, patchAPI } from "../../helper/apiCallHelper";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { toastMessage } from "../../utils/toastMessage";
import AddIcon from "@mui/icons-material/Add";
import FormModal from "../../components/Custom/FormModal/FormModal";
import {
  eventCategoriesformFields,
  eventCategoriestableColumns,
} from "../../constants/eventCategoriesPage";
import { useDebouncedValue } from "../../helper/debounce";

const EventCategories = () => {
  const [eventCategories, setEventCategories] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(search, 2000);

  const fetchEventCategories = async (searchValue) => {
    await get(
      `admin/access-management/geteventcatagory?search=${searchValue}&page=${page}&limit=${20}`
    )
      .then((res) => {
        console.log("res", res?.data);
        setEventCategories(
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
      fetchEventCategories("");
    } else if (debouncedSearch) {
      fetchEventCategories(debouncedSearch);
    }
  }, [search, debouncedSearch, message, page]);

  const handleStatus = (row) => {
    console.log("Delete clicked for row34:", row);
  };

  const handleSearch = (searchText) => {
    setSearch(searchText);
  };

  const handleDelete = (row) => {
    setDeleteUser(row);
    setDeleteModalOpen(true);
  };

  const handleActive = async (id, active) => {
    let updateValue = {
      _id: id,
      isActive: active,
    };
    let response = await patchAPI(
      `/admin/access-management/updateeventcatagory`,
      updateValue
    );
    setMessage(response);
    toastMessage(response, "success");
  };

  const handleDeleteEventCategory = async (row) => {
    let url = `/admin/access-management/event-category/${row._id}`;
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
    try {
      let form = new FormData();
      form.append("name", formData?.name);
      form.append("files", formData?.image);
      form.append("files", formData?.svg);

      if (isEditing) {
        form.append("_id", editData._id);

        await postFiles(
          "/admin/access-management/updateeventcatagory",
          form,
          "PATCH"
        );

        setMessage("Successfully updated");
        setEditData({});
        setEditModal(false);
      } else {
        await postFiles("/admin/access-management/eventcatagory", form);
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
          <Typography variant="h5">Event Categories</Typography>

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
                placeholder={"Seach by category name"}
                debounceTime={1000}
              />
            </div>

            <Button
              onClick={() => openModal("add")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold" }}
            >
              add category
            </Button>
          </div>
          <CustomTable
            data={eventCategories}
            columns={eventCategoriestableColumns}
            handleEdit={(row) => openModal("edit", row)}
            handleDelete={handleDelete}
            handleStatus={handleStatus}
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
        onDelete={handleDeleteEventCategory}
        data={deleteUser}
      />
      <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={eventCategoriesformFields}
        header={editModal ? "Edit Event Category" : "Add Event Category"}
        initialData={editData}
        isEditing={editModal}
      />
    </>
  );
};

export default EventCategories;
