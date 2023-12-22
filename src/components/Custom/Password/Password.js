import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { TextField } from "@mui/material";

const PassTextField = (props) => {
  const [type, setType] = React.useState("password");
  return (
    <TextField
      {...props}
      type={type}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setType(type === "text" ? "password" : "text")}
            >
              {type === "text" ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PassTextField;
