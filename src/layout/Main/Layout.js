import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ width: "18%" }}>
          <Sidebar />
        </div>
        <div style={{ width: "82%" }}>
          <Navbar />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
