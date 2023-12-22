import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get } from "../../config/axios";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { paymenttableColumns } from "../../constants/paymentsPage";
import { useDebouncedValue } from "../../helper/debounce";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(search, 2000);

  const fetchPayments = async (searchValue) => {
    await get(
      `/admin/access-management/getPayments?search=${searchValue}&page=${page}&limit=${20}`
    )
      .then((res) => {
        setPayments(
          res?.data.map((item) => ({
            ...item,
            action: { edit: true, delete: true },
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
      fetchPayments("");
    } else if (debouncedSearch) {
      fetchPayments(debouncedSearch);
    }
  }, [search, debouncedSearch, page]);

  // const handleEdit = (row) => {
  //   console.log("Edit clicked for row 12:", row);
  // };

  const handleDelete = (row) => {
    console.log("Delete clicked for row34:", row);
    setDeleteUser(row);
    setDeleteModalOpen(true);
  };

  const handleStatus = (row) => {
    console.log("Delete clicked for row34:", row);
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

  return (
    <Layout>
      <div style={{ padding: "1rem" }}>
        <Typography variant="h5">Payments</Typography>
        <Searchbar
          search={handleSearch}
          placeholder={"Seach by name or email"}
          debounceTime={1000}
        />
        <CustomTable
          data={payments}
          columns={paymenttableColumns}
          // handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleStatus={handleStatus}
          handlePageChange={(page) => handleChange(page)}
          pageNumber={page}
          pageCount={pageCount}
          loading={loading}
        />
      </div>
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDelete}
        data={deleteUser}
      />
    </Layout>
  );
};

export default Payments;
