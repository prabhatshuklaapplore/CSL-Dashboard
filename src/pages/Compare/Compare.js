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
            `<td style="border: 1px solid black; padding: 1px;">${inner}</td>`
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
          return `<td style="border: 1px solid black; vertical-align:top !important; padding: 2px;">
          <span>${i}</span>
        </td>`;

        return `<td style="border: 1px solid black; vertical-align:top !important; padding: 2px;">
          <ul style="padding: 2px 15px 2px 15px;">${i[0]
            .split(".")
            .map((li) => (li.trim().length ? `<li>${li}</li>` : null))
            .join("")}</ul>
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

  function parseAnswer(answer) {
    if (answer.trim().toLowerCase() === "completed") return "Done";
    if (
      answer.trim().toLowerCase() === "" ||
      answer.trim().toLowerCase() === "not started"
    )
      return "-";

    return answer;
  }

  const handleDownload = async (row) => {
    console.log("row", row);
    const res = await get(
      `dashboard/visit/getLocationImage?long=${row?.location?.longitude}&lat=${row?.location?.latitude}`
    );
    try {
      setLoading(true);

      const metadata = {};

      row.responses.map((item) => {
        metadata[item.fieldName] = item.answer;
      });

      const items = [];
      const thArr = [];
      const tableHeader = [];
      const tableHeaderOne = [];
      const tableHeaderTwo = [];
      const tableHeaderOneTrObj = {};
      const trObj = {};
      const imgObj = {};

      Object.keys(metadata).map((key) => {
        thArr.push(key);
        metadata[key].map((item) => {
          items.push(key);
          if (typeof trObj[item.name] === "undefined") {
            trObj[item.name] = {
              [key]: parseAnswer(item.answer),
            };
            return;
          }
          const existing = trObj[item.name];
          trObj[item.name] = {
            ...existing,
            [key]: parseAnswer(item.answer),
          };
        });
      });

      Object.keys(trObj).map((trKey) => {
        if (
          Object.keys(trObj[trKey]).includes("Facade") ||
          Object.keys(trObj[trKey]).includes("Terrace")
        )
          tableHeaderOneTrObj[trKey] = trObj[trKey];
      });

      tableHeaderOne.push(
        "Particulars/Work",
        thArr[0],
        thArr[thArr.length - 1]
      );

      tableHeaderTwo.push("Particulars/Work");
      thArr.map((item, i) => {
        if (i && i < thArr.length - 2) tableHeaderTwo.push(item);
      });

      tableHeader.push("Particulars/Work", ...thArr);

      Object.keys(trObj).map((key) => {
        thArr.map((th) => {
          if (typeof trObj[key][th] === "undefined") trObj[key][th] = "-";
        });
      });

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
              Date - ${moment.utc(row?.dateOfVisit).format("DD-MM-YYYY")}
            </span>
          </div>
          <div style="display: flex; justify-content: center; padding-top: 10px">
            <span style="text-decoration: underline; font-weight: bold">
              (Site visit report)
            </span>
          </div>
          <div style="display: flex; justify-content: center; padding-top: 10px">
            <span style="text-decoration: underline; font-weight: bold">
              ${row?.name}
            </span>
          </div>
          <table
            style="
              border: 1px solid black;
              border-spacing: 0;
              width: 90%;
              margin-top: 10px;"
          >
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Borrowing Entity
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">${
                row?.property?.borrowerName
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Project
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">${
                row?.name
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Area
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">${
                row?.property?.area
              } Sq. Yards</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Borrowing Group
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">${
                row?.property?.groupName
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Promoter
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">${
                row?.property?.promotorName
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Currently Mortgaged property
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">${
                row?.property?.currentlyMortgagedProperty
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Sanction Loan amount
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">INR - ${
                row?.property?.loanSanctionAmount
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Disbursed
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">INR - ${""}</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Principal Out Standing
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">INR - ${""}</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Maturity Date
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">${moment
                .utc(row?.property?.maturityDate)
                .format("DD-MM-YYYY")}</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Sales Status
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">${
                row?.status
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Report by
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">${
                row?.user.fullname
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%; padding: 2px;">
                Quick visit remarks
              </td>
              <td style="border: 1px solid black; width: 60%; padding: 2px;">
                <span>
                  ${
                    row?.constructRemark3 === "" ? "N/A" : row?.constructRemark3
                  }
                </span>
              </td>
            </tr>
          </table>

          <div class="html2pdf__page-break"></div>

          <div style="display: flex; justify-content: flex-start; padding-top: 10px;">
            <span>
              <h3 style="text-decoration: underline;">Construction updates:-</h3>
            </span>
          </div>
          <table
            style="
              border: 1px solid black;
              border-spacing: 0;
              width: 90%;
              margin-top: 10px;"
          >
            <tr style="font-weight: bold; border: 1px solid black;">
              ${tableHeaderOne
                .map(
                  (item) =>
                    `<th style="font-weight: nornal; border: 1px solid black; padding: 2px;">${item}</th>`
                )
                .join("")}
            </tr>
            <tbody>
              ${generateTableRow(tableHeaderOneTrObj, tableHeaderOne)}
              <tr style="border: 1px solid black;">
              ${generateStatusRow(metadata, tableHeaderOne)}
              </tr>
            </tbody>
          </table>

          <table
            style="
              border: 1px solid black;
              border-spacing: 0;
              width: 90%;
            margin-top: 10px;"
          >
            <tr style="font-weight: bold;border: 1px solid black;">
              ${tableHeaderTwo
                .map(
                  (item) =>
                    `<th style="font-weight: nornal; border: 1px solid black; padding: 2px;">${item}</th>`
                )
                .join("")}
            </tr>
            <tbody>
              ${generateTableRow(trObj, tableHeaderTwo)}
            </tbody>
          </table>

          <div class="html2pdf__page-break"></div>

          <div style="display: flex; justify-content: flex-start; padding-top: 10px;">
            <span>
              <h3 style="text-decoration: underline;">Construction Status:-</h3>
            </span>
          </div>
          <table
            style="
              border: 1px solid black;
              border-spacing: 0;
              width: 90%;
              margin-top: 10px;"
          >
            <tr style="font-weight: bold;border: 1px solid black;">
            ${tableHeaderTwo
              .map(
                (item) =>
                  `<th style="font-weight: nornal; border: 1px solid black; padding: 2px;">${item}</th>`
              )
              .join("")}
            </tr>
            <tbody>
            <tr style="border: 1px solid black;">
              ${generateStatusRow(metadata, tableHeaderTwo)}
            </tr>
            </tbody>
          </table>

          <div class="html2pdf__page-break"></div>

          <table
            style="
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
                row?.address
              }</td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                GeoTag
              </td>
              <td style="border: 1px solid black; width: 60%">
                <img height="300" width="500" src="${res.data}">
              </td>
            </tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black; font-weight: bold; width: 40%">
                No. of Labours
              </td>
              <td style="border: 1px solid black; width: 60%">${
                row?.constructRemark2
              }</td>
            </tr>
          </table>

          <div class="html2pdf__page-break"></div>

          <div style="display: flex; justify-content: flex-start; padding-top: 10px">
            <span style="text-decoration: underline; font-weight: bold">
            <h3 style="text-decoration: underline;">Site Photograph:-</h3>
            </span>
          </div>
          <div>
            ${Object.keys(imgObj)
              .map(
                (key, i) =>
                  `
                    <div style="display: flex; margin-top:5px">
                      <div style="border: 1px solid black; padding-left: 5px; width: 20%; display: flex; align-items: center;">
                        ${key}
                      </div>
                      <div style="border: 1px solid black; width: 80%;">
                        <div style="display:grid; grid-template-columns: 50% 50%; grid-template-rows: auto auto; grid-gap: 10px; margin-left: 80px; padding: 10px 0px 10px 0px;">
                          ${imgObj[key]
                            .map(
                              (img) =>
                                `<img style="border: 1px solid black; height: 250px; width: 250px;" src="${img}" alt="${img}" crossorigin="*" >`
                            )
                            .join("")}
                        </div>
                      </div>
                    </div>
                    <div class="html2pdf__page-break"></div>`
              )
              .join("")}
          </div>
        </body>
      </html>
      `;

      var opt = {
        margin: 0.5,
        filename: `${row?.name}.pdf`,
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
