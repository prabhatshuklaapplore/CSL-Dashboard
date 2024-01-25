/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, put, post, postFiles } from "../../config/axios";
import { Typography, TextField } from "@mui/material";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import { deleteAPI } from "../../helper/apiCallHelper";
import { useDebouncedValue } from "../../helper/debounce";
import { toastMessage } from "../../utils/toastMessage";
import { compareTableColumns } from "../../constants/comparePage";
import moment from "moment";
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
  const [date, setDate] = useState();

  const fetchUsers = async (searchValue, date = "") => {
    console.log(date);
    try {
      setLoading(true);
      const res = await get(
        `dashboard/visit/getAllVisit?page=${page}&limit=${10}&search=${searchValue}&date=${date}`
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
  const handleDateChange = (event) => {
    if (!event.target.value) {
      fetchUsers("");
    } else {
      const date = new Date(event.target.value);
      const isoString = date?.toISOString();
      console.log("iso", isoString);
      fetchUsers(search, isoString);
    }

    // if (isoString) {
    //   fetchUsers("", isoString);
    // } else {
    //   fetchUsers("");
    // }
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
    console.log("row", row);
    try {
      setLoading(true);
      const res = await get(
        `/dashboard/visit/getAllVisit?propertyId=${row?.property?._id}`
      );
      console.log("resp", res);
      if (res.data.length < 1) {
        throw new Error("no data found");
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("sheet 1");

      worksheet.columns = [
        { header: "Property", key: "property", width: 20 },
        { header: "Field Name", key: "fieldName", width: 20 },
        { header: "Work", key: "work", width: 20 },
        {
          header: res?.data[0]?.dateOfVisit
            ? `Status on ${moment
                .utc(res?.data[0]?.dateOfVisit)
                .format("DD-MM-YYYY")}`
            : "-",
          key: "date1",
          width: 20,
        },
        {
          header: res?.data[1]?.dateOfVisit
            ? `Status on ${moment
                .utc(res?.data[1]?.dateOfVisit)
                .format("DD-MM-YYYY")}`
            : "-",
          key: "date2",
          width: 20,
        },
        {
          header: res?.data[2]?.dateOfVisit
            ? `Status on ${moment
                .utc(res?.data[2]?.dateOfVisit)
                .format("DD-MM-YYYY")}`
            : "-",
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
        res?.data[0]?.responses?.map(async (resp, resIndex) =>
          Promise.all(
            resp?.answer?.map(async (ans, ansIndex) => {
              let row = [];
              row.push(res?.data[0]?.name);
              row.push(resp?.fieldName);
              row.push(ans?.name);
              row.push(
                res?.data[0]?.responses[resIndex]?.answer[ansIndex]?.answer
              );
              row.push(
                res?.data[1]?.responses[resIndex]?.answer[ansIndex]?.answer
              );
              row.push(
                res?.data[2]?.responses[resIndex]?.answer[ansIndex]?.answer
              );

              const addedRow = worksheet.addRow(row);
              addedRow.height = 100;

              const assets =
                res?.data[0]?.responses[resIndex]?.answer[ansIndex]?.asset;

              if (assets && assets.length > 0) {
                for (let i = 0; i < assets.length; i++) {
                  const asset = assets[i];
                  const result = await toDataURL(asset);
                  const imageId = workbook.addImage({
                    base64: result.base64Url,
                    extension: "jpeg",
                  });

                  // worksheet.addImage(imageId, {
                  //   tl: { col: 6 + i * 2, row: addedRow.number },
                  //   ext: { width: 100, height: 100 },
                  // });

                  const cell = worksheet.getCell(
                    worksheet.getCell(resIndex + 2, 7 + i).address
                  );
                  cell.value = {
                    text: "Click to View Image",
                    hyperlink: asset,
                    hyperlinkTooltip: "Click to view image",
                  };
                  worksheet.addImage(imageId, {
                    tl: { col: 6 + i, row: resIndex + 1 },
                    ext: { width: 100, height: 100 },
                  });
                }
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
      setLoading(false);
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
            <TextField
              type="date"
              id="date"
              name="enter date"
              // value={""}
              onChange={(event) => handleDateChange(event)}
            />
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
    </>
  );
};

export default Users;
