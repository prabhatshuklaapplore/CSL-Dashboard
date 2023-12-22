import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Button, Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, postFiles } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI, patchAPI } from "../../helper/apiCallHelper";
import { toastMessage } from "../../utils/toastMessage";
import FormModal from "../../components/Custom/FormModal/FormModal";
import AddIcon from "@mui/icons-material/Add";
import {
  featureformFields,
  featuretableColumns,
} from "../../constants/venueFeaturesPage";
import { useDebouncedValue } from "../../helper/debounce";

const VenueFeatures = () => {
  const [venueFeatures, setVenueFeatures] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(search, 2000);

  const fetchVenueFeatures = async (searchValue) => {
    await get(`/admin/access-management/getvenuecatagory?search=${searchValue}`)
      .then((res) => {
        console.log("res", res?.data);
        setVenueFeatures(
          res?.data.map((item) => ({
            ...item,
            action: { edit: true, delete: true },
          }))
        );
        setMessage(res?.message);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  useEffect(() => {
    if (search === "") {
      fetchVenueFeatures("");
    } else if (debouncedSearch) {
      fetchVenueFeatures(debouncedSearch);
    }
  }, [search, debouncedSearch, message]);

  const handleDelete = (row) => {
    console.log("Delete clicked for row34:", row);
    setDeleteUser(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteVenueFeature = async (row) => {
    let url = `/admin/access-management/venue-features/${row._id}`;
    let response = await deleteAPI(url);
    toastMessage(response, "success");
    setMessage(response);
    setDeleteModalOpen(false);
  };

  const handleStatus = (row) => {
    console.log("Delete clicked for row34:", row);
  };

  const handleSearch = (searchText) => {
    setSearch(searchText);
  };

  const handleActive = async (id, active) => {
    let updateValue = {
      _id: id,
      isActive: active,
    };
    let response = await patchAPI(
      `/admin/access-management/updatevenuecatagory`,
      updateValue
    );
    setMessage(response);
    toastMessage(response, "success");
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
          "/admin/access-management/updatevenuecatagory",
          form,
          "PATCH"
        );

        setMessage("Successfully updated");
        setEditData({});
        setEditModal(false);
      } else {
        await postFiles("/admin/access-management/venuecatagory", form);
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
          <Typography variant="h5">Venue Features</Typography>
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
                placeholder={"Seach by feature name"}
                debounceTime={1000}
              />
            </div>

            <Button
              onClick={() => openModal("add")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold" }}
            >
              add feature
            </Button>
          </div>
          <CustomTable
            data={venueFeatures}
            columns={featuretableColumns}
            // handleEdit={(row) => openModal("edit", row)}
            handleEdit={(row) => openModal("edit", row)}
            handleDelete={handleDelete}
            handleStatus={handleStatus}
            handleActive={(row, active) => handleActive(row, active)}
            loading={loading}
          />
        </div>
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteVenueFeature}
          data={deleteUser}
        />
      </Layout>
      <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={featureformFields}
        header={editModal ? "Edit Venue Feature" : "Add Venue Feature"}
        initialData={editData}
        isEditing={editModal}
      />
    </>
  );
};

export default VenueFeatures;
