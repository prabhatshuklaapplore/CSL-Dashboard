/* eslint-disable no-useless-escape */
import React from "react";
import styles from "./Login.module.css";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PassTextField from "../../components/Custom/Password/Password";
import { post } from "../../config/axios";

const Login = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = React.useState({
    email: false,
    password: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState("");

  const validate = () => {
    let value = true;
    let err = { email: false, password: false };
    let isEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    setFormError({ ...err });
    if (formData.password.length < 6) {
      value = false;
      err.password = "Password should be atleast 8 charactors";
    }
    if (!isEmail.test(formData.email)) {
      err.email = "Enter valid email";
      value = false;
    }
    setFormError({ ...err });
    return value;
  };

  const onSubmit = async () => {
    if (validate()) {
      setLoading(true);

      let data = { ...formData };
      await post("/dashboard/auth/login", data)
        .then((res) => {
          localStorage.setItem("token", res?.data?.token);
          setToken(res?.data?.token);
          window.location.reload();
          navigate("/team");
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.head}>CSL Admin</h1>
          </div>
          <div className={styles.loginContainer}>
            <div className={styles.loginContent}>
              <h1 className={styles.loginHead}>Sign In</h1>

              <TextField
                variant="standard"
                fullWidth
                label="Email"
                className={styles.textField}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={formError.email}
                helperText={formError.email}
              />

              <PassTextField
                variant="standard"
                fullWidth
                label="Password"
                className={styles.textField}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={formError.password}
                helperText={formError.password}
              />

              <div className={styles.flex_box}>
                {loading ? (
                  <button className={styles.signIn}>Loading...</button>
                ) : (
                  <button className={styles.signIn} onClick={onSubmit}>
                    Sign In
                  </button>
                )}

                <div className={styles.forget_button}>
                  <Link to="/forget-password">Forget Password?</Link>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.loginFooter}>&nbsp;</div>
        </div>
      </div>
    </>
  );
};

export default Login;
