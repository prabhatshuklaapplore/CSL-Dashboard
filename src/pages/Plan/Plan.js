import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import AddIcon from "@mui/icons-material/Add";

import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, put, post } from "../../config/axios";
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
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const debouncedSearch = useDebouncedValue(search, 2000);

  const [visitsData, setVisitsData] = useState([]);
  const [propertiesList, setPropertiesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [assignData, setAssignData] = useState({});

  const fetchVisits = async (searchValue) => {
    await get(`/dashboard/visit/getAllVisit?limit=10&page=${page}`)
      .then((res) => {
        console.log("res", res?.data);
        setVisitsData(
          res?.data.map((item) => ({
            ...item,
            action: { edit: true, delete: false },
          }))
        );
        setLoading(false);
        setPageCount(res?.totalPage);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  const fetchUsers = async () => {
    await get(
      `/dashboard/dashUser/getAllAppUsers?page=${page}&limit=10000000000`
    )
      .then((res) => {
        console.log("res", res?.data);
        setUsersList(
          res?.data.map(({ _id, fullname }) => ({ _id, name: fullname }))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };
  // const fetchVisits = async () => {
  //   await get(`/dashboard/visit/getAllVisit?page=${page}&limit=10`)
  //     .then((res) => {
  //       console.log("res", res?.data);
  //       setVisitsData(
  //         res?.data.map(({ _id, fullname }) => ({ _id, name: fullname }))
  //       );
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //       setLoading(true);
  //     });
  // };

  const fetchProperties = async () => {
    await get(
      `/dashboard/property/getAllProperty?page=${page}&limit=1000000000`
    )
      .then((res) => {
        console.log("res", res?.data);
        setPropertiesList(res?.data.map(({ _id, name }) => ({ _id, name })));
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };
  useEffect(() => {
    fetchProperties();
    fetchUsers();
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

  const handlePageChange = (page) => {
    setPage(page);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    setAssignData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const openModal = (type, dataForEdit) => {
    if (type === "add") {
      setIsModalOpen(true);
    } else if (type === "edit") {
      setEditModal(true);
      setEditData(dataForEdit);
    } else if (type === "property") {
      setPropertyModalOpen(true);
    }
  };

  console.log("edit data", editData);

  const closeModal = (type) => {
    if (type === "add") {
      setIsModalOpen(false);
    } else if (type === "edit") {
      setEditModal(false);
      setEditData({});
    } else if (type === "property") {
      setPropertyModalOpen(false);
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

  let fields = [
    {
      name: "property",
      label: "select property",
      title: "Property Name",
      isDropdown: true,
      values: propertiesList,
    },
    {
      name: "user",
      label: "select user to assign",
      title: "Assign To",
      isDropdown: true,
      values: usersList,
    },
    {
      name: "dateOfVisit",
      // label: "select date of visit",
      title: "Visit Date",
      type: "date",
      isDropdown: false,
    },
  ];

  const assignPropertyVisit = async () => {
    try {
      console.log("prope", assignData);
      await post(`/dashboard/visit/addVisit`, assignData);
    } catch (error) {
      console.log("err", error);
    }
    setPropertyModalOpen(false);
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Plan</Typography>
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
                placeholder={"Seach by email, employee id"}
                debounceTime={1000}
              />
            </div>
            <Button
              onClick={() => openModal("property")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold", marginTop: "0.75rem" }}
            >
              Assign Property
            </Button>
          </div>
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
            handlePageChange={(page) => handlePageChange(page)}
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
        usersList={usersList}
        header={editModal ? "Edit Visit" : "Add Event Category"}
        initialData={editData}
        isEditing={editModal}
      />

      <Modal
        open={propertyModalOpen}
        onClose={() => {
          setPropertyModalOpen(false);
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className={style.main_div}
        >
          <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
            ASSIGN PROPERTY
          </h2>
          <form className={style.form_div}>
            {fields &&
              fields.map((field, idx) => {
                return (
                  <div style={{ marginTop: "1rem" }}>
                    {field.isDropdown ? (
                      <div key={idx} style={{ padding: "0 1rem" }}>
                        <Typography>{field.title}</Typography>
                        <TextField
                          select
                          name={field?.name}
                          value={assignData[field.name]}
                          onChange={handleChange}
                          // label="Property Type"
                          sx={{ marginTop: "10px", width: "100%" }}
                        >
                          {field.values.map((option) => (
                            <MenuItem key={option} value={option._id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                    ) : (
                      <div key={idx} style={{ padding: "0 1rem" }}>
                        <Typography>{field.title}</Typography>
                        <TextField
                          name={field?.name}
                          value={assignData[field.name]}
                          label={field?.label}
                          onChange={(e) => handleChange(e)}
                          type={field?.type}
                          sx={{ marginTop: "10px" }}
                          // error={schemeErr.name}
                          // helperText={schemeErr.name}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
          </form>
          <Button
            variant="contained"
            style={{ marginTop: "1.5rem" }}
            onClick={assignPropertyVisit}
            // fullWidth
          >
            assign property
          </Button>
        </Box>
      </Modal>
    </>
  );
};
