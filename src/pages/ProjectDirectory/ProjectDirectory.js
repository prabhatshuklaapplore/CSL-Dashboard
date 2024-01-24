import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Box, Button, MenuItem, Modal, Typography } from "@mui/material";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, post, put, postFiles } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI, updateAPI } from "../../helper/apiCallHelper";
import { toastMessage } from "../../utils/toastMessage";
import {
  projectDirtableColumns,
  bulkUploadFields,
  projectDirformFields,
} from "../../constants/projectDirPage";
import { useDebouncedValue } from "../../helper/debounce";
import FormModal from "../../components/Custom/FormModal/FormModal";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import style from "./ProjectDirectory.module.css";

export const ProjectDirectory = () => {
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
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ["Zone 1", "Zone 2", "Zone 3"];
  const [propertyType, setPropertyType] = useState([]);
  const [properties, setProperties] = useState([]);
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

  const fetchProperties = async (searchValue) => {
    await get(
      `/dashboard/property/getAllProperty?search=${searchValue}&page=${page}&limit=10`
    )
      .then((res) => {
        console.log("res1", res?.data);
        setProperties(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  const fetchPropertyTypes = async () => {
    await get(`/dashboard/property/getAllPropertyType?page=1&limit=10`)
      .then((res) => {
        console.log("res", JSON.stringify(res?.data));
        setPropertyType(res?.data.map(({ _id, name }) => ({ _id, name })));
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  useEffect(() => {
    if (search === "") {
      fetchProperties("");
    } else if (debouncedSearch) {
      fetchProperties(debouncedSearch);
    }
  }, [search, debouncedSearch, message, page]);

  console.log("prop", properties);

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

  const handleActive = async (id, active) => {
    let response = await put(`dashboard/property/updateProperty?id=${id}`, {
      active: active,
    });
    setMessage(response.message);
    toastMessage(response.message, "success");
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

    setIsBulkUpload(false);
    setIsModalOpen(false);
    setEditModal(false);
  };

  let fields = [
    {
      name: "propertyId",
      label: "Property Id",
      title: "Property Id",
      type: "text",
      isDropdown: false,
    },
    {
      name: "groupName",
      label: "group name",
      title: "Group Name",
      type: "text",
      isDropdown: false,
    },
    {
      name: "name",
      label: "project name",
      title: "Project Name",
      type: "text",
      isDropdown: false,
    },
    {
      name: "projectZone",
      label: "Zone",
      title: "Project Location/ Zone",
      type: "text",
      isDropdown: false,
    },
    {
      name: "address",
      label: "address",
      title: "Property Address",
      type: "text",
      isDropdown: false,
    },
    {
      name: "area",
      label: "total area covered",
      title: "Area (in sq.ft)",
      type: "number",
      isDropdown: false,
    },

    {
      name: "borrowerName",
      label: "borrower name",
      title: "Borrower Name",
      type: "text",
      isDropdown: false,
    },
    {
      name: "lan",
      label: "LAN No.",
      title: "LAN No",
      type: "text",
      isDropdown: false,
    },

    {
      name: "projectCost",
      label: "project cost",
      title: "Total Cost",
      type: "number",
      isDropdown: false,
    },
    {
      name: "loanSanctionAmount",
      label: "loan sanction amount",
      title: "Loan Sanction Amount",
      type: "number",
      isDropdown: false,
    },
    {
      name: "loadPOS",
      label: "Loan POS",
      title: "Loan POS",
      type: "number",
      isDropdown: false,
    },
    {
      name: "groupSanctionAmount",
      label: "group sanction amount",
      title: "Group Saction Amount",
      isDropdown: false,
      type: "number",
    },
    {
      name: "groupPOS",
      label: "group POS name",
      title: "Group POS",
      isDropdown: false,
      type: "text",
    },
    {
      name: "propertyType",
      label: "property type",
      title: "Property Type",
      isDropdown: true,
      values: propertyType,
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPropertiesValue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  console.log("proper", propertiesValue);
  const submitProperty = async () => {
    try {
      console.log("prope", propertiesValue);
      await post(`/dashboard/property/addProperty`, propertiesValue);
    } catch (error) {
      console.log("err", error);
    }
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Project Directory</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "50%" }}>
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
              Add Project Directory
            </Button>

            <Button
              onClick={() => openModal("bulkUpload")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold", marginRight: "2%" }}
            >
              Bulk Upload
            </Button>

            {/* <Button
              onClick={() => openModal("filter-zone")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold" }}
            >
              Filter-Zone
            </Button> */}
            {/* <Autocomplete
              options={options}
              value={selectedOption}
              onChange={(event, newValue) => setSelectedOption(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter - Zone"
                  variant="outlined"
                  style={{ width: "9rem" }}
                />
              )}
            /> */}
          </div>
          <CustomTable
            data={properties}
            columns={projectDirtableColumns}
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
      <FormModal
        isOpen={isBulkUpload}
        onClose={() => closeModal("bulkUpload")}
        onSubmit={handleBulkUpload}
        fields={bulkUploadFields}
        header={"Bulk Upload"}
        initialData={editData}
        isEditing={editModal}
        isBulkUpload={isBulkUpload}
        downloadButton={true}
        link={
          "https://petrepublicdev.s3.ap-south-1.amazonaws.com/public/flrrdflrrdProject_Directory_Sample.xlsx"
        }
      />

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
            ADD PROPERTY
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
                          name="propertyType"
                          value={propertiesValue[field.name]}
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
                          value={propertiesValue[field.name]}
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
            onClick={submitProperty}
            // fullWidth
          >
            Submit property type
          </Button>
        </Box>
      </Modal>
    </>
  );
};
