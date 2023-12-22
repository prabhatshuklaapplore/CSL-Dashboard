import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, post, put } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI, updateAPI } from "../../helper/apiCallHelper";
import { toastMessage } from "../../utils/toastMessage";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  propertiestableColumns,
  bulkUploadFields,
  propertyformFields,
} from "../../constants/propertiesPage";
import { useDebouncedValue } from "../../helper/debounce";
import FormModal from "../../components/Custom/FormModal/FormModal";
import AddIcon from "@mui/icons-material/Add";
import style from "./Properties.module.css";

export const Properties = () => {
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
  const [isBulkUpload, setIsBulkUpload] = useState(false);

  const [assignData, setAssignData] = useState({});
  const [propertiesList, setPropertiesList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [propertiesValue, setPropertiesValue] = useState({
    name: "",
    address: "",
    area: "",
    groupName: "",
    borrowerName: "",
    projectZone: "",
    projectCost: "",
    loanSanctionAmount: "",
    loadPOS: "",
    groupSanctionAmount: "",
    groupPOS: "",
    propertyType: "",
  });

  const [propertiesOption, setpropertiesOption] = useState([
    {
      fieldName: "",
      options: [{ remarkFieldRequired: false, photographRequired: false }],
    },
  ]);

  const fetchEvents = async (searchValue) => {
    await get(
      // `/dashboard/property/getAllProperty?page=${1}&limit=${10}&search=&{su}`
      `dashboard/property/getAllProperty?page=${page}&limit=10&search=${search}`
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

  const fetchProperties = async () => {
    await get(`/dashboard/property/getAllProperty?page=${page}&limit=10`)
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

  const fetchUsers = async () => {
    await get(`/dashboard/dashUser/getAllAppUsers?page=${page}&limit=10`)
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

  console.log("users", usersList, propertiesList);

  useEffect(() => {
    fetchProperties();
    fetchUsers();
  }, []);

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

  // const handleChange = (page) => {
  //   setPage(page);
  // };

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

  const handleBulkUpload = (formData) => {
    console.log("Bulk Upload data:", formData);

    setIsBulkUpload(false);
    setIsModalOpen(false);
    setEditModal(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAssignData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const addpropertiesOption = () => {
    const newObj = {
      fieldName: "",
      options: [{}],
    };

    setpropertiesOption((prevTyreSizeSlab) => {
      const updatedTyreSizeSlab = [...prevTyreSizeSlab, newObj];
      return updatedTyreSizeSlab;
    });
  };

  const addOptions = (index) => {
    console.log("tyreslab add", index);
    const newTyreSlabObject = {
      name: "",
      option1: "",
      option2: "",
      option3: "",
      remarkFieldRequired: false,
      photographRequired: false,
    };

    setpropertiesOption((prevState) => {
      const updatedTyreSizeSlab = prevState.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            options: [...item.options, { ...newTyreSlabObject }],
          };
        }
        return item;
      });

      return updatedTyreSizeSlab;
    });
  };

  const updateSlabProperty = (event, index, tyreSlabIndex) => {
    console.log("skyu", event.target);
    const { name, value } = event.target;
    const updatedTyreSizeSlab = [...propertiesOption];
    console.log("index 1", updatedTyreSizeSlab[index]?.options);
    updatedTyreSizeSlab[index].options[tyreSlabIndex] = {
      ...updatedTyreSizeSlab[index].options[tyreSlabIndex],
      [name]: value,
    };
    setpropertiesOption(updatedTyreSizeSlab);
  };

  const updatePropertyType = (event, index) => {
    const { name, value } = event.target;
    const updatedPropertiesOption = [...propertiesOption];

    updatedPropertiesOption[index] = {
      ...updatedPropertiesOption[index],
      fieldName: value,
    };

    setpropertiesOption(updatedPropertiesOption);
  };

  const updateCheckSwitch = (event, index, tyreSlabIndex) => {
    const { name, checked } = event.target;
    const updatedPropertiesOption = [...propertiesOption];

    updatedPropertiesOption[index].options[tyreSlabIndex] = {
      ...updatedPropertiesOption[index].options[tyreSlabIndex],
      [name]: checked,
    };

    setpropertiesOption(updatedPropertiesOption);
  };
  console.log("values", propertiesValue);

  let fields = [
    {
      name: "property",
      label: "select property",
      title: "Property",
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
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Property Allocation</Typography>
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
                placeholder={
                  "Seach by Lan no., Borrower name, borrower group name,Property id"
                }
                debounceTime={1000}
              />
            </div>

            <Button
              onClick={() => openModal("add")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold", marginTop: "0.75rem" }}
            >
              Assign Property
            </Button>
          </div>
          <CustomTable
            data={events}
            columns={propertiestableColumns}
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
          // onDelete={handleDeleteVenueFeature}
          data={deleteUser}
        />
      </Layout>
      {/* <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={propertyformFields}
        header={editModal ? "Edit Member" : "Add Property"}
        initialData={editData}
        isEditing={editModal}
      /> */}
      {/* <FormModal
        isOpen={isModalOpen || editModal || isBulkUpload}
        onClose={() =>
          closeModal(editModal ? "edit" : isBulkUpload ? "bulkUpload" : "add")
        }
        onSubmit={isBulkUpload ? handleBulkUpload : handleSubmit}
        fields={isBulkUpload ? bulkUploadFields : propertyformFields}
        header={
          isBulkUpload
            ? "Bulk Upload"
            : editModal
            ? "Edit Property"
            : "Add Property"
        }
        initialData={editData}
        isEditing={editModal}
        isBulkUpload={isBulkUpload}
      /> */}
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
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
                          label="Property Type"
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
