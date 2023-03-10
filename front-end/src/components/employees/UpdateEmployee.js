/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import EmployeesService from "../../services/employees.js";
import "../../assets/css/employees/updateEmployee.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// material-ui icons
import Person from "@material-ui/icons/Person";
import { ArrowDropDown, NavigateBefore, NavigateBeforeSharp, NavigateNext, NextWeek, People, SkipNext } from "@material-ui/icons";
import Snackbars from 'components/Snackbar/Snackbar.js';


function UpdateEmployee(props) {
  React.useEffect(() => {
    // Specify how to clean up after this effect:
    return function cleanup() {
      // to stop the warning of calling setTl of unmounted component
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  });
  const [message, setMessage] = useState('');
  const [tl, setTl] = React.useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState();
  const [code, setCode] = useState("");
  const [sex, setSex] = useState();
  const [idCard, setIdCart] = useState("");
  const [salaryDay, setSalaryDay] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [username, setUsername] = useState("");

  // eslint-disable-next-line react/prop-types
  const [id, setId] = useState(props.match.params.id);

  const changeName = (event) => {
    setName(event.target.value);
  };
  const changeAddress = (event) => {
    setAddress(event.target.value);
  };
  const changePhone = (event) => {
    setPhone(event.target.value);
  };
  const changeEmail = (event) => {
    setEmail(event.target.value);
  };
  const changeStatus = (event) => {
    console.log(event.target.checked)
    if (event.target.checked == 1) {
      setStatus(1)
    } else {
      setStatus(2)
    }

  }

  const updateEmployee = (e) => {
    e.preventDefault();
    let employee = { name, address, phone, email, status };
    console.log("employee => " + JSON.stringify(employee));
    EmployeesService.updateEmployee(id, employee)
      .then(() => {
        props.history.push("/admin/employees");
      })
      .catch(function (error) {
        if (error.response.data.errors) {
          setMessage(error.response.data.errors[0].defaultMessage)
          setTl(true);
          // use this to make the notification autoclose
          setTimeout(
            function () {
              setTl(false)
            },
            3000
          );
        } else {
          setMessage(error.response.data.message)
          setTl(true);
          // use this to make the notification autoclose
          setTimeout(
            function () {
              setTl(false)
            },
            3000
          );
        }
      });
  };

  useEffect(() => {
    EmployeesService.getEmployeeById(id).then((res) => {
      let user = res.data;
      console.log(user);
      setName(user.name);
      setCode(user.code);
      setSex(user.sex);
      setPhone(user.phone);
      setEmail(user.email);
      setAddress(user.address);
      setStatus(user.status);
      setUsername(user.username);
      setSalaryDay(user.salaryDay)
      setCreateDate(user.createDate)
    });
  }, []);


  const cancel = () => {
    props.history.push("/admin/employees");
  };

  return (
    <div className="body-edit-employees">
      <Snackbars
        place="tc"
        color="warning"
        message={message}
        open={tl}
        closeNotification={() => setTl(false)}
        close
      />
      <div className="title-employees">
        <div
          className="button-cancel"
          onClick={cancel}
        >
          <NavigateBefore style={{ width: "15px" }} /> <span>Quay l???i</span>
        </div>
        <button className="button-add" onClick={updateEmployee}>
          L??u
        </button>
      </div>
      <div className="top">
        <div className="add-edit-employee">
          <div className="title">
            <span>S???a th??ng tin nh??n vi??n</span>
          </div>
          <div className="card-body">
            <form>
              <div className="group">
                <div className="group-main">
                  <div className="form-group">
                    <label>T??n nh??n vi??n<span style={{ color: "red" }}>*</span> : </label>
                    <br />
                    <input
                      placeholder="T??n nh??n vi??n"
                      name="name"
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={changeName}
                    />
                  </div>
                  <div className="form-group">
                    <label>?????a ch???: </label>
                    <br />
                    <input
                      placeholder="??i???n ?????a ch??? ??? hi???n t???i c???a nh??n vi??n"
                      name="address"
                      className="form-control"
                      value={address}
                      onChange={changeAddress}
                    />
                  </div>
                  <div className="form-group">
                    <label>S??? ??i???n tho???i<span style={{ color: "red" }}>*</span>: </label>
                    <br />
                    <input
                      placeholder="??i???n s??? ??i???n tho???i c???a nh??n vi??n"
                      name="phone"
                      className="form-control"
                      value={phone}
                      onChange={changePhone}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email: </label>
                    <br />
                    <input
                      placeholder="??i???n ?????a ch??? email c???a nh??n vi??n"
                      name="email"
                      className="form-control"
                      value={email}
                      onChange={changeEmail}
                    />
                  </div>
                  <div>
                    {/* <input type="checkbox" name="status" value={checked} onChange={changeStatus} />
                    <label>??ang l??m vi???c</label> */}
                  </div>
                </div>
              </div>

            </form>
          </div>
          <div className="info-employee">
            {/* <div className="title">
              <span className="span-1">Th??ng tin nh??n vi??n</span><br />
              <span className="span-2">C??c th??ng tin c?? b???n c???a nh??n vi??n</span>
            </div> */}
            <div className="content">
              <div className="info-group">
                <label>M?? nh??n vi??n:</label><br />
                <input type="text" className="info-detail" value={code} disabled />
              </div>
              <div className="info-group">
                <label>T??n ????ng nh???p:</label><br />
                <input type="text" className="info-detail" value={username} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UpdateEmployee;
