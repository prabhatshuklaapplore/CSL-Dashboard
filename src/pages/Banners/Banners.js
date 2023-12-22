/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get } from "../../config/axios";
import DeleteModal from "../../components/Custom/DeleteModal/DeleteModal";
import { deleteAPI, patchAPI } from "../../helper/apiCallHelper";
import { toastMessage } from "../../utils/toastMessage";
import { bannertableColumns } from "../../constants/bannersPage";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  const fetchBanners = async () => {
    await get(`/admin/access-management/getcarousel?page=${page}&limit=${20}`)
      .then((res) => {
        console.log("res", res);
        setBanners(
          res?.data.map((item) => ({
            ...item,
            action: { edit: false, delete: true },
          }))
        );
        setPageCount(res?.totalPage);
        setMessage(res?.message);
        setLoading(false);
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    fetchBanners();
  }, [message, page]);

  const handleDelete = (row) => {
    setDeleteUser(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteBanner = async (row) => {
    let url = `/admin/access-management/deletecarousel/${row._id}?vendorId=${row.bookings.vendorId}&banner=${row.bookings.banner}`;
    let response = await deleteAPI(url);
    toastMessage(response, "success");
    setMessage(response);
    setDeleteModalOpen(false);
  };

  const handleActive = async (id, active) => {
    let updateValue = {
      _id: id,
      isActive: active,
    };
    let response = await patchAPI(
      `/admin/access-management/updatecarousel`,
      updateValue
    );
    console.log("response", response);
    setMessage(response);
    toastMessage(response, "success");
  };

  const handleStatus = (row) => {
    console.log("Delete clicked for row34:", row);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleChange = (page) => {
    setPage(page);
  };

  return (
    <>
      <Layout>
        <div style={{ padding: "1rem" }}>
          <Typography variant="h5">Banners</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "40%" }}></div>
          </div>
          <CustomTable
            data={banners}
            columns={bannertableColumns}
            // handleEdit={(row) => openModal("edit", row)}
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
          onDelete={handleDeleteBanner}
          data={deleteUser}
        />
      </Layout>
      {/* <FormModal
        isOpen={isModalOpen || editModal}
        onClose={() => closeModal(editModal ? "edit" : "add")}
        onSubmit={handleSubmit}
        fields={formFields}
        header={editModal ? "Edit Banner" : "Add Banner"}
        initialData={editData}
        isEditing={editModal}
      /> */}
    </>
  );
};

export default Banners;
