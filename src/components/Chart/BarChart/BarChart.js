import React from "react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as Chartjs,
  LineElement,
  LinearScale,
  BarElement,
  PointElement,
  Legend,
} from "chart.js";

Chartjs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Legend
);

const BarChart = ({ data, options, title }) => {
  return (
    <>
      <Bar data={data}> options={options}</Bar>
      {/* <h4>{title}</h4> */}
    </>
  );
};

export default BarChart;
