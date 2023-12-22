import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get, put } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI } from "../../helper/apiCallHelper";
import { vendortableColumns } from "../../constants/vendorPage";
import { useDebouncedValue } from "../../helper/debounce";
import { toastMessage } from "../../utils/toastMessage";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(search, 2000);

  const fetchVendors = async (searchValue) => {
    await get(
      `/admin/access-management/vendors?search=${searchValue}&page=${page}&limit=${20}`
    )
      .then((res) => {
        setVendors(
          res?.data.map((item) => ({
            ...item,
            action: { edit: false, delete: true },
          }))
        );
        setPageCount(res?.totalPage);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(true);
      });
  };

  useEffect(() => {
    if (search === "") {
      fetchVendors("");
    } else if (debouncedSearch) {
      fetchVendors(debouncedSearch);
    }
  }, [search, debouncedSearch, message, page]);

  const handleEdit = (row) => {
    // Implement the edit action for the selected row
    console.log("Edit clicked for row 12:", row);
  };

  const handleDelete = (row) => {
    // Implement the delete action for the selected row
    console.log("Delete clicked for row34:", row);
    setDeleteUser(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteUser = async (row) => {
    let url = `/admin/access-management/vendor/${row._id}`;
    let response = await deleteAPI(url);
    console.log("response", response);
    setDeleteModalOpen(false);
  };

  const handleStatus = (row) => {
    // Implement the status chnage for the selected row
    console.log("Delete clicked for row34:", row);
  };

  const handleActive = async (id, active) => {
    let response = await put(`/admin/access-management/vendor/${id}`, {
      isActive: active,
    });
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
    console.log("page", page);
    setPage(page);
  };

  return (
    <Layout>
      <div style={{ padding: "1rem" }}>
        <Typography variant="h5">Vendors</Typography>
        <Searchbar
          search={handleSearch}
          placeholder={"Seach by name, email, phone number"}
          debounceTime={1000}
        />
        <CustomTable
          data={vendors}
          columns={vendortableColumns}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleStatus={handleStatus}
          handleActive={(row, active) => handleActive(row, active)}
          handlePageChange={(page) => handleChange(page)}
          pageNumber={page}
          pageCount={pageCount}
          loading={loading}
        />
      </div>
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteUser}
        data={deleteUser}
      />
    </Layout>
  );
};

export default Vendors;
