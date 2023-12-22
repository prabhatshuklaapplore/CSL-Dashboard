import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const MonthYearSelect = ({
  onMonthYearChange,
  selectedMonth,
  selectedYear,
}) => {
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create an array of 5 years (2 years back, current year, 2 years forward)
  const years = Array.from(
    { length: 5 },
    (_, index) => currentYear - 2 + index
  );

  const handleMonthChange = (event) => {
    onMonthYearChange(event.target.value, selectedYear);
  };

  const handleYearChange = (event) => {
    onMonthYearChange(selectedMonth, event.target.value);
  };

  return (
    <div>
      <FormControl variant="outlined" sx={{ minWidth: 120, margin: "1rem" }}>
        <InputLabel htmlFor="month">Select Month</InputLabel>
        <Select
          label="Select Month"
          value={selectedMonth}
          onChange={handleMonthChange}
          id="month"
        >
          {months.map((month, index) => (
            <MenuItem key={index} value={index + 1}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" sx={{ minWidth: 120, margin: "1rem" }}>
        <InputLabel htmlFor="year">Select Year</InputLabel>
        <Select
          label="Select Year"
          value={selectedYear}
          onChange={handleYearChange}
          id="year"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MonthYearSelect;
