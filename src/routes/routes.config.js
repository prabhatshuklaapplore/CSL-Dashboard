// RouteConfig.js
import React from "react";
import { Routes, Route } from "react-router-dom";
// import { useAuth } from "../context/authContext";
import routes from "./routes";

const RouteConfig = () => {
  //   const { user } = useAuth(); // Access user from AuthContext

  return (
    <>
      <Routes>
        {routes.map((route, index) => {
          const { path, component, isPrivate } = route;

          if (isPrivate) {
            // If the route is private (requires authentication)
            // return user ? (
            //   <Route key={index} path={path} exact component={component} />
            // ) : (
            //   <Navigate key={index} to="/login" />
            // );
          }

          // If the route is public (accessible without authentication)
          return <Route key={index} path={path} exact element={component} />;
        })}
      </Routes>
    </>
  );
};

export default RouteConfig;
