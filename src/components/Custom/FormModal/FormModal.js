/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Autocomplete, MenuItem, Select } from "@mui/material";
import style from "./FormModal.module.css";
import { Switch } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";

const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  fields,
  resetFormData,
  header,
  initialData,
  isEditing,
  handleActive,
  downloadButton,
  usersList,
  link,
}) => {
  const initialFormData = {};
  const initialErrors = {};

  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState({});
  const label = { inputProps: { "aria-label": "Switch demo" } };

  fields.forEach((field) => {
    initialFormData[field.name] = field.isMultiSelect ? [] : "";
    initialErrors[field.name] = "";
  });

  // const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [checked, setChecked] = useState(false);

  console.log("userslist", usersList);

  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialFormData);
    }
  }, [initialData]);

  const validateFormData = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const isEmpty = !formData[field.name];
      const isEditingtextField = field.type === "text" && field.isEditing;
      const istextEmpty = isEditingtextField && !formData[field.name].name;

      if (field.required && (isEmpty || istextEmpty)) {
        newErrors[field.name] = `${field.label} is required`;
      } else {
        newErrors[field.name] = "";
      }
    });

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChange = (fieldName, fieldType) => (event, newValue) => {
    if (Array.isArray(newValue)) {
      // setFormData({ ...formData, [fieldName]: newValue });
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    } else if (fieldType === "file") {
      const file = event.target.files[0];
      setFormData({ ...formData, [fieldName]: file });
    } else {
      setFormData({ ...formData, [fieldName]: event.target.value });
    }
  };

  const handleSubmit = (formdata) => {
    if (validateFormData()) {
      onSubmit(formData, isEditing);
      onClose();
    }
  };

  // const handleSubmit = () => {
  //   if (validateFormData()) {
  //     const newDataList = [...dataList, formData];
  //     setDataList(newDataList);
  //     onClose();
  //   }
  // };

  const handleCancel = () => {
    const clearedFormData = {};
    fields.forEach((field) => {
      clearedFormData[field.name] = field.isMultiSelect ? [] : "";
    });
    setFormData(clearedFormData);
    setErrors(initialErrors);
    onClose();
  };

  useEffect(() => {
    if (resetFormData) {
      setFormData(initialFormData);
      setErrors(initialErrors);
    }
  }, [resetFormData]);

  const getNestedProperty = (obj, path) => {
    const keys = path.split(".");
    let result = obj;

    for (const key of keys) {
      result = result[key];
      if (result === undefined) {
        return "";
      }
    }

    return result;
  };

  // Function to handle Switch state change
  const handleSwitchChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleCancel}
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
        <Typography
          id="modal-title"
          variant="h5"
          component="h2"
          align="center"
          style={{ textDecoration: "none" }}
        >
          {header}
        </Typography>
        <form>
          <div
            style={{
              margin: "2rem 0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
          >
            {fields.map((field) => {
              let fieldname = field.name;
              return (
                <div
                  key={field.name}
                  style={{
                    marginTop: "20px ",
                    marginBottom: "10px",
                    marginRight: "40px",
                  }}
                >
                  <Typography>{field.label}</Typography>
                  {field.isMultiSelect ? (
                    <Autocomplete
                      disabled={field.disabled ? true : false}
                      multiple
                      id={field.name}
                      options={field.options}
                      value={formData[field.name]}
                      onChange={(_, newValue) =>
                        handleChange(field.name)(_, newValue)
                      }
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors[field.name]}
                          helperText={errors[field.name]}
                          SelectProps={{
                            multiple: false, // Set to true if you want multiple selections
                            renderValue: (selected) => (
                              <div>
                                {selected.map((value) => (
                                  <span key={value}>{value}</span>
                                ))}
                              </div>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : field.type === "dropdown" ? (
                    <Autocomplete
                      options={["Ajay", "Vikas"]} // Add options for ComboBox
                      onChange={(event, value) => {
                        setFormData({ ...formData, [field.name]: value });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          required={field.required}
                          fullWidth
                        />
                      )}
                    />
                  ) : field.type === "dropdown2" ? (
                    <Autocomplete
                      options={["Completed", "Not Started", "WIP"]} // Add options for ComboBox
                      onChange={(event, value) => {
                        setFormData({ ...formData, [field.name]: value });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          required={field.required}
                          fullWidth
                        />
                      )}
                    />
                  ) : field.type === "toggle" ? (
                    <Switch
                      // checked={}
                      {...label}
                      defaultChecked
                      // disabled={true}
                      inputProps={{ "aria-label": "controlled" }}
                      // onChange={(event) => {
                      //   const newActiveValue = event.target.checked;
                      //   handleActive(row?._id, newActiveValue, "status");
                      // }}
                    />
                  ) : field.isMultiSelect === false ? (
                    <Select
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={(event) => handleChange(field.name)(event)}
                      fullWidth
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      disabled={field.disabled ? true : false}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : field.type === "date" ? (
                    <>
                      <TextField
                        // label={field.label}
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={getNestedProperty(formData, fieldname)}
                        onChange={(event) => handleChange(field.name)(event)}
                        // fullWidth
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                        disabled={field.disabled ? field.disabled : false}
                      />
                    </>
                  ) : field.type === "file" ? (
                    <>
                      <input
                        type="file"
                        onChange={(event) =>
                          handleChange(field.name, field.type)(event)
                        }
                      />
                      {field.required && !formData[field.name] && (
                        <p
                          className={style.error_msg}
                        >{`${field.label} is required`}</p>
                      )}
                    </>
                  ) : field.type === "option" ? (
                    <Select
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={(event) => handleChange(field.name)(event)}
                      fullWidth
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      disabled={field.disabled ? true : false}
                    >
                      {usersList?.map(
                        (user) => (
                          <MenuItem key={user._id} value={user._id}>
                            {user.name}
                          </MenuItem>
                        )
                        // console.log("user34", user)
                      )}
                    </Select>
                  ) : (
                    <>
                      <TextField
                        // label={field.label}
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={getNestedProperty(formData, fieldname)}
                        onChange={(event) => handleChange(field.name)(event)}
                        // fullWidth
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                        disabled={field.disabled ? field.disabled : false}
                      />
                    </>
                  )}
                </div>
              );
            })}
            {downloadButton && (
              <div>
                <Typography>Download Sample Sheet</Typography>
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<DownloadIcon fontSize="large" />}
                  onClick={() => window.open(link)}
                  style={{ height: "43px" }}
                >
                  Download
                </Button>
              </div>
            )}
          </div>
        </form>

        <Button onClick={handleCancel} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          sx={{ ml: 6 }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default FormModal;
