/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, put } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import { toastMessage } from "../../utils/toastMessage";
import FormModal from "../../components/Custom/FormModal/FormModal";
import {
  adminActionableColumns,
  adminActionableformFields,
} from "../../constants/adminActionable";
import { useDebouncedValue } from "../../helper/debounce";

const Actionables = () => {
  const [eventCategories, setEventCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(search, 2000);

  const fetchAdminActionables = async (searchValue) => {
    await get(
      `/admin/dashboard/admin-actionable?search=${searchValue}&page=${page}&limit=${20}`
    )
      .then((res) => {
        setEventCategories(
          res?.data?.data?.addons.map((item) => ({
            ...item,
            action: {
              edit: item.status === "DONE" ? false : true,
              delete: false,
            },
          }))
        );
        setPageCount(res?.data?.data?.totalPage);
        setMessage(res?.data?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  useEffect(() => {
    if (search === "") {
      fetchAdminActionables("");
    } else if (debouncedSearch) {
      fetchAdminActionables(debouncedSearch);
    }
  }, [message, search, debouncedSearch, page]);

  const handleStatus = (row) => {
    console.log("Delete clicked for row34:", row);
  };

  const handleSearch = (searchText) => {
    setSearch(searchText);
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
        await put(`/admin/dashboard/admin-actionable/${editData._id}`, formData)
          .then((res) => {
            console.log("update", res);
            setMessage(res.message);
            toastMessage(res.message, "success");
            setEditData({});
            setEditModal(false);
          })
          .catch((err) => {
            setMessage(err.message);
          });
      } else {
        // setIsModalOpen(false);
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
          <Typography variant="h5">Admin Actionables</Typography>

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
          </div>
          <CustomTable
            data={eventCategories}
            columns={adminActionableColumns}
            handleEdit={(row) => openModal("edit", row)}
            handleStatus={handleStatus}
            handlePageChange={(page) => handleChange(page)}
            pageNumber={page}
            pageCount={pageCount}
            loading={loading}
          />
        </div>
      </Layout>
      <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={adminActionableformFields}
        header={editModal ? "Edit Admin Actionable" : "Add Admin Actionable"}
        initialData={editData}
        isEditing={editModal}
      />
    </>
  );
};

export default Actionables;
