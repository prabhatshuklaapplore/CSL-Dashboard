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
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  const [viewData, setViewData] = useState([]);

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

  const handleDisplay = async (row) => {
    // Implement the edit action for the selected row
  };

  const handleInsertData = () => {
    // Sample data to be inserted
    const data = [
      ["Name", "Age", "City"],
      ["John Doe", 25, "New York"],
      ["Jane Smith", 30, "San Francisco"],
      ["Bob Johnson", 22, "Los Angeles"],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Create a blob from the workbook
    const blob = XLSX.write(wb, {
      bookType: "xlsx",
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link and trigger a click event
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.xlsx";
    link.click();
  };

  const handleDownload = async (row) => {
    try {
      setLoading(true);
      const res = await get(
        `dashboard/visit/getAllVisit?propertyId=65a8f035c4d0faea193bde37`
      );
      console.log("resp", res);

      const result = [["Field Name", "Work"]];
      res?.data.forEach((data) =>
        result[0]?.push(moment.utc(data?.dateOfVisit).format("DD-MM-YYYY"))
      );
      result[0].push("Images");
      console.log(result);
      res?.data.forEach((data) =>
        data.responses.forEach((resp) =>
          resp.answer.forEach((ans, index) => {
            if (!result[index + 1]) {
              result[index + 1] = [];
            }
            let row = [];
            row.push(resp.fieldName);
            row.push(ans.name);
            row.push(ans.answer);
            result.push(row);
          })
        )
      );
      console.log("resdata", result);
      // const wb = XLSX.utils.book_new();
      // const ws = XLSX.utils.aoa_to_sheet(result);

      // Add an image to the worksheet
      // const img = new Image();
      // img.src =
      //   "https://petrepublicdev.s3.ap-south-1.amazonaws.com/public/04udd04uddscaled_1000047111.jpg";

      // // Convert the image to a Blob
      // img.crossOrigin = "Anonymous";
      // img.onload = () => {
      //   const canvas = document.createElement("canvas");
      //   const ctx = canvas.getContext("2d");
      //   canvas.width = img.width;
      //   canvas.height = img.height;
      //   ctx.drawImage(img, 0, 0, img.width, img.height);

      //   canvas.toBlob((blob) => {
      //     const imgData = URL.createObjectURL(blob);
      //     XLSX.utils.dff_add_img(ws, imgData, {
      //       tl: { col: 2, row: 1 },
      //       ext: { width: img.width, height: img.height },
      //     });

      //     // Add the worksheet to the workbook
      //     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      //     // Save the workbook as an Excel file
      //     const excelFileName = "data-with-image.xlsx";
      //     saveAs(
      //       XLSX.write(wb, { bookType: "xlsx", type: "blob" }),
      //       excelFileName
      //     );
      //   });
      // };

      console.log("check", result);
      const exportToExcel = () => {
        // Add a new worksheet with the data
        const worksheet = XLSX.utils.aoa_to_sheet(result);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Buffer to store the generated Excel file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        saveAs(blob, "data.xlsx");
      };
      exportToExcel();
      setViewData(res?.data);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(true);
    }
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

  const fieldsData = [
    {
      id: 1,
      dateOfVisit0: moment.utc(viewData[0]?.dateOfVisit).format("DD-MM-YYYY"),
      dateOfVisit1: moment.utc(viewData[1]?.dateOfVisit).format("DD-MM-YYYY"),
      dateOfVisit2: moment.utc(viewData[2]?.dateOfVisit).format("DD-MM-YYYY"),
    },
    {
      id: 2,
      fieldsName: [viewData[0]?.responses.map((data) => data.fieldName)],
    },
  ];
  console.log("field", fieldsData);
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
            handleDownload={handleDownload}
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
    </>
  );
};

export default Users;
