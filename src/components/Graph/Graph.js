/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { get } from "../../config/axios";
import LineChart from "../Chart/LineChart/LineChart";
import BarChart from "../Chart/BarChart/BarChart";
import { Typography } from "@mui/material";

const Graph = ({ title, fetchData, chartType }) => {
  const [data, setData] = useState([]);
  // const [sixMonthdata, setsixMonthData] = useState([]);
  // const [one, setOne] = useState(true);
  const [message, setMessage] = useState("");

  const fetchChartData = async () => {
    await get(fetchData)
      .then((res) => {
        setData(res?.monthlyData);
        // setsixMonthData(res?.sixMonthData);
        setMessage(res?.message);
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    fetchChartData();
  }, [message, fetchData]);

  const monthlydata = {
    labels: data?.map((item) => item._id),
    datasets: [
      {
        // label: `Last Month (${title})`,
        data: data?.map((item) => item.count),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // const sixmonthdata = {
  //   labels: sixMonthdata?.map((item) => item._id),
  //   datasets: [
  //     {
  //       // label: "Last Six Month (Users)",
  //       data: sixMonthdata?.map((item) => item.count),
  //       fill: false,
  //       borderColor: "rgb(75, 192, 192)",
  //       tension: 0.1,
  //     },
  //   ],
  // };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <>
      <Typography
        variant="h5"
        style={{ textAlign: "center", marginBottom: "1rem" }}
      >
        {title}
      </Typography>
      {chartType === "BAR" ? (
        <BarChart data={monthlydata} options={options} title={title} />
      ) : (
        <LineChart data={monthlydata} options={options} title={title} />
      )}

      {/* <LineChart data={monthlydata} options={options} title={title} /> */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "1rem",
        }}
      >
        <Button
          onClick={() => setOne(true)}
          variant={one ? "contained" : "outlined"}
        >
          1 Month
        </Button>
        <Button
          onClick={() => setOne(false)}
          variant={one ? "outlined" : "contained"}
        >
          6 Months
        </Button>
      </div> */}
    </>
  );
};

export default Graph;
