import React, { Component } from "react";
import "./LoginAdmin.css";
import axios from "axios";
import toastr from "toastr";
import sha256 from "crypto-js/sha256";

const URL = "http://localhost:9091/api";

class LoginAdmin extends Component {
  state = {
    userName: "",
    password: ""
  };

  loginAuth = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  afterLogin = path => {
    this.props.history.push(path);
  };

  adminLogin = e => {
    e.preventDefault();
    axios
      .post(`${URL}/admin/login`, {
        userName: this.state.userName,
        password: this.state.password
      })
      .then(res => {
        if (res.data.message === "Login Successful.") {
          toastr.success(res.data.message);
          let tokenId = this.parseJwt(res.data.accessToken);
          console.log("tokenId", tokenId);
          localStorage.setItem("jwtToken", res.data.accessToken);
          localStorage.setItem("adminId", tokenId.admin.adminId);
          return this.afterLogin(`/home`);
        } else {
          toastr.error(res.data.message);
          return this.afterLogin("/adminLogin");
        }
      })
      .catch(err => {
        toastr.error("Username and password are required ");
      });
  };

  parseJwt = token => {
    if (!token) {
      return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  render() {
    return (
      <div>
        <div className="">
          <div className="row">
            <div className="col-6" style={{ backgroundColor: "#eaeff8" }}>
              <div className="cardClass card">
                <div className="card-header">Admin Login</div>

                <form
                  onSubmit={e => {
                    this.adminLogin(e);
                  }}
                  method={this.props.method}
                >
                  <div className="marginal">
                    User Name
                    <input
                      style={{ width: "45%" }}
                      autoComplete="username"
                      className="inputClass"
                      name="userName"
                      value={this.state.userName}
                      onChange={this.loginAuth}
                      type="text"
                      placeholder="UserName"
                    ></input>
                  </div>
                  <div className="marginal">
                    Password
                    <input
                      type="password"
                      value={this.state.password}
                      autoComplete="new-password"
                      className="inputClass"
                      name="password"
                      onChange={this.loginAuth}
                      style={{ width: "45%" }}
                      placeholder="Password"
                    ></input>
                  </div>

                  <input
                    type="submit"
                    style={{
                      marginTop: "25px",
                      width: "100%",
                      border: "none",
                      height: "30px"
                    }}
                  />
                </form>
              </div>
            </div>
            <div
              className="col-6"
              style={{ backgroundColor: "#0a1727", height: "100vh" }}
            >
              {" "}
              <div
                class="text-xs-center text-lg-center"
                style={{ marginTop: "15%" }}
              >
                <img
                  src="/images/logo.svg"
                  style={{ width: "18%" }}
                  alt="Logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
LoginAdmin.defaultProps = {
  method: "post"
};
export default LoginAdmin;
