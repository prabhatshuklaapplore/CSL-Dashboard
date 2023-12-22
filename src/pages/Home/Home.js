import React, { useState } from "react";
import Layout from "../../layout/Main/Layout";
import Graph from "../../components/Graph/Graph";
import styles from "./Home.module.css";
import MonthYearSelect from "../../components/MonthYear/MonthYearSelect";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const Home = () => {
  const currentDate = new Date();
  const initialMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const initialYear = currentDate.getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [chartType, setChartType] = useState("BAR");

  const handleMonthYearChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  console.log("sele", chartType);

  return (
    <>
      <Layout>
        <div
          style={{
            padding: "0 1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <MonthYearSelect
            onMonthYearChange={handleMonthYearChange}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
          <FormControl
            variant="outlined"
            sx={{ minWidth: 180, margin: "1rem" }}
          >
            <InputLabel htmlFor="chartType">Select Chart Type</InputLabel>
            <Select
              label="Select Chart Type"
              value={chartType}
              onChange={handleChartTypeChange}
              id="chartType"
            >
              <MenuItem value="BAR">Bar Chart</MenuItem>
              <MenuItem value="LINE">Line Chart</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div
          style={{
            border: "2px solid darkgrey",
            height: "0",
          }}
        />
        <div className={styles.main_div}>
          <div className={styles.graph_div}>
            <Graph
              title="Users Added"
              fetchData={`/admin/dashboard/user-data?month=${parseInt(
                selectedMonth
              )}&year=${parseInt(selectedYear)}`}
              chartType={chartType}
            />
          </div>
          <div className={styles.graph_div}>
            <Graph
              title="Vendors Added"
              fetchData={`/admin/dashboard/vendor-data?month=${parseInt(
                selectedMonth
              )}&year=${parseInt(selectedYear)}`}
              chartType={chartType}
            />
          </div>
          <div className={styles.graph_div}>
            <Graph
              title="Events Added"
              fetchData={`/admin/dashboard/event-data?month=${parseInt(
                selectedMonth
              )}&year=${parseInt(selectedYear)}`}
              chartType={chartType}
            />
          </div>
          <div className={styles.graph_div}>
            <Graph
              title="Venue Added"
              fetchData={`/admin/dashboard/venue-data?month=${parseInt(
                selectedMonth
              )}&year=${parseInt(selectedYear)}`}
              chartType={chartType}
            />
          </div>
          <div className={styles.graph_div}>
            <Graph
              title="Tickets Purchased"
              fetchData={`/admin/dashboard/ticket-data?month=${parseInt(
                selectedMonth
              )}&year=${parseInt(selectedYear)}`}
              chartType={chartType}
            />
          </div>
          <div className={styles.graph_div}>
            <Graph
              title="Daily User Engagement"
              fetchData={`/admin/dashboard/user-activity-data?month=${parseInt(
                selectedMonth
              )}&year=${parseInt(selectedYear)}`}
              chartType={chartType}
            />
          </div>
          <div className={styles.graph_div}>
            <Graph
              title="Daily Vendor Engagement"
              fetchData={`/admin/dashboard/vendor-activity-data?month=${parseInt(
                selectedMonth
              )}&year=${parseInt(selectedYear)}`}
              chartType={chartType}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
