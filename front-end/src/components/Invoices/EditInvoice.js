/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import InvoicesService from "../../services/InvoicesService";
import InvoiceSearch from "components/FiltersForm/InvoiceSearch";
import { Add, Search } from "@material-ui/icons";
import { showPrice } from "../../helper/function";
import "../../assets/css/search/InvoiceSearch.css";
import CustomerService from "services/CustomerService";
import Snackbars from "components/Snackbar/Snackbar.js";
import "../../assets/css/invoices/InvoiceMaterialSearch.css";
import MaterialService from "services/materialService";
import ServicesService from "services/ServicesService";
import EmployeeService from "services/EmployeeService";
import "../../assets/css/invoices/InvoiceServiceSearch.css";
import { Button, TextField } from "@material-ui/core";
import IconIncrease from "common/iconIncrease";
import { NumberFormatBase } from "react-number-format";
import AreaService from "services/AreaService";
import "../../assets/css/invoices/CreateInvoices.css";
import VehicleService from "services/VehicleService";
import IconReduce from "common/iconReduce";

function EditInvoice(props) {
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
  const [id, setId] = useState(props.match.params.id);
  // eslint-disable-next-line no-unused-vars
  const [tl, setTl] = React.useState(false);

  const [listCustomerClass, setListCustomerClass] = useState("");
  const [showInfoCustomer, setShowInfoCustomer] = useState("");
  const [modalCustomerClass, setModalCustomerClass] = useState("");
  const [customers, setCustomers] = useState([]);
  const typingTimeoutRef = useRef(null);
  const [btnFinish, setBtnFinish] = useState("");
  const [fail, setFail] = React.useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [materialList, setMaterialList] = useState([]);
  const [materialChoose, setMaterialChoose] = useState([]);
  const [listMaterial, setListMaterial] = useState("");
  const [materitals, setMaterials] = useState([]);
  const [listCustomerVehicleClass, setListCustomerVehicleClass] = useState("");
  const [showInfoCustomerVehicle, setShowInfoCustomerVehicle] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
  });
  const [sumMaterial, setSumMaterial] = useState(0);
  const [warningModalClass, setWarningModalClass] = useState("");
  const [warningClass, setWarningClass] = useState("");
  const [warningModalFinishClass, setWarningModalFinishClass] = useState("");
  const [warningFinishClass, setWarningFinishClass] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [serviceList, setServiceList] = useState([]);
  const [serviceChoose, setServiceChoose] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [listService, setListService] = useState("");
  const [services, setServices] = useState([]);
  const [sumServices, setSumServices] = useState(0);
  const [status, setStatus] = useState("");
  const [btnConfirm, setBtnComfirm] = useState("");
  const [listEmployeeClass, setListEmployeeClass] = useState("");
  const [showInfoEmployee, setShowInfoEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [customerClass, setCustomerClass] = useState("");
  const [employee, setEmployee] = useState({
    id: 0,
    code: "",
    name: "",
    phone: "",
  });
  const [filterSum, setFilterSum] = useState({
    sum: 0,
  });
  const [filtersCustomer, setFiltersCustomer] = useState({
    idVehicle: 1,
    keyword: "",
  });
  const [areaName, setAreaName] = useState([]);
  const [error, setError] = useState(null);
  const [noteInvoice, setNoteInvoice] = useState("");
  const [payMethod, setPayMethod] = useState();
  const [customer, setCustomer] = useState({
    id: 0,
    code: "",
    name: "",
    phone: "",
    licensePlate: "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState({
    id: 0,
    code: "",
    licensePlate: "",
  });
  const [disabled, setDisabled] = useState(true);
  const [area, setArea] = useState([]);
  const [name, setName] = useState();
  const [licensePlate, setLicensePlate] = useState();
  const [phone, setPhone] = useState();
  const [listAreaClass, setListAreaClass] = useState("");
  const [filters1, setFilters1] = useState({
    status: 1,
  });
  const [checkQuantity, setCheckQuantity] = useState({
    id: 1,
    quantity: 0,
  });
  const [areaChose, setAreaChose] = useState({
    id: 0,
    code: "",
    name: "",
  });
  //Employee
  const showListEmployee = () => {
    if (listEmployeeClass == "") {
      setListEmployeeClass("info-employees");
    } else {
      setListEmployeeClass("");
    }
  };
  const deleteEmployee = () => {
    setShowInfoEmployee("");
    setEmployee({
      id: 0,
      code: "",
      name: "",
      phone: "",
    });
    setAreaChose({
      id: 0,
      code: "",
      name: "",
    });
  };

  const showListService = () => {
    if (listService == "") {
      setListService("info-material");
    } else {
      setListService("");
    }
  };

  const chooseEmployee = (employee) => {
    setEmployee(employee);
    setListEmployeeClass("");
    setShowInfoEmployee("info-name");
  };
  useEffect(() => {
    async function fetchEmployeeList() {
      try {
        AreaService.listArea(filters1)
          .then((res) => {
            console.log("checklkk", res);
            const areas = res.data.areas;
            setArea(
              areas.map((area) => {
                return {
                  select: false,
                  id: area.id,
                  code: area.code,
                  name: area.name,
                  status: area.status,
                  invoice: area.invoice,
                };
              })
            );
            setAreaName(areaName);
          })
          .catch(function (error) {
            if (error.response.data.status == 403) {
              alert("Kh??ng c?? quy???n truy c???p!");
            }
          });
      } catch (error) {
        if (error.status == 401) {
          alert("Kh??ng quy???n truy c???p");
        }
        console.log("Failed to fetch employee list: ", error.message);
        setError(error);
      }
    }
    fetchEmployeeList();
  }, [filters1]);

  //L???y th??ng tin h??a ????n
  useEffect(() => {
    async function fetchInvoice() {
      try {
        InvoicesService.getInvoiceById(id).then((res) => {
          let customer = {
            id: res.data.customerVehicleDTO.customerDTO.id,
            code: res.data.customerVehicleDTO.customerDTO.code,
            name: res.data.customerVehicleDTO.customerDTO.name,
            phone: res.data.customerVehicleDTO.customerDTO.phone,
          };
          let vehicle = {
            id: res.data.customerVehicleDTO.vehicleDTO.id,
            code: res.data.customerVehicleDTO.vehicleDTO.code,
            licensePlate: res.data.customerVehicleDTO.vehicleDTO.licensePlate,
          };
          let materials = res.data.materialOrderResponseDTOS;
          let services = res.data.serviceOrderResponseDTOS;
          console.log(res.data);
          setStatus(res.data.status);
          if (res.data.status.localeCompare("??ang ch??? th???") == 0) {
            setBtnComfirm("btn-comfirm");
          }
          if (res.data.status.localeCompare("??ang s???a") == 0) {
            setBtnFinish("btn-finish");
          }
          setCustomer(customer);

          if (res.data.userDTO.id == 0) {
            setDisabled(false);
          }
          if (res.data.areaDTO !== null) {
            setAreaChose(res.data.areaDTO);
          }
          setEmployee(res.data.userDTO);
          setVehicle(vehicle);
          setMaterialChoose(materials);
          setServiceChoose(services);
          setNoteInvoice(res.data.note);
          setPayMethod(res.data.payMethod);
          let currentSumMaterial = 0;
          materials.map((material) => {
            currentSumMaterial =
              currentSumMaterial + material.quantityBuy * material.outputPrice;
          });
          setSumMaterial(currentSumMaterial);

          let currentSumService = 0;
          services.map((service) => {
            currentSumService = currentSumService + service.price;
          });
          setSumServices(currentSumService);
          setShowInfoEmployee("info-name");
        });
      } catch (error) {
        console.log("Failed to fetch Invoicce: ", error.message);
      }
    }
    fetchInvoice();
  }, []);
  //L???y list Bi???n s??? xe
  useEffect(() => {
    async function fetchVehicleList() {
      try {
        VehicleService.getListVehicle(filters)
          .then((res) => {
            let vehicleDTOS = res.data;
            console.log("VEHICLE :" + res.data);
            setVehicles(
              vehicleDTOS.map((vehicle) => {
                return {
                  id: vehicle.id,
                  code: vehicle.code,
                  licensePlate: vehicle.licensePlate,
                };
              })
            );
          })
          .catch(function (error) {
            console.log(error.response);
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
      } catch (error) {
        console.log("Failed to fetch Customer list: ", error.message);
      }
    }
    fetchVehicleList();
  }, [filters]);

  //L???y list kh??ch h??ng
  useEffect(() => {
    async function fetchCustomerList() {
      try {
        CustomerService.getListCustomer(filtersCustomer).then((res) => {
          let customers = res.data;
          console.log(res.data);
          setCustomers(
            customers.map((customer) => {
              return {
                id: customer.id,
                code: customer.code,
                name: customer.name,
                phone: customer.phone,
                licensePlate: customer.licensePlate,
              };
            })
          );
        });
      } catch (error) {
        console.log("Failed to fetch Customer list: ", error.message);
      }
    }
    fetchCustomerList();
  }, []);
  //L???y list th??? s???a ??ang r???nh
  useEffect(() => {
    async function fetchEmployeeList() {
      try {
        EmployeeService.getListEmployeeReady(filters).then((res) => {
          let employees = res.data;
          console.log(res.data);
          setEmployees(
            employees.map((employee) => {
              return {
                id: employee.id,
                code: employee.code,
                name: employee.name,
                phone: employee.phone,
              };
            })
          );
        });
      } catch (error) {
        console.log("Failed to fetch Employee list: ", error.message);
      }
    }
    fetchEmployeeList();
  }, [filters]);
  //L???y list Ph??? ki???n
  useEffect(() => {
    async function fetchMaterialList() {
      try {
        MaterialService.getListMaterial(filters).then((res) => {
          let materitals = res.data;
          console.log(res.data);
          setMaterials(
            materitals.map((materital) => {
              return {
                id: materital.id,
                materialOrderId: 0,
                code: materital.code,
                name: materital.name,
                outputPrice: materital.outputPrice,
                quantity: materital.quantity,
                quantityBuy: 1,
              };
            })
          );
        });
        console.log(materitals);
      } catch (error) {
        console.log("Failed to fetch material list: ", error.message);
      }
    }
    fetchMaterialList();
  }, [filters]);

  //L???y list d???ch v???
  useEffect(() => {
    async function fetchServiceList() {
      try {
        ServicesService.getAllServiceStillServing(filters).then((res) => {
          let servicesData = res.data;
          console.log(res.data);
          setServices(
            servicesData.map((service) => {
              return {
                id: service.id,
                serviceOrderId: 0,
                code: service.code,
                name: service.name,
                description: service.description,
                price: service.price,
              };
            })
          );
          console.log(" d???ch v??? : " + servicesData + " : " + services);
        });
      } catch (error) {
        console.log("Failed to fetch Service list: ", error.message);
      }
    }
    fetchServiceList();
  }, [filters]);
  useEffect(() => {
    async function fetchServiceList() {
      try {
        let currentSumMaterial = 0;
        materialChoose.map((data) => {
          currentSumMaterial += data.quantityBuy * data.outputPrice;
        });
        setSumMaterial(currentSumMaterial);
      } catch (error) {
        console.log("Failed to fetch Service list: ", error.message);
      }
    }
    fetchServiceList();
  }, [filterSum]);
  const showListCustomer = () => {
    if (listCustomerClass == "") {
      setListCustomerClass("info-customers");
    } else {
      setListCustomerClass("");
    }
  };
  const formAddCustomer = () => {
    if (modalCustomerClass == "") {
      setModalCustomerClass("modal-customer");
      setListCustomerClass("");
    } else {
      setModalCustomerClass("");
    }
  };
  const chooseVehicle = (vehicle) => {
    setVehicle(vehicle);
    setFiltersCustomer({
      ...filters,
      idVehicle: vehicle.id,
    });
    setCustomerClass("search-customer-vehicle");
    setListCustomerClass("");
    setShowInfoCustomer("info-license-plate");
  };
  const outFormAddCustomer = () => {
    if (modalCustomerClass == "") {
      setModalCustomerClass("modal-customer");
    } else {
      setModalCustomerClass("");
    }
  };

  const back = () => {
    props.history.push("/admin/areas");
  };

  const chooseCustomer = (customer) => {
    setCustomer(customer);
    setListCustomerClass("");
    setShowInfoCustomer("info-license-plate");
  };
  const showListMaterial = () => {
    if (listMaterial == "") {
      setListMaterial("info-material");
    } else {
      setListMaterial("");
    }
  };
  const formAddCustomerVehicle = () => {
    if (modalCustomerClass == "") {
      setModalCustomerClass("modal-customer");
      setListCustomerVehicleClass("");
    } else {
      setModalCustomerClass("");
    }
  };
  const chooseArea = (area) => {
    setAreaChose(area);
    setListAreaClass("");
    setShowInfoEmployee("info-name");
  };
  function increaseVariant(id) {
    setMaterialChoose(
      materialChoose.map((materialCheck) => {
        if (materialCheck.quantityBuy > 0) {
          if (materialCheck.id === id) {
            materialCheck.quantityBuy = materialCheck.quantityBuy - 1;
          }
          setFilterSum({
            sum: 0,
          });

          setCheckQuantity({
            ...checkQuantity,
            id: materialCheck.id,
            quantity: materialCheck.quantityBuy,
          });

          return materialCheck;
        } else {
          if (materialCheck.id === id) {
            materialCheck.quantityBuy = 1;
          }
        }
      })
    );
  }
  function reduceVarant(id) {
    setMaterialChoose(
      materialChoose.map((materialCheck) => {
        if (materialCheck.quantityBuy > 0) {
          if (materialCheck.id === id) {
            materialCheck.quantityBuy = materialCheck.quantityBuy + 1;
          }
          setFilterSum({
            sum: 0,
          });
          if (materialCheck.quantityBuy > 0) {
            setCheckQuantity({
              ...checkQuantity,
              id: materialCheck.id,
              quantity: materialCheck.quantityBuy,
            });
          }
          return materialCheck;
        }
      })
    );
  }
  function handleSearchTermChangeCustomerVehicle(e) {
    const value = e.target.value;
    //Set --100 --clear, set --300 -> submit
    //Set --300 --> submit
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFiltersCustomer({
        ...filters,
        keyword: value,
      });
    }, 300);
  }
  const deleteCustomer = () => {
    setShowInfoCustomer("");
    setCustomerClass("");
  };
  const deleteCustomerVehicle = () => {
    setShowInfoCustomerVehicle("");
  };
  const showListArea = () => {
    if (listEmployeeClass == "") {
      setListAreaClass("info-employees");
    } else {
      setListAreaClass("");
    }
  };

  function checkMaterial(material, materials) {
    var a = 1;
    for (var i = 0; i < materials.length; i++) {
      if (material.id === materials[i].id) {
        return a;
      }
      a++;
    }
    return 0;
  }
  //H??m th??m ph????ng ti???n v?? th??ng tin kh??ch h??ng
  const addCustomerVehicle = (e) => {
    e.preventDefault();

    let vehicleCustomerDTORequest = { name, phone, licensePlate };
    console.log(
      "vehicleCustomerDTORequest => " +
      vehicleCustomerDTORequest.name +
      vehicleCustomerDTORequest.phone +
      vehicleCustomerDTORequest.licensePlate
    );

    CustomerService.postCustomerAndVehicle(vehicleCustomerDTORequest)
      .then(() => {
        setFilters({
          ...filters,
        });
        setTl(true);
        setTimeout(function () {
          setTl(false);
        }, 3000);
        setListCustomerClass("");
        setModalCustomerClass("");
      })
      .catch(function (error) {
        if (error.response.data.errors) {
          alert(error.response.data.errors[0].defaultMessage);
        } else {
          alert(error.response.data.message);
        }
      });
  };

  const chooseMaterial = (material) => {
    setListMaterial("");
    if (material.quantity === 0) {
      return alert("Ph??? ki???n ???? h???t!");
    } else {
      let materials = materialChoose;
      if (materials.length > 0) {
        let check = checkMaterial(material, materials);
        if (check !== 0) {
          var material1 = {
            id: materials[check - 1].id,
            materialOrderId: materials[check - 1].id,
            code: materials[check - 1].code,
            name: materials[check - 1].name,
            outputPrice: materials[check - 1].outputPrice,
            quantity: materials[check - 1].quantity,
            quantityBuy: materials[check - 1].quantityBuy + 1,
          };
          materials[check - 1] = material1;
        } else {
          materials.push(material);
        }
      } else {
        materials.push(material);
      }
      let currentSumMaterial = 0;
      materials.map((data) => {
        currentSumMaterial += data.quantityBuy * data.outputPrice;
      });
      setSumMaterial(currentSumMaterial);
      setMaterialChoose(materials);
    }
  };

  const deleteMaterialChoosed = (material) => {
    let materials = materialChoose;

    let check = checkMaterial(material, materials);
    let materialRemaining = [];
    for (var i = 0; i < materials.length; i++) {
      if (check - 1 !== i) {
        materialRemaining.push(materials[i]);
      }
    }
    setMaterialChoose(materialRemaining);
    let currentSum = sumMaterial;
    currentSum = currentSum - material.quantityBuy * material.outputPrice;
    setSumMaterial(currentSum);
  };

  // D???ch v???
  function checkService(service, services) {
    var a = 1;
    for (var i = 0; i < services.length; i++) {
      if (service.id === services[i].id) {
        console.log("i : " + a);
        return a;
      }
      a++;
    }
    return 0;
  }

  const chooseService = (service) => {
    setListMaterial("");
    let services = serviceChoose;
    if (services.length > 0) {
      let check = checkService(service, services);
      if (check !== 0) {
        var service1 = {
          id: services[check - 1].id,
          code: services[check - 1].code,
          name: services[check - 1].name,
          price: services[check - 1].price,
          status: services[check - 1].status,
        };
        services[check - 1] = service1;
      } else {
        services.push(service);
      }
    } else {
      services.push(service);
    }
    let currentSum = 0;
    serviceChoose.map((service) => {
      currentSum += service.price;
    });
    setSumServices(currentSum);
  };

  const deleteServiceChoosed = (service) => {
    let check = checkService(service, serviceChoose);
    let servicesRemaining = [];
    for (var i = 0; i < serviceChoose.length; i++) {
      if (check - 1 !== i) {
        servicesRemaining.push(serviceChoose[i]);
      }
    }
    setServiceChoose(servicesRemaining);
    let currentSum = sumServices;
    currentSum = currentSum - service.price;
    setSumServices(currentSum);
  };
  const check = () => {
    if (areaChose.id === 0 && employee.id !== 0) {
      return true;
    }
    if (areaChose.id !== 0 && employee.id === 0) {
      return true;
    }
  };
  //H??m s???a ????n h??ng
  const editInvoice = (e) => {
    if (!check()) {
      e.preventDefault();
      let materialDTOS = [];
      materialChoose.map((material) => {
        let material1 = {
          id: material.id,
          quantity: material.quantityBuy,
          materialOrderId: material.materialOrderId,
        };
        materialDTOS.push(material1);
      });

      let serviceDTOS = [];
      serviceChoose.map((service) => {
        let service1 = {
          id: service.id,
          serviceOrderId: service.serviceOrderId,
        };
        serviceDTOS.push(service1);
      });
      let invoice = {
        customerId: customer.id,
        areaId: areaChose.id,
        vehicleId: vehicle.id,
        fixerId: employee.id,
        note: noteInvoice,
        payMethod,
        total: sumMaterial + sumServices,
        materialDTOS,
        serviceDTOS,
      };
      console.log("invoice => " + JSON.stringify(invoice));
      InvoicesService.putInvoice(id, invoice)
        .then(() => {
          setTl(true);
          // use this to make the notification autoclose
          setTimeout(function () {
            setTl(false);
          }, 3000);
          props.history.push("/admin/areas");
        })
        .catch(function (error) {
          if (error.response.data.errors) {
            console.log(error.response.data.errors[0].defaultMessage);
          } else {
            console.log(error.response.data.message);
          }
        });
    } else {
      setMessageError("Kh??ng ???????c ????? tr???ng khu v???c ho???c nh??n vi??n s???a");
      setFail(true);
    }
  };
  console.log("arearChose", areaChose);
  const changePayMethod = (e) => {
    setPayMethod(e.target.value);
  };
  const changeNote = (e) => {
    setNoteInvoice(e.target.value);
  };
  const changeName = (e) => {
    setName(e.target.value);
  };
  const changePhone = (e) => {
    setPhone(e.target.value);
  };
  const changeLicensePlate = (e) => {
    setLicensePlate(e.target.value);
  };

  //H??m th??m kh??ch h??ng m???i
  const addCustomer = (e) => {
    e.preventDefault();

    let customer = { name, phone, licensePlate };

    CustomerService.postCustomer(customer)
      .then(() => {
        setTl(true);
        // use this to make the notification autoclose
        setTimeout(function () {
          setTl(false);
        }, 3000);
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

  const showStatus = (status) => {
    if (status == null) {
      return <span style={{ color: "green" }}>Ch??? x??t duy???t</span>;
    } else {
      return <span style={{ color: "blue" }}>{status}</span>;
    }
  };
  const showListCustomerVehicle = () => {
    if (listCustomerVehicleClass == "") {
      setListCustomerVehicleClass("info-customer-vehicle");
    } else {
      setListCustomerVehicleClass("");
    }
  };
  const receiptInvoice = (e) => {
    if (warningModalClass == "") {
      setWarningModalClass("warning-modal");
    }
  };
  const finishInvoice = (e) => {
    if (warningModalFinishClass == "") {
      setWarningModalFinishClass("warning-modal-finish");
    }
  };
  const changeStatusConfirm = (e) => {
    e.preventDefault();
    InvoicesService.confirm(id)
      .then(() => {
        setMessageSuccess("Th??nh c??ng!");
        setTl(true);
        // use this to make the notification autoclose
        setTimeout(function () {
          setTl(false);
        }, 3000);
        props.history.push("/admin/invoices");
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
  const deleteInvoice = (e) => {
    InvoicesService.deleteInvoice(id)
      .then(() => {
        props.history.push("/admin/areas");
      })
      .catch(function (error) {
        if (error.response.data.errors) {
          console.log(error.response.data.errors[0].defaultMessage);
        } else {
          console.log(error.response.data.message);
        }
      });
  };
  const changeStatusFinish = (e) => {
    e.preventDefault();
    InvoicesService.finish(id)
      .then(() => {
        setMessageSuccess("Th??nh c??ng!");
        setTl(true);
        // use this to make the notification autoclose
        setTimeout(function () {
          setTl(false);
        }, 3000);
        props.history.push("/admin/invoices");
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
  const closeWarning = () => {
    setWarningModalClass("");
  };
  const closeWarningFinish = () => {
    setWarningModalFinishClass("");
  };
  function handleSearchTermChange(e) {
    const value = e.target.value;
    //Set --100 --clear, set --300 -> submit
    //Set --300 --> submit
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFilters({
        ...filters,
        keyword: value,
      });
    }, 300);
  }
  function handleSearchTermChangeCustomerVehicle(e) {
    const value = e.target.value;
    //Set --100 --clear, set --300 -> submit
    //Set --300 --> submit
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFiltersCustomer({
        ...filters,
        keyword: value,
      });
    }, 300);
  }

  return (
    <div className="body-add-invoice">
      <div className="body-edit-invoice">
        <div className="title-add-invoice">
          <div className="left-title-add-invoice">
            <div className="back">
              <button className="cancel-button" onClick={back}>
                <span>&lsaquo; </span>Quay l???i
              </button>
            </div>
            <div className="name-page">
              <span>Phi???u s???a ch???a</span>{" "}
            </div>
          </div>
          <Snackbars
            place="tc"
            color="info"
            message={messageSuccess}
            open={tl}
            closeNotification={() => setTl(false)}
            close
          />
          <Snackbars
            place="tc"
            color="danger"
            message={messageError}
            open={fail}
            closeNotification={() => setFail(false)}
            close
          />
          <div className="right-title-add-invoice">
            {/* <button id="btn-finish" className={btnFinish} onClick={finishInvoice}>Ho??n th??nh</button>
                        <button id="btn-comfirm" className={btnConfirm} onClick={receiptInvoice}>X??c nh???n</button> */}
            <Button
              onClick={deleteInvoice}
              variant="outlinedSizeLarge"
              size="medium"
              style={{
                background: "#EC5739",
                width: "136px",
                height: "35px",
                color: "white",
                textAlign: "center",
              }}
            >
              {" "}
              H???y phi???u
            </Button>
            <button className="btn-add" onClick={editInvoice}>
              S???a
            </button>
          </div>
        </div>

        <div id="warning-modal" className={warningModalClass}>
          <div id="warning" className={warningClass}>
            <div className="title-warning">
              <span>X??c nh???n phi???u s???a ch???a?</span>
            </div>
            <div className="content-warning">
              <div className="text-warning">
                <span>B???n mu???n x??c nh???n phi???u s???a ch???a ?</span>
              </div>
              <div className="button-warning">
                <button
                  className="delete-permission"
                  onClick={changeStatusConfirm}
                >
                  <span>X??c nh???n</span>
                </button>
                <div className="back" onClick={closeWarning}>
                  <span>Tho??t</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="warning-modal-finish" className={warningModalFinishClass}>
          <div id="warning-finish" className={warningFinishClass}>
            <div className="title-warning">
              <span>Ho??n th??nh phi???u s???a ch???a</span>
            </div>
            <div className="content-warning">
              <div className="text-warning">
                <span>B???n ???? ho??n th??nh phi???u s???a ch???a n??y?.</span>
              </div>
              <div className="button-warning">
                <button
                  className="delete-permission"
                  onClick={changeStatusFinish}
                >
                  <span>Ho??n th??nh</span>
                </button>
                <div className="back" onClick={closeWarningFinish}>
                  <span>Tho??t</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-add-invoice">
        <div className="main-invoice">
          <div className="left-invoice">
            <div className="top-left-invoice">
              <div className="content-customer">
                <div className="search-customer">
                  {/* <TextField
                                        id="filled-search"
                                        label="Th??ng tin xe"
                                        type="search"
                                        variant="outlined"
                                        onChange={handleSearchTermChange}
                                        onClick={showListCustomer}
                                        style={{
                                            marginLeft: "30px", width: "50%", marginTop: "20px"
                                        }}
                                    /> */}

                  <div id="info-customers" className={listCustomerClass}>
                    <div className="license-plate" onClick={formAddCustomer}>
                      <Add color="#0e90ff" onClick={formAddCustomer}>
                        {" "}
                      </Add>{" "}
                      Th??m ph????ng ti???n
                    </div>

                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id}>
                        <div
                          className="license-plate"
                          onClick={() => chooseVehicle(vehicle)}
                        >
                          <span>{vehicle.licensePlate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div id="info-license-plate" className="info-license-plate">
                    <div className="info">
                      <div className="table">
                        <table>
                          <tr>
                            <th>Bi???n s???</th>
                            <td>:</td>
                            <td>{vehicle.licensePlate}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div id="modal-vehicle" className={modalCustomerClass}>
                    <div id="add-vehicle">
                      <div className="title-add-customer">
                        <div className="name-title">
                          <span>Th??m m???i ph????ng ti???n</span>
                        </div>
                        <div className="close-form-add-customer">
                          <span onClick={outFormAddCustomer}>&Chi;</span>
                        </div>
                      </div>
                      <div className="content-add-customer">
                        <form>
                          <div className="form-group-top">
                            <div className="form-group">
                              <label>
                                H??? T??n<span style={{ color: "red" }}>*</span>
                              </label>
                              <br />
                              <input
                                type="text"
                                className="input-customer"
                                name="name"
                                onChange={changeName}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                S??? ??i???n tho???i
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <br />
                              <input
                                type="text"
                                className="input-customer"
                                name="phone"
                                onChange={changePhone}
                              />
                            </div>
                          </div>
                          <div className="form-group-bot">
                            <label>
                              Bi???n s??? xe<span style={{ color: "red" }}>*</span>
                            </label>
                            <br />
                            <input
                              type="text"
                              className="input-customer"
                              name="licensePlate"
                              onChange={changeLicensePlate}
                            />
                          </div>
                        </form>

                        <div className="button-add-customer">
                          <button
                            className="btn-add"
                            onClick={addCustomerVehicle}
                          >
                            Th??m
                          </button>
                          <div className="btn-out" onClick={outFormAddCustomer}>
                            <span>Tho??t</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="info-customer" className="info-customer">
                  <div className="info">
                    <div className="table">
                      <table>
                        <tr>
                          <th>T??n</th>
                          <td>:</td>
                          <td>{customer.name}</td>
                        </tr>
                        <tr>
                          <th>S??? ??i???n tho???i</th>
                          <td>:</td>
                          <td>{customer.phone}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                <div id="search-customer-vehicle">
                  <form>
                    <TextField
                      id="filled-search"
                      label="Th??ng tin kh??ch h??ng"
                      type="search"
                      variant="outlined"
                      onChange={handleSearchTermChangeCustomerVehicle}
                      onClick={showListCustomerVehicle}
                      style={{
                        marginLeft: "30px",
                        width: "50%",
                        marginTop: "20px",
                      }}
                    />
                  </form>
                  <div
                    id="info-customer-vehicle"
                    className={listCustomerVehicleClass}
                  >
                    <div
                      className="license-plate"
                      onClick={formAddCustomerVehicle}
                    >
                      <span className="button-add-customers">
                        + Th??m kh??ch h??ng
                      </span>
                    </div>
                    {customers.map((customer) => (
                      <div key={customer.id}>
                        <div
                          className="license-plate"
                          onClick={() => chooseCustomer(customer)}
                        >
                          <table>
                            <tr>
                              <td>
                                <span>{customer.name}</span>{" "}
                              </td>
                              <td>
                                <span>{customer.phone}</span>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div id="info-customer" className="info-customer">
                    <div className="info">
                      <div className="table">
                        <table>
                          <tr>
                            <th>T??n</th>
                            <td>:</td>
                            <td>{customer.name}</td>
                          </tr>
                          <tr>
                            <th>S??? ??i???n tho???i</th>
                            <td>:</td>
                            <td>{customer.phone}</td>
                          </tr>
                        </table>
                      </div>
                      <div className="delete-license">
                        <span onClick={deleteCustomerVehicle}>x</span>
                      </div>
                    </div>
                  </div>
                  <div id="modal-customer" className={modalCustomerClass}>
                    <div id="add-customer">
                      <div className="title-add-customer">
                        <div className="name-title">
                          <span>Th??m m???i kh??ch h??ng</span>
                        </div>
                        <div className="close-form-add-customer">
                          <span onClick={outFormAddCustomer}>&Chi;</span>
                        </div>
                      </div>
                      <div className="content-add-customer">
                        <form>
                          <div className="form-group-top">
                            <div className="form-group">
                              <label>
                                H??? T??n<span style={{ color: "red" }}>*</span>
                              </label>
                              <br />
                              <input
                                type="text"
                                className="input-customer"
                                name="name"
                                onChange={changeName}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                S??? ??i???n tho???i
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <br />
                              <input
                                type="text"
                                className="input-customer"
                                name="phone"
                                onChange={changePhone}
                              />
                            </div>
                          </div>
                          <div className="form-group-bot">
                            <label>Bi???n s??? xe</label>
                            <br />
                            <input
                              type="text"
                              disabled
                              className="input-customer"
                              name="licensePlate"
                              value={vehicle.licensePlate}
                            />
                          </div>
                        </form>
                        <div className="button-add-customer">
                          <button className="btn-add" onClick={addCustomer}>
                            Th??m
                          </button>
                          <div className="btn-out" onClick={outFormAddCustomer}>
                            <span>Tho??t</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="material">
              <div className="title-material">
                <div className="name-title">
                  <span>Th??ng tin ph??? ki???n</span>
                </div>
              </div>
              <div className="content-material">
                <div className="top-content">
                  <div className="search-material">
                    {/* <form>
                                            <div className="search-invoice">
                                                <Search className="icon-search" />
                                                <input
                                                    type="text"
                                                    onClick={showListMaterial}
                                                    onChange={handleSearchTermChange}
                                                    placeholder="T??m ki???m t??n s???n ph???m, m?? ..."
                                                />
                                            </div>
                                        </form> */}
                    <TextField
                      id="filled-search"
                      label="Th??ng tin ph??? ki???n"
                      type="search"
                      variant="outlined"
                      onChange={handleSearchTermChange}
                      onClick={showListMaterial}
                      style={{
                        marginLeft: "30px",
                        width: "50%",
                        marginTop: "20px",
                      }}
                      size="small"
                    />
                    <div id="info-material" className={listMaterial}>
                      {materitals.map((materital) => (
                        <div key={materital.id}>
                          <div
                            className="info-detail"
                            onClick={() => chooseMaterial(materital)}
                          >
                            <table>
                              <tr>
                                <td className="td-1">{materital.name}</td>
                                <td className="td-2">
                                  {showPrice(materital.outputPrice).toString()}
                                </td>
                              </tr>
                              <tr>
                                <td className="td-1">{materital.code}</td>
                                <td className="td-2">
                                  C?? th??? b??n: {materital.quantity}
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="main-content">
                  <div className="table">
                    <table>
                      <thead>
                        <tr>
                          <td className="th-1">
                            <span>M??</span>
                          </td>
                          <td className="th-2">
                            <span>ph??? ki???n</span>
                          </td>
                          <td className="th-3">
                            <span>S??? l?????ng</span>
                          </td>
                          <td className="th-4">
                            <span>Gi??</span>
                          </td>
                          <td className="th-5"></td>
                        </tr>
                      </thead>
                      <tbody>
                        {materialChoose.map((materital) => (
                          <tr key={materital.id}>
                            <td className="td-1">
                              <span>{materital.code}</span>
                            </td>
                            <td className="td-2">
                              <span>{materital.name}</span>
                            </td>
                            <td className="td-3">
                              <div
                                style={{
                                  display: "inline-flex",
                                  marginLeft: "10px",
                                }}
                              >
                                <span
                                  onClick={() => increaseVariant(materital.id)}
                                  className="ui-button--link-mod-danger m-auto-bt"
                                  style={{
                                    marginTop: "auto",
                                    marginRight: "10px",
                                  }}
                                >
                                  <IconReduce />
                                </span>
                                <span className="ml-10 mr-10">
                                  <NumberFormatBase
                                    style={{
                                      width: "60px",
                                      height: "32px",
                                      textAlign: "center",
                                    }}
                                    thousandSeparator=","
                                    decimalSeparator="."
                                    allowNegative={false}
                                    value={materital.quantityBuy}
                                    onChange={(e) => {
                                      setMaterialChoose(
                                        materialChoose.map((materialCheck) => {
                                          if (
                                            materialCheck.id === materital.id
                                          ) {
                                            materialCheck.quantityBuy =
                                              e.target.value;
                                          }
                                          setFilterSum({
                                            sum: 0,
                                          });
                                          if (e.target.value > 0) {
                                            setCheckQuantity({
                                              ...checkQuantity,
                                              id: materialCheck.id,
                                              quantity: e.target.value,
                                            });
                                          }
                                          return materialCheck;
                                        })
                                      );
                                    }}
                                    inputMode="decimal"
                                    pattern="[0-9.]*"
                                  />
                                </span>
                                <span
                                  onClick={() => reduceVarant(materital.id)}
                                  className="ui-button--link-mod-danger m-auto-bt"
                                  style={{
                                    marginTop: "auto",
                                    marginLeft: "10px",
                                  }}
                                >
                                  <IconIncrease />
                                </span>
                              </div>
                            </td>
                            <td className="td-4">
                              <span>
                                {showPrice(materital.outputPrice).toString()}
                              </span>
                            </td>
                            <td className="td-5 delete-material">
                              <span
                                onClick={() => deleteMaterialChoosed(materital)}
                              >
                                x
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bottom-content">
                  <div className="total">
                    <table>
                      <tr>
                        <th>T???ng t???m t??nh: </th>
                        <td>{showPrice(sumMaterial).toString()}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="material">
              <div className="title-material">
                <div className="name-title">
                  <span>Th??ng tin d???ch v???</span>
                </div>
              </div>
              <div className="content-material">
                <div className="top-content">
                  <div className="search-material">
                    {/* <form>
                                            <div className="search-invoice">
                                                <Search className="icon-search" />
                                                <input
                                                    type="text"
                                                    onClick={showListService}
                                                    onChange={handleSearchTermChange}
                                                    placeholder="T??m ki???m t??n d???ch v???, m?? ..."
                                                />
                                            </div>
                                        </form> */}
                    <TextField
                      id="filled-search"
                      label="Th??ng tin d???ch v???"
                      type="search"
                      variant="outlined"
                      onChange={handleSearchTermChange}
                      onClick={showListService}
                      style={{
                        marginLeft: "30px",
                        width: "50%",
                        marginTop: "20px",
                      }}
                      size="small"
                    />
                    <div id="info-material" className={listService}>
                      {services.map((service) => (
                        <div key={service.id}>
                          <div
                            className="info-detail"
                            onClick={() => chooseService(service)}
                          >
                            <table>
                              <tr>
                                <td className="td-1">{service.name}</td>
                                <td className="td-2">
                                  {showPrice(service.price).toString()}
                                </td>
                              </tr>
                              <tr>
                                <td className="td-1">{service.code}</td>
                                <td className="td-2">??ang ho???t ?????ng</td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="main-content">
                  <div className="table">
                    <table>
                      <thead>
                        <tr>
                          <td className="th-1">
                            <span>M??</span>
                          </td>
                          <td className="th-2">
                            <span>ph??? ki???n</span>
                          </td>
                          <td className="th-3">
                            <span>S??? l?????ng</span>
                          </td>
                          <td className="th-4">
                            <span>Gi??</span>
                          </td>
                          <td className="th-5"></td>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceChoose.map((service) => (
                          <tr key={service.id}>
                            <td className="td-1">
                              <span>{service.code}</span>
                            </td>
                            <td className="td-2">
                              <span>{service.name}</span>
                            </td>
                            <td className="td-3">
                              <span style={{ textAlign: "center" }}>
                                <input value="1" />
                              </span>
                            </td>
                            <td className="td-4">
                              <span>{showPrice(service.price).toString()}</span>
                            </td>
                            <td className="td-5 delete-service">
                              <span
                                onClick={() => deleteServiceChoosed(service)}
                              >
                                x
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bottom-content">
                  <div className="total">
                    <table>
                      <tr>
                        <th>T???ng t???m t??nh: </th>
                        <td>{showPrice(sumServices).toString()}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-invoice">
            <div className="top-right-invoice">
              <div className="title-employee">
                <span>Khu v???c s???a ch???a</span>
              </div>
              <div className="content-employees">
                <div className="search-employee">
                  <TextField
                    id="filled-search"
                    label="Th??ng tin khu v???c"
                    type="search"
                    variant="outlined"
                    onChange={handleSearchTermChange}
                    onClick={showListArea}
                    style={{
                      marginLeft: "30px",
                      width: "70%",
                      marginTop: "20px",
                    }}
                    size="small"
                  />
                  <div id="info-employees" className={listAreaClass}>
                    {area.map((areas) => (
                      <div key={areas.id}>
                        <div className="name" onClick={() => chooseArea(areas)}>
                          <span>{areas.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div id="info-name" className={showInfoEmployee}>
                    <div className="info">
                      <div className="table">
                        <table>
                          <tr>
                            <th>T??n khu v???c</th>
                            <td>:</td>
                            <td>{areaChose.name}</td>
                          </tr>
                        </table>
                      </div>
                      <div className="delete-name">
                        <span onClick={deleteEmployee}>x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="top-right-invoice">
              <div className="title-employee">
                <span>Th??ng tin nh??n vi??n s???a ch???a</span>
              </div>
              <div className="content-employees">
                <div className="search-employee">
                  <TextField
                    id="filled-search"
                    label="Th??ng tin nh??n vi??n"
                    type="search"
                    variant="outlined"
                    onChange={handleSearchTermChange}
                    onClick={showListEmployee}
                    style={{
                      marginLeft: "30px",
                      width: "70%",
                      marginTop: "20px",
                    }}
                    size="small"
                  />
                  <div id="info-employees" className={listEmployeeClass}>
                    {employees.map((employee) => (
                      <div key={employee.id}>
                        <div
                          className="name"
                          onClick={() => chooseEmployee(employee)}
                        >
                          <span>{employee.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div id="info-name" className={showInfoEmployee}>
                    <div className="info">
                      <div className="table">
                        <table>
                          <tr>
                            <th>T??n</th>
                            <td>:</td>
                            <td>{employee.name}</td>
                          </tr>
                          <tr>
                            <th>S??? ??i???n tho???i</th>
                            <td>:</td>
                            <td>{employee.phone}</td>
                          </tr>
                        </table>
                      </div>
                      <div className="delete-name">
                        <span onClick={deleteEmployee}>x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="invoice">
              <div className="title-right-invoice">
                <span>H??a ????n t???m t??nh</span>
              </div>
              <div className="content-pay-invoice">
                <div
                  style={{
                    fontWeight: "500",
                    display: "flex",
                    fontSize: "10px",
                  }}
                >
                  <div style={{ width: "170px" }}>
                    <div>T??n kh??ch h??ng: {customer.name}</div>
                    <div>S??? ??i???n tho???i: {customer.phone}</div>
                    <div>T??n Nh??n vi??n s???a: {employee.name}</div>
                  </div>
                  <div>
                    <div>Bi???n s??? xe: {vehicle.licensePlate}</div>
                    <div>Khu v???c s???a: {areaChose.name}</div>
                  </div>
                </div>
                <div className="pay-method">
                  <div className="content-pay-method">
                    <table>
                      <thead>
                        <tr style={{ fontWeight: "bold", fontSize: "12px" }}>
                          <td className="td">
                            <span style={{ marginLeft: "-30px" }}>
                              Ph??? ki???n
                            </span>
                          </td>
                          <td>
                            <span style={{ marginLeft: " 22px" }}>
                              S??? l?????ng
                            </span>
                          </td>
                          <td className="tf">
                            <span style={{ marginLeft: "66px" }}>Gi??</span>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {materialChoose.map((materital) => (
                          <tr key={materital.id} style={{ fontSize: "10px" }}>
                            <td className="td-2">
                              <span
                                style={{ width: "100px", marginLeft: "-30px" }}
                              >
                                {materital.name}
                              </span>
                            </td>
                            <td className="td-3">
                              <span style={{ marginLeft: "75px" }}>
                                {materital.quantityBuy}
                              </span>
                            </td>
                            <td className="td-4">
                              <span style={{ marginLeft: "55px" }}>
                                {showPrice(
                                  materital.outputPrice * materital.quantityBuy
                                ).toString()}
                                ???
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <table>
                      <thead>
                        <tr style={{ fontWeight: "bold", fontSize: "12px" }}>
                          <td>
                            <span style={{ marginLeft: "-30px" }}>D???ch v???</span>
                          </td>
                          <td>
                            <span style={{ marginLeft: "200px" }}>Gi??</span>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceChoose.map((service) => (
                          <tr key={service.id} style={{ fontSize: "10px" }}>
                            <td className="td-2">
                              <span
                                style={{ width: "100px", marginLeft: "-28px" }}
                              >
                                {service.name}
                              </span>
                            </td>
                            <td className="td-4">
                              <span style={{ marginLeft: "190px" }}>
                                {showPrice(service.price).toString()}???
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="total-pay">
                  <table>
                    <tr
                      style={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        marginTop: "200px",
                      }}
                    >
                      <th>T???ng ti???n thanh to??n t???m t??nh</th>
                      <td>:</td>
                      <td>
                        {showPrice(sumMaterial + sumServices).toString()}???
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditInvoice;
