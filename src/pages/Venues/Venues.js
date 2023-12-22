import React, { useEffect, useState } from "react";
import Layout from "../../layout/Main/Layout";
import { Typography } from "@mui/material";
import CustomTable from "../../components/Custom/Table/CustomTable";
import { get } from "../../config/axios";
import { updateAPI } from "../../helper/apiCallHelper";
import { toastMessage } from "../../utils/toastMessage";
import { venuetableColumns } from "../../constants/venuesPage";
import Searchbar from "../../components/Custom/SearchBar/Searchbar";
import { useDebouncedValue } from "../../helper/debounce";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(search, 2000);

  const fetchVenues = async (searchValue) => {
    await get(
      `/admin/access-management/venues?search=${searchValue}&page=${page}&limit=${20}`
    )
      .then((res) => {
        setVenues(
          res?.data.map((item) => ({
            ...item,
            // action: { edit: true, delete: true },
          }))
        );
        setMessage(res?.message);
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
      fetchVenues("");
    } else if (debouncedSearch) {
      fetchVenues(debouncedSearch);
    }
  }, [search, debouncedSearch, message, page]);

  const handleEdit = (row) => {
    // Implement the edit action for the selected row
    console.log("Edit clicked for row 12:", row);
  };

  const handleDelete = (row) => {
    // Implement the delete action for the selected row
    console.log("Delete clicked for row34:", row);
  };

  const handleActive = async (id, active) => {
    let updateValue = {
      isActive: active,
    };
    let response = await updateAPI(
      `/admin/access-management/venue-update/${id}`,
      updateValue
    );
    setMessage(response);
    toastMessage(response, "success");
  };

  const handleStatus = (row) => {
    // Implement the status chnage for the selected row
    console.log("Delete clicked for row34:", row);
  };
  const handleSearch = (searchText) => {
    setSearch(searchText);
  };

  const handleChange = (page) => {
    setPage(page);
  };

  return (
    <Layout>
      <div style={{ padding: "1rem" }}>
        <Typography variant="h5">Venues</Typography>
        <Searchbar
          search={handleSearch}
          placeholder={"Seach by name, category, city, country."}
          debounceTime={1000}
        />
        <CustomTable
          data={venues}
          columns={venuetableColumns}
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
    </Layout>
  );
};

export default Venues;
