import React, { useState, useEffect } from "react";
import Pagination from "components/Pagination/pagination";

import "../../assets/css/invoices/invoices.css";
import "../../assets/css/modal/modal.css";
import FiltersForm from "../FiltersForm/SearchInvoice.js";
import LimitPagination from "components/Pagination/limitPagination.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  TabOutlined,
  TabTwoTone,
} from "@material-ui/icons";
import Snackbars from "components/Snackbar/Snackbar.js";
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Container,
  Collapse,
  Tab,
  Tabs,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Modal,
} from "@material-ui/core";
import { Add, Clear } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import { toast } from "react-toastify";
import {
  ArrowDropDown,
  Delete,
  NavigateBefore,
  NavigateBeforeSharp,
  NavigateNext,
  NextWeek,
  People,
  SettingsApplicationsRounded,
  SkipNext,
  Sort,
  SortByAlpha,
  SortByAlphaOutlined,
  SortTwoTone,
  ViewAgenda,
  ViewArrayOutlined,
  ViewList,
  ViewModuleTwoTone,
  Watch,
} from "@material-ui/icons";
import Edit from "@material-ui/icons/Edit";
import InvoicesService from "../../services/InvoicesService";
import InvoiceFilterStatus from "../../components/FiltersForm/InvoiceFilterStatus";
import { TabContent, TabPane } from "reactstrap";
import cardIconStyle from "assets/jss/material-dashboard-react/components/cardIconStyle";
import cancelSmallMinor from "../../common/cancelSmallMinor.svg";
import UISelect from "common/UISelect";
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function Invoices(props) {
  const classes = useStyles();

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
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [tl, setTl] = React.useState(false);
  const [fail, setFail] = React.useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");
  const [id, setId] = useState("");
  const [area_id, setArea_id] = useState(props.match.params.id);
  const [invoices, setInvoices] = useState([]);
  const [warningModalClass, setWarningModalClass] = useState("");
  const [warningClass, setWarningClass] = useState("");
  const [error, setError] = useState(null);
  const [page, setPage] = React.useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [buttonOtherClass, setButtonOtherClass] = useState("");
  const [areaChosse, setAreaChosse] = useState("");
  const [customerClass, setCustomerClass] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [materialChoose, setMaterialChoose] = useState([]);
  const [status, setStatus] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen1(false);
  const handleClose1 = () => setOpen2(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [value, setValue] = React.useState("");
  const [idInvoice, setIdInvoice] = useState(0);
  const [serviceChoose, setServiceChoose] = useState([]);
  const showButtonOther = () => {
    if (buttonOtherClass == "") {
      setButtonOtherClass("content-button");
    } else {
      setButtonOtherClass("");
    }
  };
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRows: 10,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    keyword: "",
    status: [2, 3, 4, 5, 7],
    sort: 0,
  });
  const [filters1, setFilters1] = useState({
    page: 1,
    limit: 10,
    keyword: "",
    status: [2, 3, 4, 5, 7],
    sort: 0,
  });
  const [areaChose, setAreaChose] = useState({});
  const [customer, setCustomer] = useState({
    id: 0,
    code: "",
    name: "",
    phone: "",
    licensePlate: "",
  });
  const [payMethod, setPayMethod] = useState();
  const [employee, setEmployee] = useState({
    id: 0,
    code: "",
    name: "",
    phone: "",
  });
  const [sumMaterial, setSumMaterial] = useState(0);
  const [vehicle, setVehicle] = useState({
    id: 0,
    code: "",
    licensePlate: "",
  });
  const [sumServices, setSumServices] = useState(0);
  function handlePageChange(newPage) {
    // console.log("new page: ", newPage);
    setFilters({
      ...filters,
      page: newPage,
    });
  }
  function handleFiltersChange(e) {
    // console.log("New filters: ", newFilters);
    const value = e.target.value;
    setFilters({
      ...filters,
      page: 1,
      keyword: value,
    });
  }
  function handleChangeLimit(newLimit) {
    // console.log("New Month: ", newLimit);
    setFilters({
      ...filters,
      page: 1,
      limit: newLimit.limit,
    });
  }
  function hanleChangeInvoice(newStatus) {
    console.log("New Status: ", newStatus);
    setFilters({
      ...filters,
      page: 1,
      status: newStatus.statusList,
    });
  }
  const TableHeaderCell = withStyles(() => ({
    root: {
      fontSize: "14px",
      fontWeight: "bold",
    },
  }))(TableCell);
  const TableCell1 = withStyles(() => ({
    root: {
      fontSize: "10px",
      fontWeight: "bold",
    },
  }))(TableCell);
  const handleChangePage = (event, newPage) => {
    setFilters({
      ...filters,
      page: newPage + 1,
    });
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const changeSort = () => {
    if (filters.sort == 1) {
      setFilters({
        ...filters,
        page: 1,
        sort: 2,
      });
    } else {
      setFilters({
        ...filters,
        page: 1,
        sort: 1,
      });
    }
  };

  useEffect(() => {
    async function fetchInvoicesList() {
      try {
        InvoicesService.getInvoices(filters)
          .then((res) => {
            let invoices = res.data.invoiceListResponseDTOS;
            let pagination = res.data.pagination;
            console.log(res.data);
            setInvoices(
              invoices.map((invoice) => {
                return {
                  select: false,
                  id: invoice.id,
                  code: invoice.code,
                  licensePlate: invoice.licensePlate,
                  fixerName: invoice.fixerName,
                  status: invoice.status,
                  materials: invoice.materialOrderResponseDTOS,
                  service: invoice.serviceOrderResponseDTOS,
                  confirm: invoice.confirm,
                };
              })
            );
            setPagination(pagination);
            console.log(pagination);
            setIsLoaded(true);
          })
          .catch(function (error) {
            console.log("ERROR: " + error.response.data.status);
            if (error.response.data.status == 403) {
              alert("Không có quyền truy cập!");
            }
          });
      } catch (error) {
        console.log("Failed to fetch Invoicce list: ", error.message);
        setError(error);
      }
    }
    fetchInvoicesList();
  }, [filters]);
  const changeare = (e) => {
    const value = e.target.value;
    setStatus(value);
  };
  const oke = () => {
    setFilters({
      ...filters,
      page: 1,
      status: [status],
    });
  };
  const editInvoice = (id) => {
    props.history.push(`/admin/invoices/edit-invoice/${id}`);
  };
  const viewInvoice = () => {
    setOpen(true);
    console.log("okeee", open);
  };
  const toggle = () => {
    setOpen(false);
  };
  const listInvoiceNoFixer = () => {
    props.history.push("/admin/invoices/list-invoice/no-fixer");
  };
  const createInvoiceMaterial = () => {
    props.history.push("/admin/invoices/add-invoice-material");
  };
  const deleteInvoice = (id) => {
    if (warningModalClass == "") {
      setWarningModalClass("warning-modal");
      setId(id);
    }
  };
  //Xóa phiếu sửa chữa
  const back = () => {
    setWarningClass("");
    setWarningModalClass("");
  };
  const deleteI = (e) => {
    e.preventDefault();
    InvoicesService.deleteInvoice(id)
      .then(() => {
        setMessageSuccess("Xóa phiếu thành công!");
        setTl(true);
        // use this to make the notification autoclose
        setTimeout(function () {
          setTl(false);
        }, 3000);

        window.location.reload();
      })
      .catch(function (error) {
        if (error.response.data.status == 403) {
          alert("Không có quyền truy cập!");
        } else if (error.response.data.errors) {
          setWarningClass("");
          setWarningModalClass("");
          setMessageError(error.response.data.errors[0].defaultMessage);
          setFail(true);
          // use this to make the notification autoclose
          setTimeout(function () {
            setFail(false);
          }, 3000);
        } else {
          setWarningClass("");
          setWarningModalClass("");
          setMessageError(error.response.data.message);
          setFail(true);
          // use this to make the notification autoclose
          setTimeout(function () {
            setFail(false);
          }, 3000);
        }
      });
  };
  const colorStatusInvoice = (status, confirm) => {
    if (status.localeCompare("Đang chờ thợ") == 0) {
      return (
        <span
          style={{
            color: "rgb(255, 174, 6)",
            background: "rgb(255, 239, 205)",
            borderRadius: "20px",
            width: "fit-content",
            margin: "auto",
            color: "rgb(255, 255, 255)",
            padding: "2px 10px",
            whiteSpace: "nowrap",
          }}
        >
          {status}
        </span>
      );
    } else if (status.localeCompare("Đã thanh toán") == 0) {
      return (
        <span
          style={{
            color: "rgb(255 255 255)",
            background: "rgb(102, 184, 255)",
            borderRadius: "20px",
            width: "fit-content",
            margin: "auto",
            color: "rgb(255, 255, 255)",
            padding: "2px 10px",
            whiteSpace: "nowrap",
          }}
        >
          {status}
        </span>
      );
    } else if (status.localeCompare("Đã hủy") == 0) {
      return (
        <span
          style={{
            color: "rgb(238, 71, 71)",
            background: "rgb(255, 219, 219)",
            borderRadius: "20px",
            width: "fit-content",
            margin: "auto",
            padding: "2px 10px",
            whiteSpace: "nowrap",
          }}
        >
          {status}
        </span>
      );
    } else if (status.localeCompare("Chờ thanh toán") == 0) {
      return <span style={{ color: "#3c91f1" }}>{status}</span>;
    } else if (status.localeCompare("Đang sửa") == 0 && confirm === 3) {
      return <span style={{ color: "rgb(41, 164, 182)" }}>Cập nhật đơn</span>;
    } else if (status.localeCompare("Đang sửa") == 0 && confirm === 2) {
      return <span style={{ color: "red" }}>Đang sửa</span>;
    } else if (status.localeCompare("Đang sửa") == 0 && confirm === 4) {
      return <span style={{ color: "#0fd186" }}>Hoàn thành sửa</span>;
    } else if (status.localeCompare("Đang xét duyệt") == 0) {
      return <span style={{ color: "rgb(118, 64, 239" }}>Đang xét duyệt</span>;
    }
  };
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const changeStatus = (status) => {
    InvoicesService.finish(id, status, 1, "")
      .then((res) => {
        setMessageSuccess("Thành công!");
        setTl(true);
      })
      .catch(function (error) {
        if (error.response.data.errors) {
          setMessageError(error.response.data.errors[0].defaultMessage);
          setFail(true);
          // use this to make the notification autoclose
          setTimeout(function () {
            setFail(false);
          }, 3000);
        } else {
          setMessageError(error.response.data.message);
          setFail(true);
          // use this to make the notification autoclose
          setTimeout(function () {
            setFail(false);
          }, 3000);
        }
      });
  };
  const changeStatus1 = (id, status, confirm, note) => {
    InvoicesService.finish(id, status, confirm, note)
      .then((res) => {
        setMessageSuccess("Thành công!");
        setTl(true);
        window.location.reload();
      })
      .catch(function (error) {
        if (error.response.data.errors) {
          setMessageError(error.response.data.errors[0].defaultMessage);
          setFail(true);
          // use this to make the notification autoclose
          setTimeout(function () {
            setFail(false);
          }, 3000);
        } else {
          setMessageError(error.response.data.message);
          setFail(true);
          // use this to make the notification autoclose
          setTimeout(function () {
            setFail(false);
          }, 3000);
        }
      });
  };
  const test3 = (id) => {
    setId(id);
    setOpen1(true);
  };
  const test4 = (id) => {
    setId(id);
    setOpen2(true);
  };

  const changeArea = () => {
    props.history.push("/admin/area");
  };
  console.log("okeeee", status);
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    console.log("2222", row);
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.code}
          </TableCell>
          <TableCell align="center">{row.licensePlate}</TableCell>
          <TableCell align="center">{row.fixerName}</TableCell>
          <TableCell align="center">
            {" "}
            {colorStatusInvoice(row.status, row.confirm)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Chi tiết hóa đơn
                </Typography>
                {row.materials ? (
                  <Table size="small" aria-label="purchases">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                    ></Typography>
                    <TableHead>
                      <TableRow>
                        <TableCell1 style={{}}>Tên linh kiện</TableCell1>
                        <TableCell1 align="center">Số lượng mua </TableCell1>
                        <TableCell1 align="center">Giá Thành</TableCell1>
                        <TableCell1 align="right">tổng tiền(đ)</TableCell1>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.materials.map((historyRow) => (
                        <TableRow key={historyRow.id}>
                          <TableCell component="th" scope="row">
                            {historyRow.name}
                          </TableCell>
                          <TableCell align="center">
                            {historyRow.quantityBuy}
                          </TableCell>
                          <TableCell align="center">
                            {historyRow.outputPrice}
                          </TableCell>
                          <TableCell align="right">
                            {historyRow.outputPrice * historyRow.quantityBuy}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  ""
                )}
                {row.service ? (
                  <Table size="small" aria-label="purchases">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                    ></Typography>
                    <TableHead>
                      <TableRow>
                        <TableCell1>Tên dịch vụ</TableCell1>
                        <TableCell1 align="center">Số lượng</TableCell1>
                        <TableCell1 align="center">Giá Thành</TableCell1>
                        <TableCell1 align="right">tổng tiền(đ)</TableCell1>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.service.map((historyRow) => (
                        <TableRow key={historyRow.id}>
                          <TableCell component="th" scope="row">
                            {historyRow.name}
                          </TableCell>
                          <TableCell align="center">1</TableCell>
                          <TableCell align="center">
                            {historyRow.price}
                          </TableCell>
                          <TableCell align="right">
                            {historyRow.price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableRow>
                      <TableCell>ghi chú</TableCell>
                      <TableCell>{row.note}</TableCell>
                    </TableRow>
                  </Table>
                ) : (
                  ""
                )}
                {row.status.localeCompare("Chờ thanh toán") == 0 ? (
                  <Button
                    style={{
                      background: "#218FFE",
                      color: "white",
                      height: "20px",
                      marginBottom: "10px",
                      marginTop: "15px",
                    }}
                    onClick={() => test3(row.id)}
                  >
                    Thanh toán
                  </Button>
                ) : row.status.localeCompare("Đang xét duyệt") == 0 ? (
                  <Button
                    style={{
                      background: "#218FFE",
                      color: "white",
                      height: "20px",
                      marginBottom: "10px",
                      marginTop: "15px",
                    }}
                    onClick={() => editInvoice(row.id)}
                  >
                    xác nhận phiếu
                  </Button>
                ) : row.status.localeCompare("Đang sửa") == 0 &&
                  row.confirm === 3 ? (
                  <Button
                    style={{
                      background: "#218FFE",
                      color: "white",
                      height: "20px",
                      marginBottom: "10px",
                      marginTop: "15px",
                    }}
                    onClick={() => changeStatus1(row.id, 3, 2, "")}
                  >
                    Xác nhận cập nhật
                  </Button>
                ) : row.status.localeCompare("Đang sửa") == 0 &&
                  row.confirm === 4 ? (
                  <Button
                    style={{
                      background: "#218FFE",
                      color: "white",
                      height: "20px",
                      marginBottom: "10px",
                      marginTop: "15px",
                    }}
                    onClick={() => changeArea()}
                  >
                    Xác nhận Thanh toán
                  </Button>
                ) : (
                  ""
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid rgb(167 165 165)",
    boxShadow: 24,
    p: 4,
    borderRadius: "20px",
  };
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading....</div>;
  } else {
    return (
      <>
        <Modal
          open={open1}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography variant="h5">Thanh toán hóa đơn</Typography>
            <Box
              style={{
                borderBottom: "1px solid #dfe4e8",
                borderTop: "1px solid #dfe4e8",
                height: "40px",
                padding: "10px",
              }}
            >
              <Typography>
                Bạn có chắc muốn thanh toán hóa đơn này không!
              </Typography>
            </Box>
            <Button
              style={{
                background: "linear-gradient(180deg,#fff,#f9fafb)",
                color: "#182537",
                height: "40px",
                marginBottom: "10px",
                marginTop: "15px",
                border: "1px solid #c4cdd5",
              }}
              onClick={handleClose}
            >
              Hủy
            </Button>
            <Button
              style={{
                background: "#218FFE",
                color: "white",
                height: "40px",
                marginBottom: "10px",
                marginTop: "15px",
                marginLeft: "12px",
              }}
              onClick={() => changeStatus(5)}
            >
              Xác thanh toán
            </Button>
          </Box>
        </Modal>
        <Modal
          open={open2}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography variant="h5">Xác nhận phiếu sửa</Typography>
            <Box
              style={{
                borderBottom: "1px solid #dfe4e8",
                borderTop: "1px solid #dfe4e8",
                height: "40px",
                padding: "10px",
              }}
            >
              <Typography>Bạn có chắc xác nhận phiếu sửa này không!</Typography>
            </Box>
            <Button
              style={{
                background: "linear-gradient(180deg,#fff,#f9fafb)",
                color: "#182537",
                height: "40px",
                marginBottom: "10px",
                marginTop: "15px",
                border: "1px solid #c4cdd5",
              }}
              onClick={handleClose1}
            >
              Hủy
            </Button>
            <Button
              style={{
                background: "#218FFE",
                color: "white",
                height: "40px",
                marginBottom: "10px",
                marginTop: "15px",
                marginLeft: "12px",
              }}
              onClick={() => changeStatus(3)}
            >
              Xác nhận sửa phiếu
            </Button>
          </Box>
        </Modal>

        <div className="list-invoices">
          <Container>
            <Button
              style={{
                background: "#218FFE",
                color: "white",
                height: "40px",
                marginBottom: "10px",
                marginTop: "-3px",
                float: "right",
                marginRight: "10px",
              }}
              variant="outlined"
            >
              Tạo phiếu
            </Button>
            <TabContent value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Typography
                  variant="h4"
                  style={{
                    marginBottom: "15px",
                    marginTop: "15px",
                  }}
                >
                  Hóa đơn
                </Typography>
              </Box>
              <TabPane value="1">
                <Box sx={{ width: "100%" }}>
                  <Paper sx={{ width: "100%", mb: 2, minHeight: "100px" }}>
                    <TableContainer>
                      <Box style={{}}>
                        <Box>
                          <FormControl
                            style={{
                              width: "50%",
                              marginTop: "10px",
                              marginLeft: "10px",
                            }}
                          >
                            <InputLabel
                              style={{
                                fontSize: "15px",
                                color: "black",
                              }}
                            >
                              Chọn loại phiếu
                            </InputLabel>

                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Age"
                              onChange={changeare}
                              value={status ? status : ""}
                            >
                              <MenuItem value={7}>Hóa Đơn chờ duyệt</MenuItem>
                              <MenuItem value={3}>Hóa Đơn đang sửa</MenuItem>
                              <MenuItem value={6}>Hóa Đơn hủy</MenuItem>
                              <MenuItem value={4}>
                                Hóa Đơn chờ thanh toán
                              </MenuItem>
                              <MenuItem value={5}>
                                Hóa Đơn đã thanh toán
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <Button
                            style={{
                              background:
                                "linear-gradient(180deg,#fff,#f9fafb)",
                              color: "#182537",
                              height: "40px",
                              marginBottom: "10px",
                              marginTop: "20px",
                              border: "1px solid #c4cdd5",
                              marginLeft: "40px",
                            }}
                            onClick={oke}
                          >
                            Lọc phiếu
                          </Button>
                        </Box>
                        <TextField
                          id="filled-search"
                          label="Tìm kiếm hóa đơn"
                          type="search"
                          variant="outlined"
                          style={{
                            marginLeft: "30px",
                            width: "93%",
                            marginTop: "20px",
                          }}
                          size="small"
                          onChange={handleFiltersChange}
                        />
                      </Box>
                      <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={"medium"}
                      >
                        <TableHead variant="h6">
                          <TableRow>
                            <TableHeaderCell></TableHeaderCell>
                            <TableHeaderCell variant="h6">
                              Tên hóa đơn
                            </TableHeaderCell>
                            <TableHeaderCell align="center">
                              Biển số xe
                            </TableHeaderCell>
                            <TableHeaderCell align="center">
                              Tên thợ sửa
                            </TableHeaderCell>
                            <TableHeaderCell align="center">
                              Trạng thái
                            </TableHeaderCell>
                            <TableHeaderCell></TableHeaderCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {invoices.map((row) => (
                            <Row key={row.code} row={row} />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[10, 25]}
                      component="div"
                      count={pagination.totalRows}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </Box>
              </TabPane>
            </TabContent>
          </Container>
        </div>
      </>
    );
  }
}
