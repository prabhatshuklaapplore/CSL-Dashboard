/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, put } from "../../config/axios";
import { Typography, TextField } from "@mui/material";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import { deleteAPI } from "../../helper/apiCallHelper";
import { useDebouncedValue } from "../../helper/debounce";
import { toastMessage } from "../../utils/toastMessage";
import { compareTableColumns } from "../../constants/comparePage";
import moment from "moment";
import * as html2pdf from "html2pdf.js";

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

  const generateTableRow = (item, tableHeader) => {
    const trArr = [];

    Object.keys(item).map((key) => {
      const thTemp = [];
      thTemp.push(key);
      for (let z = 1; z < tableHeader.length; z++)
        thTemp.push(item[key][tableHeader[z]]);

      trArr.push(thTemp);
    });

    return trArr
      .map(
        (i) => `
      <tr style="border: 1px solid black;">
      ${i
        .map(
          (inner) =>
            `<td style="border: 1px solid black; font-weight: bold;">${inner}</td>`
        )
        .join("")}
      </tr>
      `
      )
      .join("");
  };

  const generateStatusRow = (item, tableHeader) => {
    const thArr = ["Construction Remarks"];
    for (let y = 1; y < tableHeader.length; y++) {
      const temp = item[tableHeader[y]].map((item) => item.remarks);
      thArr.push(temp);
    }

    return thArr
      .map((i, idx) => {
        if (idx === 0)
          return `<td style="border: 1px solid black; vertical-align:top !important;">
          <h6>${i}</h6>
        </td>`;

        const li = i.map((item) =>
          item === "" || typeof item === "undefined" ? null : `<li>${item}</li>`
        );

        const ul = `<ul style="padding-left: 10px">
          ${li.join("")}
        </ul>`;

        return `<td style="border: 1px solid black; vertical-align:top !important;">
          ${ul}
        </td>`;
      })
      .join("");
  };

  function getRandom(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len) return arr;
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

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

      const metadata = {};

      row.responses.map((item) => {
        metadata[item.fieldName] = item.answer;
      });

      const items = [];
      const thArr = [];
      const tableHeader = [];
      const trObj = {};
      const imgObj = {};

      Object.keys(metadata).map((key) => {
        thArr.push(key);
        metadata[key].map((item) => {
          items.push(key);
          if (typeof trObj[item.name] === "undefined") {
            trObj[item.name] = {
              [key]: item.answer,
            };
            return;
          }
          const existing = trObj[item.name];
          trObj[item.name] = {
            ...existing,
            [key]: item.answer,
          };
        });
      });

      tableHeader.push("Particulars/Work", ...thArr);

      Object.keys(metadata).map((key) => {
        imgObj[key] = [];
        metadata[key].map((item) => {
          imgObj[key] = [...imgObj[key], ...item.asset];
        });

        imgObj[key] = getRandom(imgObj[key], 4);
      });

      const element = `
      <html>
        <body style="padding:20px" >
          <div style="display: flex; justify-content: flex-end">
            <span style="text-decoration: underline; font-weight: bold">
              Date - ${moment
                .utc(res?.data[1]?.dateOfVisit)
                .format("DD-MM-YYYY")}
            </span>
          </div>
          <div style="display: flex; justify-content: center; padding-top: 10px">
            <span style="text-decoration: underline; font-weight: bold">
              (Site visit report)
            </span>
          </div>
          <div style="display: flex; justify-content: center; padding-top: 10px">
            <span style="text-decoration: underline; font-weight: bold">
              ${res?.data[0]?.name}
            </span>
          </div>
          <table
            style="
              margin: 0 auto;
              border: 1px solid black;
              border-spacing: 0;
              width: 90%;
              margin-top: 10px;"
          >
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Borrowing Entity
              </td>
              <td style="border: 1px solid black; width: 60%">${
                res?.data[0]?.property?.borrowerName
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Project
              </td>
              <td style="border: 1px solid black; width: 60%">${
                res?.data[0]?.name
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Area
              </td>
              <td style="border: 1px solid black; width: 60%">${
                res?.data[0]?.property?.area
              } Sq. Yards</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Borrowing Group
              </td>
              <td style="border: 1px solid black; width: 60%">${
                res?.data[0]?.property?.groupName
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Promoter
              </td>
              <td style="border: 1px solid black; width: 60%">${""}</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Currently Mortgaged property
              </td>
              <td style="border: 1px solid black; width: 60%">${""}</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Sanction Loan amount
              </td>
              <td style="border: 1px solid black; width: 60%">INR - ${
                res?.data[0]?.property?.loanSanctionAmount
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Disbursed
              </td>
              <td style="border: 1px solid black; width: 60%">INR - ${""}</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Principal Out Standing
              </td>
              <td style="border: 1px solid black; width: 60%">INR - ${""}</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Maturity Date
              </td>
              <td style="border: 1px solid black; width: 60%">${""}</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Sales Status
              </td>
              <td style="border: 1px solid black; width: 60%">${
                res?.data[0]?.status
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Report by
              </td>
              <td style="border: 1px solid black; width: 60%">${
                res?.data[0]?.user.fullname
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Quick visit remarks
              </td>
              <td style="border: 1px solid black; width: 60%">
                <ul style="padding-left: 10px">
                  <li>${
                    res?.data[0]?.constructRemark === ""
                      ? "N/A"
                      : res?.data[0]?.constructRemark
                  }</li>
                  <li>${
                    res?.data[0]?.constructRemark2 === ""
                      ? "N/A"
                      : res?.data[0]?.constructRemark2
                  }</li>
                  <li>${
                    res?.data[0]?.constructRemark3 === ""
                      ? "N/A"
                      : res?.data[0]?.constructRemark3
                  }</li>
                </ul>
              </td>
            </tr>
          </table>

          <div style="display: flex; justify-content: flex-start; padding-top: 10px;">
            <span>
              <h2 style="text-decoration: underline;">Construction updates:-</h2>
            </span>
          </div>
          <table
            style="
              margin: 0 auto;
              border: 1px solid black;
              border-spacing: 0;
              width: 90%;
            margin-top: 10px;"
          >
            <tr style="font-weight: bold;border: 1px solid black;">
              ${tableHeader
                .map(
                  (item) =>
                    `<th style="font-weight: nornal; border: 1px solid black;">${item}</th>`
                )
                .join("")}
            </tr>
            <tbody>
              ${generateTableRow(trObj, tableHeader)}
            </tbody>
          </table>

          <div style="display: flex; justify-content: flex-start; padding-top: 10px;">
            <span>
              <h2 style="text-decoration: underline;">Construction Status:-</h2>
            </span>
          </div>
          <table
            style="
              margin: 0 auto;
              border: 1px solid black;
              border-spacing: 0;
              width: 90%;
              margin-top: 10px;"
          >
            <tr style="font-weight: bold;border: 1px solid black;">
            ${tableHeader
              .map(
                (item) =>
                  `<th style="font-weight: nornal; border: 1px solid black;">${item}</th>`
              )
              .join("")}
            </tr>
            <tbody>
            <tr style="border: 1px solid black;">
              ${generateStatusRow(metadata, tableHeader)}
            </tr>
            </tbody>
          </table>

          <div class="html2pdf__page-break"></div>

          <table
            style="
                margin: 0 auto;
                border: 1px solid black;
                border-spacing: 0;
                width: 90%;
                margin-top: 10px;"
            >
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Location
              </td>
              <td style="border: 1px solid black; width: 60%">${
                res?.data[0]?.address
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                Location
              </td>
              <td style="border: 1px solid black; width: 60%">${
                res?.data[0]?.numberOfLabours
              }</td>
            </tr>
          </table>

          <div style="display: flex; justify-content: flex-start; padding-top: 10px">
            <span style="text-decoration: underline; font-weight: bold">
            <h2 style="text-decoration: underline;">Site Photograph:-</h2>
            </span>
          </div>
          <table
            style="
              margin: 0 auto;
              border: 1px solid black;
              border-spacing: 0;
              width: 90%;
              margin-top: 10px;"
          >
            ${Object.keys(imgObj)
              .map(
                (key) =>
                  `
                    <tr style="font-weight: bold;border: 1px solid black;">
                      <td style="border: 1px solid black; padding: 10px;">
                        ${key}
                      </td>
                      <td style="padding: 10px;">
                        <div style="display:grid; grid-template-columns: 50% 50%; grid-template-rows: auto auto; grid-gap: 10px;">
                          ${imgObj[key]
                            .map(
                              (img) =>
                                `<img style="border: 1px solid black; height: 250px; width: 250px;" src="${img}" alt="${img}" crossorigin="*" >`
                            )
                            .join("")}
                        </div>
                      </td>
                    </tr>
                  `
              )
              .join("")}
          </table>
        </body>
      </html>
      `;

      var opt = {
        margin: 0.2,
        filename: `${res?.data[0]?.name}.pdf`,
        image: { type: "jpg", quality: 0.9 },
        html2canvas: { scale: 1.5, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      const worker = html2pdf().from(element).set(opt).save();

      worker.then(() => setLoading(false));
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
