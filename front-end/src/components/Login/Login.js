import React, { useState } from "react";
import "assets/css/login/login.css";
import LoginService from "services/LoginService";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControlLabel,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { CheckBox } from "@material-ui/icons";
import { toast } from "react-toastify";
import Snackbar from "components/Snackbar/Snackbar";
import { Link } from "react-router-dom";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [check1, setChek1] = useState(false);
  const [tl, setTl] = React.useState(false);
  const [fail, setFail] = React.useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  const [jwt, setJwt] = useState("");
  const changeUsername = (event) => {
    setUsername(event.target.value);
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };
  const test = () => {
    setChek1(!check1)
  }
  const login = (e) => {
    e.preventDefault();
    let loginRequest = { username, password };
    LoginService.login(loginRequest)
      .then((res) => {
        let token = res.data.tokenType + " " + res.data.accessToken;
        setJwt(token);
        sessionStorage.setItem("jwt", token);
        setMessageSuccess("Đăng nhập thành công");
        setTl(true);
        props.history.push("/admin/areas");
        window.location.reload();
      })
      .catch(function (error) {
        if (error.response.data.errors) {
          alert(error.response.data.errors[0].defaultMessage);
        } else {
          alert(error.response.data.message);
        }
      });
  };
  const login1 = (e) => {
    e.preventDefault();
    let loginRequest = { username, password };
    LoginService.login(loginRequest)
      .then((res) => {
        let token = res.data.tokenType + " " + res.data.accessToken;
        setJwt(token);
        sessionStorage.setItem("jwt", token);
        setMessageSuccess("Đăng nhập thành công");
        setTl(true);
        props.history.push("/admin/reports");
        window.location.reload();
      })
      .catch(function (error) {
        if (error.response.data.errors) {
          alert(error.response.data.errors[0].defaultMessage);
        } else {
          alert(error.response.data.message);
        }
      });
  };
  return (
    <>

      <Snackbar
        place="tc"
        color="success"
        message={messageSuccess}
        open={tl}
        closeNotification={() => setTl(false)}
        close
      />
      {!check1 ?
        <ThemeProvider>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Đăng nhập vào cửa hàng
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Tên đăng nhập"
                  name="Tên đăng nhập"
                  autoComplete="Tên đăng nhập"
                  onChange={changeUsername}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Mật khẩu"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={changePassword}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={login}
                >
                  Đăng nhập
                </Button>

              </Box>
              <Link onClick={test} >Đăng nhập admin</Link>
            </Box>
          </Container>
        </ThemeProvider>
        :
        <ThemeProvider>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Đăng nhập vào hệ thống cửa hàng
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Tên đăng nhập"
                  name="Tên đăng nhập"
                  autoComplete="Tên đăng nhập"
                  onChange={changeUsername}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Mật khẩu"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={changePassword}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={login1}
                >
                  Đăng nhập
                </Button>

              </Box>
              <Link onClick={test}>Đăng nhập nhân viên</Link>
            </Box>
          </Container>
        </ThemeProvider>}
    </>
  );
}
