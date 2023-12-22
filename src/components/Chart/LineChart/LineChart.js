import React from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as Chartjs,
  LineElement,
  LinearScale,
  PointElement,
  Legend,
} from "chart.js";

Chartjs.register(LineElement, CategoryScale, LinearScale, PointElement, Legend);

const LineChart = ({ data, options, title }) => {
  return (
    <>
      <Line data={data}> options={options}</Line>
      {/* <h4>{title}</h4> */}
    </>
  );
};

export default LineChart;
