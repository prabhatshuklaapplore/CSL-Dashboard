import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Box, Button, Modal, Switch, Typography } from "@mui/material";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, post, put } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI, updateAPI } from "../../helper/apiCallHelper";
import { toastMessage } from "../../utils/toastMessage";
import {
  fieldControltableColumns,
  bulkUploadFields,
  fieldControlformFields,
} from "../../constants/fieldControlPage";
import { useDebouncedValue } from "../../helper/debounce";
import FormModal from "../../components/Custom/FormModal/FormModal";
import AddIcon from "@mui/icons-material/Add";
import style from "./FieldControl.module.css";

const FieldControl = () => {
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
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ["WS Small", "MSL", "WSL Large"];
  const [propertyTypeName, setPropertyTypeName] = useState("");
  const [propertiesOption, setpropertiesOption] = useState([
    {
      fieldName: "",
      subHeadingName: "",
      remarkFieldRequired: "",
      options: [
        {
          name: "",
          option1: "",
          option2: "",
          option3: "",
          remarkFieldRequired: false,
          photographRequired: false,
        },
      ],
    },
  ]);

  const fetchEvents = async (searchValue) => {
    await get(`/dashboard/property/getAllPropertyType?page=1&limit=10`)
      .then((res) => {
        console.log("res", res?.data);
        setEvents(
          res?.data.map((item) => ({
            ...item,
            action: { edit: false, delete: true },
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

  // const handleActive = async (id, active, type) => {
  //   console.log("active", id, active, type);
  //   let updateValue = {};
  //   if (type === "active") {
  //     updateValue = {
  //       isActive: active,
  //     };
  //   }
  //   let response = await updateAPI(
  //     // `/admin/access-management/event-update/${id}`,
  //     updateValue
  //   );
  //   setMessage(response);
  //   toastMessage(response, "success");
  // };
  const handleActive = async (row, active) => {
    console.log(row);
    let response = await put(
      `/dashboard/property/updatePropertyType?id=${row._id}`,
      {
        active: false,
      }
    );
    setLoading(true);
    setDeleteModalOpen(false);
    setMessage("succesfully deleted");
    toastMessage("Succesfully deleted", "success");
    setLoading(false);
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
        await post(`/dashboard/property/addPropertyType`, formData);
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

  const handleBulkUpload = (formData) => {
    console.log("Bulk Upload data:", formData);

    setIsBulkUpload(false);
    setIsModalOpen(false);
    setEditModal(false);
  };
  const handleDeleteVenueFeature = (row) => {
    console.log("delete", row);
  };

  const updatePropertyType = (event, index) => {
    const { name, value } = event.target;
    const updatedPropertiesOption = [...propertiesOption];

    updatedPropertiesOption[index] = {
      ...updatedPropertiesOption[index],
      [name]: value,
    };

    setpropertiesOption(updatedPropertiesOption);
  };
  console.log("prope", propertiesOption);

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
  const updateCheckSwitch = (event, index, tyreSlabIndex) => {
    const { name, checked } = event.target;
    const updatedPropertiesOption = [...propertiesOption];

    updatedPropertiesOption[index].options[tyreSlabIndex] = {
      ...updatedPropertiesOption[index].options[tyreSlabIndex],
      [name]: checked,
    };

    setpropertiesOption(updatedPropertiesOption);
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

  const submitPropertyType = async () => {
    try {
      console.log("prope", propertiesOption);
      await post(`/dashboard/property/addPropertyType`, {
        name: propertyTypeName,
        fieldOptions: propertiesOption,
      });
    } catch (error) {
      console.log("err", error);
    }
    setMessage("Successfully added");
    setIsModalOpen(false);
  };

  const addpropertiesOption = () => {
    const newObj = {
      fieldName: "",
      subHeadingName: "",
      options: [
        {
          name: "",
          option1: "",
          option2: "",
          option3: "",
          remarkFieldRequired: false,
          photographRequired: false,
        },
      ],
    };

    setpropertiesOption((prevTyreSizeSlab) => {
      const updatedTyreSizeSlab = [...prevTyreSizeSlab, newObj];
      return updatedTyreSizeSlab;
    });
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Property Type</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "60%" }}>
              <Searchbar
                search={handleSearch}
                placeholder={"Seach by property type"}
                debounceTime={1000}
              />
            </div>

            <Button
              onClick={() => openModal("add")}
              variant="outlined"
              startIcon={<AddIcon fontSize="large" />}
              style={{ fontWeight: "bold" }}
            >
              Add Property Type
            </Button>
          </div>
          <CustomTable
            data={events}
            columns={fieldControltableColumns}
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
          onDelete={handleActive}
          data={deleteUser}
        />
      </Layout>
      <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={fieldControlformFields}
        header={editModal ? "Edit Property Type" : "Add Property Type"}
        initialData={editData}
        isEditing={editModal}
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
            height: "100rem",
          }}
          className={style.main_div}
        >
          <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
            ADD PROPERTY TYPE
          </h2>
          <div style={{ padding: "0 0rem" }}>
            <Typography>{"Property Type/Name"}</Typography>
            <TextField
              name="fieldName"
              value={propertyTypeName}
              label={"ex. WS Large / MSME"}
              onChange={(event) => setPropertyTypeName(event.target.value)}
              sx={{ marginTop: "5px" }}
              // error={schemeErr.name}
              // helperText={schemeErr.name}
            />
            {propertiesOption.map((form, index) => {
              return (
                <div
                  style={{
                    // border: "1px solid grey",
                    margin: "10px 0",
                    border: "2px solid grey",
                    padding: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div>
                      <Typography>{"Property Type/Name"}</Typography>
                      <TextField
                        name="fieldName"
                        value={propertiesOption[index].fieldName}
                        label={"ex. WS Large / MSME"}
                        onChange={(event) => updatePropertyType(event, index)}
                        sx={{ marginTop: "5px" }}
                        // error={schemeErr.name}
                        // helperText={schemeErr.name}
                      />
                    </div>
                    <div style={{ marginLeft: "2rem" }}>
                      <Typography>{"Sub Type Building / Tower"}</Typography>
                      <TextField
                        name="subHeadingName"
                        value={propertiesOption[index].subHeadingName}
                        label={"ex. Pre Structure/ Structure Work etc."}
                        onChange={(event) => updatePropertyType(event, index)}
                        sx={{ marginTop: "5px" }}
                        // error={schemeErr.name}
                        // helperText={schemeErr.name}
                      />
                    </div>
                    <div style={{ marginLeft: "2rem" }}>
                      <Typography>Remarks field Required</Typography>
                      <Switch
                        name="remarkFieldRequired"
                        checked={propertiesOption[index].remarkFieldRequired}
                        onChange={(event) => updatePropertyType(event, index)}
                      />
                    </div>
                  </div>

                  {form?.options.map((item, idx) => {
                    return (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            // justifyContent: "space-between",
                            border: "1px solid darkgrey",
                            margin: "1rem 0",
                            padding: "1rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <div>
                              <Typography>
                                Building Name / Tower Name
                              </Typography>
                              <TextField
                                name="name"
                                value={item?.name}
                                label="ex Tower Name / Basement / 1st Floor"
                                onChange={(event) =>
                                  updateSlabProperty(event, index, idx)
                                }
                                sx={{ width: "100%", marginTop: "5px" }}
                                // error={slabErr[index]?.clubName}
                                // helperText={slabErr[index]?.clubName}
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              marginTop: "10px",
                            }}
                          >
                            <div>
                              <Typography>Option 1</Typography>
                              <TextField
                                name="option1"
                                value={item?.option1}
                                label="ex. Completed/ Not started/ WIP"
                                onChange={(event) =>
                                  updateSlabProperty(event, index, idx)
                                }
                                // error={slabErr[index]?.clubName}
                                // helperText={slabErr[index]?.clubName}
                              />
                            </div>
                            <div style={{ marginLeft: "2rem" }}>
                              <Typography>Option 2</Typography>
                              <TextField
                                name="option2"
                                value={item?.option2}
                                label="ex. Completed/ Not started/ WIP"
                                onChange={(event) =>
                                  updateSlabProperty(event, index, idx)
                                }
                                // error={slabErr[index]?.clubName}
                                // helperText={slabErr[index]?.clubName}
                              />
                            </div>
                            <div style={{ marginLeft: "2rem" }}>
                              <Typography>Option 3</Typography>
                              <TextField
                                name="option3"
                                value={item?.option3}
                                label="ex. Completed/ Not started/ WIP"
                                onChange={(event) =>
                                  updateSlabProperty(event, index, idx)
                                }
                                // error={slabErr[index]?.clubName}
                                // helperText={slabErr[index]?.clubName}
                              />
                            </div>
                          </div>
                          <div style={{ display: "flex", marginTop: "16px" }}>
                            <div>
                              <Typography>Photograph Required</Typography>
                              <Switch
                                name="photographRequired"
                                checked={item?.photographRequired || false}
                                onChange={(event) =>
                                  updateCheckSwitch(event, index, idx)
                                }
                              />
                            </div>
                            <div style={{ marginLeft: "2rem" }}>
                              <Typography>Remarks field Required</Typography>
                              <Switch
                                name="remarkFieldRequired"
                                checked={item?.remarkFieldRequired || false}
                                onChange={(event) =>
                                  updateCheckSwitch(event, index, idx)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => addOptions(index)}
                    >
                      add another work type
                    </Button>
                  </div>
                </div>
              );
            })}
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                style={{ marginTop: "1rem" }}
                onClick={addpropertiesOption}
                // fullWidth
              >
                ADD another field
              </Button>
            </div>

            <Button
              variant="contained"
              // style={{ margin: "25px 0" }}
              onClick={submitPropertyType}
              // fullWidth
            >
              Submit property type
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default FieldControl;
