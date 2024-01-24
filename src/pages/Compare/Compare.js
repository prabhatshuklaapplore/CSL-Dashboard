/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, put, post, postFiles } from "../../config/axios";
import { Typography } from "@mui/material";
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
import ExcelJS from "exceljs";

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

  const handleDisplay = async (row) => {
    // Implement the edit action for the selected row
  };

  const handleDownload = async (row) => {
    try {
      setLoading(true);

      async function convertImageToBase64(url) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.height = img.naturalHeight;
            canvas.width = img.naturalWidth;
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
          };
          img.onerror = reject;
          img.src = url;
        });
      }

      const res = await get(
        `dashboard/visit/getAllVisit?propertyId=65a8f035c4d0faea193bde37`
      );
      console.log("resp", res);

      const result = [
        [
          "Property",
          "Field Name",
          "Work",
          `Status on ${moment
            .utc(res?.data[0]?.dateOfVisit)
            .format("DD-MM-YYYY")}`,
          `Status on ${moment
            .utc(res?.data[1]?.dateOfVisit)
            .format("DD-MM-YYYY")}`,
          `Status on ${moment
            .utc(res?.data[2]?.dateOfVisit)
            .format("DD-MM-YYYY")}`,
        ],
      ];

      res?.data[0]?.responses?.forEach((resp, resIndex) =>
        resp?.answer.forEach((ans, ansIndex) => {
          let row = [];
          row.push(res?.data[0]?.name);
          row.push(resp?.fieldName);
          row.push(ans?.name);
          // row.push(ans.answer);
          row.push(res?.data[0]?.responses[resIndex]?.answer[ansIndex].answer);
          // row.push(res?.data[1]?.responses[resIndex]?.answer[ansIndex].answer);
          // row.push(res?.data[2]?.responses[resIndex]?.answer[ansIndex].answer);

          res?.data[0].responses[resIndex].answer[ansIndex].asset.forEach(
            (image) => console.log(image)
          );

          result.push(row);
        })
      );
      console.log("resdata", result);

      const exportToExcel = () => {
        // Add a new worksheet with the data
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(result);
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

  // const handleExcel = async (row) => {
  //   try {
  //     setLoading(true);

  //     const res = await get(
  //       `dashboard/visit/getAllVisit?propertyId=65a8f035c4d0faea193bde37`
  //     );
  //     console.log("resp", res);
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet("Sheet 1");
  //     worksheet.addRow(["Property", "Field Name", "Work"]);
  //     res?.data.forEach(
  //       (data) =>
  //         (worksheet.getRow(1).getCell(4).value = `Date(${moment
  //           .utc(data?.dateOfVisit)
  //           .format("DD-MM-YYYY")})`)
  //     );
  //     worksheet.getRow(1).getCell(5).value = "Images";
  //     res?.data.forEach((data) =>
  //       data.responses.forEach((resp) =>
  //         resp.answer.forEach((ans, index) => {
  //           let row = [];
  //           row.push(data.name);
  //           row.push(resp.fieldName);
  //           row.push(ans.name);
  //           row.push(ans.answer);
  //           row.push(ans.asset[0]);
  //           worksheet.addRow(row);
  //         })
  //       )
  //     );

  //     workbook.xlsx.writeBuffer().then((buffer) => {
  //       const fileBlob = new Blob([buffer], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       });
  //       saveAs(fileBlob, "example_with_image.xlsx");
  //       fetchUsers("");
  //     });
  //   } catch (err) {
  //     console.error("Error:", err);
  //     setLoading(true);
  //   }
  //   console.log("Display", row);
  //   setViewData(row);
  //   setViewModal(true);
  // };

  // const handleCompare = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await get(
  //       `dashboard/visit/getAllVisit?propertyId=65a8f035c4d0faea193bde37`
  //     );
  //     console.log("resp", res);

  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet("sheet 1");
  //     worksheet.addRow([
  //       "Property",
  //       "Field Name",
  //       "Work",
  //       `Status on ${moment
  //         .utc(res?.data[0]?.dateOfVisit)
  //         .format("DD-MM-YYYY")}`,
  //       `Status on ${moment
  //         .utc(res?.data[1]?.dateOfVisit)
  //         .format("DD-MM-YYYY")}`,
  //       `Status on ${moment
  //         .utc(res?.data[2]?.dateOfVisit)
  //         .format("DD-MM-YYYY")}`,
  //     ]);

  //     async function convertImageToBase64(url) {
  //       return new Promise((resolve, reject) => {
  //         const img = new Image();
  //         img.crossOrigin = "Anonymous";
  //         img.onload = () => {
  //           const canvas = document.createElement("canvas");
  //           const ctx = canvas.getContext("2d");
  //           canvas.height = img.naturalHeight;
  //           canvas.width = img.naturalWidth;
  //           ctx.drawImage(img, 0, 0);
  //           const dataURL = canvas.toDataURL("image/png");
  //           resolve(dataURL);
  //         };
  //         img.onerror = reject;
  //         img.src = url;
  //       });
  //     }

  //     const toDataURL = (url) => {
  //       const promise = new Promise((resolve, reject) => {
  //         var xhr = new XMLHttpRequest();
  //         xhr.onload = function () {
  //           var reader = new FileReader();
  //           reader.readAsDataURL(xhr.response);
  //           reader.onloadend = function () {
  //             resolve({ base64Url: reader.result });
  //           };
  //         };
  //         xhr.open("GET", url);
  //         xhr.responseType = "blob";
  //         xhr.send();
  //       });

  //       return promise;
  //     };

  //     const promise = Promise.all(
  //       res?.data[0].responses.map((resp, resIndex) =>
  //         resp.answer.map(async (ans, ansIndex) => {
  //           let row = [];
  //           row.push(res?.data[0].name);
  //           row.push(resp.fieldName);
  //           row.push(ans.name);
  //           // row.push(ans.answer);
  //           row.push(res?.data[0]?.responses[resIndex].answer[ansIndex].answer);
  //           row.push(res?.data[1]?.responses[resIndex].answer[ansIndex].answer);
  //           row.push(res?.data[2]?.responses[resIndex].answer[ansIndex].answer);
  //           // row.push(data[0].responses[resIndex].answer[ansIndex].asset[0]);
  //           worksheet.addRow(row);
  //           const image =
  //             res?.data[0].responses[resIndex].answer[ansIndex].asset[0];

  //           // row.push(image);
  //           const result = await toDataURL(image);
  //           const imageId2 = workbook.addImage({
  //             base64: result.base64Url,
  //             extension: "jpeg",
  //           });
  //           worksheet.addImage(imageId2, {
  //             tl: { col: 8, row: 2 },
  //             ext: { width: 100, height: 100 },
  //           });

  //           // data[1].responses[resIndex].answer[ansIndex].asset.forEach((image) =>
  //           //   row.push(image)
  //           // );

  //           // row.push(ans.asset[0]);
  //           // console.log(row);
  //           // fields.push(row);
  //         })
  //       )
  //     );

  //     promise.then(() => {
  //       workbook.xlsx.writeBuffer().then((buffer) => {
  //         const fileBlob = new Blob([buffer], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });
  //         saveAs(fileBlob, "Compare.xlsx");

  //         fetchUsers("");
  //       });
  //       setLoading(false);
  //     });
  //   } catch (err) {
  //     console.error("Error:", err);
  //     setLoading(true);
  //   }
  // };

  const handleCompare = async () => {
    try {
      setLoading(true);
      const res = await get(
        `dashboard/visit/getAllVisit?propertyId=65a8f035c4d0faea193bde37`
      );

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("sheet 1");

      worksheet.columns = [
        { header: "Property", key: "property", width: 20 },
        { header: "Field Name", key: "fieldName", width: 20 },
        { header: "Work", key: "work", width: 20 },
        {
          header: `Status on ${moment
            .utc(res?.data[0]?.dateOfVisit)
            .format("DD-MM-YYYY")}`,
          key: "date1",
          width: 20,
        },
        {
          header: `Status on ${moment
            .utc(res?.data[1]?.dateOfVisit)
            .format("DD-MM-YYYY")}`,
          key: "date2",
          width: 20,
        },
        {
          header: `Status on ${moment
            .utc(res?.data[2]?.dateOfVisit)
            .format("DD-MM-YYYY")}`,
          key: "date3",
          width: 20,
        },
        { header: "Images", key: "property", width: 20 },
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      worksheet.getRow(1).height = 30;

      const toDataURL = async (url) => {
        return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest();
          xhr.onload = function () {
            var reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            reader.onloadend = function () {
              resolve({ base64Url: reader.result });
            };
          };
          xhr.onerror = reject;
          xhr.open("GET", url);
          xhr.responseType = "blob";
          xhr.send();
        });
      };

      const promise = Promise.all(
        res?.data[0].responses.map(async (resp, resIndex) =>
          Promise.all(
            resp.answer.map(async (ans, ansIndex) => {
              let row = [];
              row.push(res?.data[0].name);
              row.push(resp.fieldName);
              row.push(ans.name);
              row.push(
                res?.data[0]?.responses[resIndex].answer[ansIndex].answer
              );
              row.push(
                res?.data[1]?.responses[resIndex].answer[ansIndex].answer
              );
              row.push(
                res?.data[2]?.responses[resIndex].answer[ansIndex].answer
              );

              const addedRow = worksheet.addRow(row);
              addedRow.height = 100;

              const assets =
                res?.data[0].responses[resIndex].answer[ansIndex].asset;

              if (assets && assets.length > 0) {
                for (let i = 0; i < assets.length; i++) {
                  const asset = assets[i];
                  const result = await toDataURL(asset);
                  const imageId = workbook.addImage({
                    base64: result.base64Url,
                    extension: "jpeg",
                  });

                  // Add image and set height for the row containing the image
                  // worksheet.addImage(imageId, {
                  //   tl: { col: 6 + i * 2, row: addedRow.number },
                  //   ext: { width: 100, height: 100 },
                  // });

                  const cell = worksheet.getCell(
                    worksheet.getCell(resIndex + 2, 7 + i).address
                  );
                  cell.value = {
                    text: "Click to View Image",
                    hyperlink: asset, // You can add a hyperlink to the image if needed
                    hyperlinkTooltip: "Click to view image",
                  };
                  worksheet.addImage(imageId, {
                    tl: { col: 6 + i, row: resIndex + 1 },
                    ext: { width: 100, height: 100 },
                  });
                }

                // Set the height for the row based on the number of assets
                // addedRow.height = 100 + assets.length * 100;
                addedRow.height = 100 + assets.length * 30;
              }
            })
          )
        )
      );

      promise.then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          const fileBlob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(fileBlob, "Compare.xlsx");

          fetchUsers("");
        });
        setLoading(false);
      });
    } catch (err) {
      console.error("Error:", err);
      setLoading(true);
    }
  };

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
            handleDownload={handleCompare}
            handleActive={(row, active) => handleActive(row, active)}
            handlePageChange={(page) => handleChange(page)}
            pageNumber={page}
            pageCount={pageCount}
            loading={loading}
          />
        </div>
      </Layout>
    </>
  );
};

export default Users;
