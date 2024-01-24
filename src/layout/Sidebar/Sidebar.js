import React from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import logo1 from "../../assets/images/CSL Logo.jpg";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DifferenceIcon from "@mui/icons-material/Difference";
import CompareIcon from "@mui/icons-material/Compare";
import FolderIcon from "@mui/icons-material/Folder";

export const sidebarListArr = [
  { label: "Team", icon: Diversity3Icon, url: "/team" },
  { label: "Property Allocation", icon: LocationCityIcon, url: "/properties" },
  {
    label: "Individual Performance",
    icon: EngineeringIcon,
    url: "/individualPerformance",
  },
  { label: "Compare", icon: CompareIcon, url: "/compare" },
  { label: "Plan", icon: DifferenceIcon, url: "/plan" },
  { label: "Project Directory", icon: FolderIcon, url: "/projectDirectory" },
  { label: "Field-Control", icon: FolderIcon, url: "/fieldControl" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("location", location.pathname);
  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <Box className={styles.main_div}>
        <Box className={styles.header_div}>
          <img src={logo1} alt="logo" className={styles.logo} />
          {/* <Typography className={styles.header_name}>HAPP NOW</Typography> */}
        </Box>

        <List className={styles.list_div}>
          {sidebarListArr.map((val, index) => (
            <div
              key={index}
              className={
                location.pathname === val?.url
                  ? styles.active_icon
                  : styles.inactive_icon
              }
            >
              <NavLink
                to={`${val.url}`}
                style={{ textDecoration: "none", color: "darkgray" }}
              >
                <ListItem
                  button
                  key={val.label}
                  // sx={location.pathname === val.url ? "lightgreen" : "white"}
                >
                  <ListItemIcon color="inherit" className={styles.icon_css}>
                    {val.icon && <val.icon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={val.label}
                    className={
                      location.pathname === val?.url
                        ? styles.active_url_text
                        : styles.inactive_url_text
                    }
                  />
                </ListItem>
              </NavLink>
            </div>
          ))}
        </List>
        <Box className={styles.logout_div}>
          <Button
            onClick={logoutHandler}
            variant="contained"
            className={styles.logout_btn}
          >
            logout
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
