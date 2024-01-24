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

      const res = await get(
        `dashboard/visit/getAllVisit?propertyId=65a8f035c4d0faea193bde37`
      );
      console.log("resp", res);

      const result = [["Property", "Field Name", "Work"]];
      res?.data.forEach((data) =>
        result[0]?.push(
          `Date(${moment.utc(data?.dateOfVisit).format("DD-MM-YYYY")})`
        )
      );
      result[0].push("Images");
      const worksheet = XLSX.utils.aoa_to_sheet(result);

      res?.data.forEach((data) =>
        data.responses.forEach((resp) =>
          resp.answer.forEach((ans, index) => {
            if (!result[index + 1]) {
              result[index + 1] = [];
            }
            let row = [];
            row.push(data.name);
            row.push(resp.fieldName);
            row.push(ans.name);
            row.push(ans.answer);
            row.push(ans.asset[0]);
            result.push(row);

            if (ans.asset && ans.asset.length > 0) {
              for (let r = 1; r < result.length; r++) {
                const cellRef = XLSX.utils.encode_cell({ r, c: 4 }); // Assuming image link is in the third column (index 2)
                XLSX.utils.sheet_set_formula(
                  worksheet,
                  cellRef,
                  `HYPERLINK("${result[r][4]}", "View Image")`
                );
              }
            }
          })
        )
      );
      console.log("resdata", result);

      const exportToExcel = () => {
        // Add a new worksheet with the data
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

  const handleExcel = async (row) => {
    try {
      setLoading(true);

      const res = await get(
        `dashboard/visit/getAllVisit?propertyId=65a8f035c4d0faea193bde37`
      );
      console.log("resp", res);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");
      worksheet.addRow(["Property", "Field Name", "Work"]);
      res?.data.forEach(
        (data) =>
          (worksheet.getRow(1).getCell(4).value = `Date(${moment
            .utc(data?.dateOfVisit)
            .format("DD-MM-YYYY")})`)
      );
      worksheet.getRow(1).getCell(5).value = "Images";
      res?.data.forEach((data) =>
        data.responses.forEach((resp) =>
          resp.answer.forEach((ans, index) => {
            let row = [];
            row.push(data.name);
            row.push(resp.fieldName);
            row.push(ans.name);
            row.push(ans.answer);
            row.push(ans.asset[0]);
            worksheet.addRow(row);
          })
        )
      );

      workbook.xlsx.writeBuffer().then((buffer) => {
        const fileBlob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(fileBlob, "example_with_image.xlsx");
        fetchUsers("");
      });
    } catch (err) {
      console.error("Error:", err);
      setLoading(true);
    }
    console.log("Display", row);
    setViewData(row);
    setViewModal(true);
  };

  const handleCompare = async () => {
    try {
      setLoading(true);
      // const res = await get(
      //   `dashboard/visit/getAllVisit?propertyId=65a8f035c4d0faea193bde37`
      // );
      // console.log("resp", res);

      const data = [
        {
          _id: "65a8f0aec4d0faea193be1d3",
          name: "CSL_UAT01",
          address: "Noida",
          dateOfVisit: "2024-01-18T12:35:42.165Z",
          type: "PLANNED",
          status: "UPCOMING",
          createdBy: "65604fba4b18ca70626dd7a0",
          user: {
            _id: "65a8f089c4d0faea193be0ad",
            employeeId: "UAT_02",
            fullname: "Sarthik",
            email: "uat@cslfinance.in",
            userType: "Field Officer",
            password:
              "$2b$10$f5uzUS/Bb2wxTtlhpUnPVOHr271EOsD.xu6MZMsomWVRNmoY/IEcS",
            address: "Ghaziabad",
            phone: 8377976048,
            active: true,
            supervisor: [],
            createdAt: "2024-01-18T09:34:01.988Z",
            updatedAt: "2024-01-19T07:15:30.926Z",
            __v: 0,
            fcm_key:
              "dd7iD-qTQGyI0RHg7U0aef:APA91bETEe78HJo2KtuhKtluBvMPdpKzFJIc96NhzfFEe29P9jNDgefiLWPrhWlUqQU8Ps3AJzxZ69Bn2QLNbAVGDJC28TsVNMW3MXjOeMKLDBa3AHJw35v-VO-PUXMy12T835fdX5Ke",
            checkedIn: true,
          },
          property: {
            _id: "65a8f035c4d0faea193bde37",
            name: "CSL_UAT01",
            address: "Noida",
            area: 3997,
            groupName: "CSL Construction",
            borrowerName: "Mr. Kesarwani",
            projectZone: "South Delhi",
            projectCost: 10000000,
            loanSanctionAmount: 5000000,
            loadPOS: 45,
            images: [],
            createdBy: "65604fba4b18ca70626dd7a0",
            propertyType: "65a8ef9ac4d0faea193bdcdf",
            active: true,
            createdAt: "2024-01-18T09:32:37.195Z",
            updatedAt: "2024-01-18T09:32:37.195Z",
            __v: 0,
          },
          responses: [
            {
              fieldName: "Facade",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Facade",
                  answer: "started",
                  remarks: "ok",
                  asset: [
                    "https://petrepublicdev.s3.ap-south-1.amazonaws.com/public/04udd04uddscaled_1000047111.jpg",
                    "https://petrepublicdev.s2.ap-south-1.amazonaws.com/public/04udd04uddscaled_1000047111.jpg",
                  ],
                  _id: "65a91b1f34609d1cf848cd1c",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd1b",
            },
            {
              fieldName: "Structure",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "Not Started",
                  remarks: "yes ok",
                  asset: [
                    "https://petrepublicdev.s3.ap-south-1.amazonaws.com/public/hywkphywkpscaled_5e9f314d-62cf-4fa1-87f2-98f2f58c277b270139765941623497.jpg",
                  ],
                  _id: "65a91b1f34609d1cf848cd1e",
                },
                {
                  name: "Stilt",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd1f",
                },
                {
                  name: "First Floor",
                  answer: "Not started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd20",
                },
                {
                  name: "Second Floor",
                  answer: "WIP",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd21",
                },
                {
                  name: "Third Floor",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd22",
                },
                {
                  name: "Fourth Floor",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd23",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd1d",
            },
            {
              fieldName: "Internal Plaster",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd25",
                },
                {
                  name: "Stilt",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd26",
                },
                {
                  name: "First Floor",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd27",
                },
                {
                  name: "Second Floor",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd28",
                },
                {
                  name: "Third Floor",
                  answer: "WIP",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd29",
                },
                {
                  name: "Fourth Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2a",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd24",
            },
            {
              fieldName: "Outer Plaster",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2c",
                },
                {
                  name: "Stilt",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2d",
                },
                {
                  name: "First Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2e",
                },
                {
                  name: "Second Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2f",
                },
                {
                  name: "Third Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd30",
                },
                {
                  name: "Fourth Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd31",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd2b",
            },
            {
              fieldName: "Electric Conduct",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd33",
                },
                {
                  name: "Stilt",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd34",
                },
                {
                  name: "First Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd35",
                },
                {
                  name: "Second Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd36",
                },
                {
                  name: "Third Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd37",
                },
                {
                  name: "Fourth Floor",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd38",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd32",
            },
            {
              fieldName: "Plumbing ",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3a",
                },
                {
                  name: "Stilt",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3b",
                },
                {
                  name: "First Floor",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3c",
                },
                {
                  name: "Second Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3d",
                },
                {
                  name: "Third Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3e",
                },
                {
                  name: "Fourth Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3f",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd39",
            },
            {
              fieldName: "Terrace",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Terrace",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd41",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd40",
            },
          ],
          isDraft: true,
          active: true,
          createdAt: "2024-01-18T09:34:38.020Z",
          updatedAt: "2024-01-18T12:35:43.069Z",
          __v: 0,
          completedVisit: false,
          constructRemark: "",
          constructRemark2: "",
          constructRemark3: "",
        },
        {
          _id: "65a8f0aec4d0faea193be1d3",
          name: "CSL_UAT01",
          address: "Noida",
          dateOfVisit: "2024-01-19T12:35:42.165Z",
          type: "PLANNED",
          status: "UPCOMING",
          createdBy: "65604fba4b18ca70626dd7a0",
          user: {
            _id: "65a8f089c4d0faea193be0ad",
            employeeId: "UAT_02",
            fullname: "Sarthik",
            email: "uat@cslfinance.in",
            userType: "Field Officer",
            password:
              "$2b$10$f5uzUS/Bb2wxTtlhpUnPVOHr271EOsD.xu6MZMsomWVRNmoY/IEcS",
            address: "Ghaziabad",
            phone: 8377976048,
            active: true,
            supervisor: [],
            createdAt: "2024-01-18T09:34:01.988Z",
            updatedAt: "2024-01-19T07:15:30.926Z",
            __v: 0,
            fcm_key:
              "dd7iD-qTQGyI0RHg7U0aef:APA91bETEe78HJo2KtuhKtluBvMPdpKzFJIc96NhzfFEe29P9jNDgefiLWPrhWlUqQU8Ps3AJzxZ69Bn2QLNbAVGDJC28TsVNMW3MXjOeMKLDBa3AHJw35v-VO-PUXMy12T835fdX5Ke",
            checkedIn: true,
          },
          property: {
            _id: "65a8f035c4d0faea193bde37",
            name: "CSL_UAT01",
            address: "Noida",
            area: 3997,
            groupName: "CSL Construction",
            borrowerName: "Mr. Kesarwani",
            projectZone: "South Delhi",
            projectCost: 10000000,
            loanSanctionAmount: 5000000,
            loadPOS: 45,
            images: [],
            createdBy: "65604fba4b18ca70626dd7a0",
            propertyType: "65a8ef9ac4d0faea193bdcdf",
            active: true,
            createdAt: "2024-01-18T09:32:37.195Z",
            updatedAt: "2024-01-18T09:32:37.195Z",
            __v: 0,
          },
          responses: [
            {
              fieldName: "Facade",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Facade",
                  answer: "pending",
                  remarks: "ok",
                  asset: [
                    "https://petrepublicdev.s3.ap-south-1.amazonaws.com/public/04udd04uddscaled_1000047111.jpg",
                  ],
                  _id: "65a91b1f34609d1cf848cd1c",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd1b",
            },
            {
              fieldName: "Structure",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "Not Started",
                  remarks: "yes ok",
                  asset: [
                    "https://petrepublicdev.s3.ap-south-1.amazonaws.com/public/hywkphywkpscaled_5e9f314d-62cf-4fa1-87f2-98f2f58c277b270139765941623497.jpg",
                  ],
                  _id: "65a91b1f34609d1cf848cd1e",
                },
                {
                  name: "Stilt",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd1f",
                },
                {
                  name: "First Floor",
                  answer: "Not started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd20",
                },
                {
                  name: "Second Floor",
                  answer: "WIP",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd21",
                },
                {
                  name: "Third Floor",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd22",
                },
                {
                  name: "Fourth Floor",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd23",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd1d",
            },
            {
              fieldName: "Internal Plaster",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd25",
                },
                {
                  name: "Stilt",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd26",
                },
                {
                  name: "First Floor",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd27",
                },
                {
                  name: "Second Floor",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd28",
                },
                {
                  name: "Third Floor",
                  answer: "WIP",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd29",
                },
                {
                  name: "Fourth Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2a",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd24",
            },
            {
              fieldName: "Outer Plaster",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2c",
                },
                {
                  name: "Stilt",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2d",
                },
                {
                  name: "First Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2e",
                },
                {
                  name: "Second Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2f",
                },
                {
                  name: "Third Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd30",
                },
                {
                  name: "Fourth Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd31",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd2b",
            },
            {
              fieldName: "Electric Conduct",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd33",
                },
                {
                  name: "Stilt",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd34",
                },
                {
                  name: "First Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd35",
                },
                {
                  name: "Second Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd36",
                },
                {
                  name: "Third Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd37",
                },
                {
                  name: "Fourth Floor",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd38",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd32",
            },
            {
              fieldName: "Plumbing ",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3a",
                },
                {
                  name: "Stilt",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3b",
                },
                {
                  name: "First Floor",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3c",
                },
                {
                  name: "Second Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3d",
                },
                {
                  name: "Third Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3e",
                },
                {
                  name: "Fourth Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3f",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd39",
            },
            {
              fieldName: "Terrace",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Terrace",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd41",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd40",
            },
          ],
          isDraft: true,
          active: true,
          createdAt: "2024-01-18T09:34:38.020Z",
          updatedAt: "2024-01-18T12:35:43.069Z",
          __v: 0,
          completedVisit: false,
          constructRemark: "",
          constructRemark2: "",
          constructRemark3: "",
        },
        {
          _id: "65a8f0aec4d0faea193be1d3",
          name: "CSL_UAT01",
          address: "Noida",
          dateOfVisit: "2024-01-20T12:35:42.165Z",
          type: "PLANNED",
          status: "UPCOMING",
          createdBy: "65604fba4b18ca70626dd7a0",
          user: {
            _id: "65a8f089c4d0faea193be0ad",
            employeeId: "UAT_02",
            fullname: "Sarthik",
            email: "uat@cslfinance.in",
            userType: "Field Officer",
            password:
              "$2b$10$f5uzUS/Bb2wxTtlhpUnPVOHr271EOsD.xu6MZMsomWVRNmoY/IEcS",
            address: "Ghaziabad",
            phone: 8377976048,
            active: true,
            supervisor: [],
            createdAt: "2024-01-18T09:34:01.988Z",
            updatedAt: "2024-01-19T07:15:30.926Z",
            __v: 0,
            fcm_key:
              "dd7iD-qTQGyI0RHg7U0aef:APA91bETEe78HJo2KtuhKtluBvMPdpKzFJIc96NhzfFEe29P9jNDgefiLWPrhWlUqQU8Ps3AJzxZ69Bn2QLNbAVGDJC28TsVNMW3MXjOeMKLDBa3AHJw35v-VO-PUXMy12T835fdX5Ke",
            checkedIn: true,
          },
          property: {
            _id: "65a8f035c4d0faea193bde37",
            name: "CSL_UAT01",
            address: "Noida",
            area: 3997,
            groupName: "CSL Construction",
            borrowerName: "Mr. Kesarwani",
            projectZone: "South Delhi",
            projectCost: 10000000,
            loanSanctionAmount: 5000000,
            loadPOS: 45,
            images: [],
            createdBy: "65604fba4b18ca70626dd7a0",
            propertyType: "65a8ef9ac4d0faea193bdcdf",
            active: true,
            createdAt: "2024-01-18T09:32:37.195Z",
            updatedAt: "2024-01-18T09:32:37.195Z",
            __v: 0,
          },
          responses: [
            {
              fieldName: "Facade",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Facade",
                  answer: "Completed",
                  remarks: "ok",
                  asset: [
                    "https://petrepublicdev.s3.ap-south-1.amazonaws.com/public/04udd04uddscaled_1000047111.jpg",
                  ],
                  _id: "65a91b1f34609d1cf848cd1c",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd1b",
            },
            {
              fieldName: "Structure",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "Not Started",
                  remarks: "yes ok",
                  asset: [
                    "https://petrepublicdev.s3.ap-south-1.amazonaws.com/public/hywkphywkpscaled_5e9f314d-62cf-4fa1-87f2-98f2f58c277b270139765941623497.jpg",
                  ],
                  _id: "65a91b1f34609d1cf848cd1e",
                },
                {
                  name: "Stilt",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd1f",
                },
                {
                  name: "First Floor",
                  answer: "Not started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd20",
                },
                {
                  name: "Second Floor",
                  answer: "WIP",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd21",
                },
                {
                  name: "Third Floor",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd22",
                },
                {
                  name: "Fourth Floor",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd23",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd1d",
            },
            {
              fieldName: "Internal Plaster",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd25",
                },
                {
                  name: "Stilt",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd26",
                },
                {
                  name: "First Floor",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd27",
                },
                {
                  name: "Second Floor",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd28",
                },
                {
                  name: "Third Floor",
                  answer: "WIP",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd29",
                },
                {
                  name: "Fourth Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2a",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd24",
            },
            {
              fieldName: "Outer Plaster",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2c",
                },
                {
                  name: "Stilt",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2d",
                },
                {
                  name: "First Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2e",
                },
                {
                  name: "Second Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd2f",
                },
                {
                  name: "Third Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd30",
                },
                {
                  name: "Fourth Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd31",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd2b",
            },
            {
              fieldName: "Electric Conduct",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd33",
                },
                {
                  name: "Stilt",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd34",
                },
                {
                  name: "First Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd35",
                },
                {
                  name: "Second Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd36",
                },
                {
                  name: "Third Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd37",
                },
                {
                  name: "Fourth Floor",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd38",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd32",
            },
            {
              fieldName: "Plumbing ",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Basement",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3a",
                },
                {
                  name: "Stilt",
                  answer: "Not Started",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3b",
                },
                {
                  name: "First Floor",
                  answer: "Completed",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3c",
                },
                {
                  name: "Second Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3d",
                },
                {
                  name: "Third Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3e",
                },
                {
                  name: "Fourth Floor",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd3f",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd39",
            },
            {
              fieldName: "Terrace",
              subHeadingName: "TOBESUBMITTED",
              answer: [
                {
                  name: "Terrace",
                  answer: "",
                  remarks: "",
                  asset: [],
                  _id: "65a91b1f34609d1cf848cd41",
                },
              ],
              status: "PENDING",
              _id: "65a91b1f34609d1cf848cd40",
            },
          ],
          isDraft: true,
          active: true,
          createdAt: "2024-01-18T09:34:38.020Z",
          updatedAt: "2024-01-18T12:35:43.069Z",
          __v: 0,
          completedVisit: false,
          constructRemark: "",
          constructRemark2: "",
          constructRemark3: "",
        },
      ];

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("sheet 1");
      worksheet.addRow([
        "Property",
        "Field Name",
        "Work",
        `Status on ${moment.utc(data[0]?.dateOfVisit).format("DD-MM-YYYY")}`,
        `Status on ${moment.utc(data[1]?.dateOfVisit).format("DD-MM-YYYY")}`,
        `Status on ${moment.utc(data[2]?.dateOfVisit).format("DD-MM-YYYY")}`,
      ]);
      let fields = [];
      data[0].responses.forEach((resp, resIndex) =>
        resp.answer.forEach((ans, ansIndex) => {
          let row = [];
          row.push(data[0].name);
          row.push(resp.fieldName);
          row.push(ans.name);
          // row.push(ans.answer);
          row.push(data[0].responses[resIndex].answer[ansIndex].answer);
          row.push(data[1].responses[resIndex].answer[ansIndex].answer);
          row.push(data[2].responses[resIndex].answer[ansIndex].answer);

          data[0].responses[resIndex].answer[ansIndex].asset.forEach((image) =>
            row.push(image)
          );

          data[1].responses[resIndex].answer[ansIndex].asset.forEach((image) =>
            row.push(image)
          );

          data[1].responses[resIndex].answer[ansIndex].asset.forEach((image) =>
            row.push(image)
          );

          // row.push(ans.asset[0]);
          // console.log(row);
          fields.push(row);
          worksheet.addRow(row);
        })
      );
      console.log("fields", fields);
      workbook.xlsx.writeBuffer().then((buffer) => {
        const fileBlob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(fileBlob, "Compare.xlsx");
        fetchUsers("");
      });
      setLoading(false);
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
