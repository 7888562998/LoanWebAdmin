import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/service";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "../commonFunctions/common";
import { BasicDatePicker } from "./BasicDatePicker";

const columns = [
  { id: "firstName", label: "FirstName", minWidth: 170 },
  { id: "lastName", label: "LastName", minWidth: 100 },
  { id: "fatherName", label: "FatherName", minWidth: 170 },
  { id: "phoneNumber", label: "PhoneNumber", minWidth: 170 },
  { id: "city", label: "City", minWidth: 170 },
  { id: "address", label: "Address", minWidth: 170 },
  { id: "dob", label: "Date of birth", minWidth: 170 },
  { id: "amount", label: "Amount", minWidth: 170 },
  { id: "terms", label: "Terms", minWidth: 170 },
  { id: "status", label: "Status", minWidth: 170 },
];

function createData(
  id,
  firstName,
  lastName,
  fatherName,
  phoneNumber,
  city,
  address,
  dob,
  profileImg,
  amount,
  terms,
  status,
  userId
) {
  return {
    id,
    firstName,
    lastName,
    fatherName,
    phoneNumber,
    city,
    address,
    dob,
    profileImg,
    amount,
    terms,
    status,
    userId,
  };
}

export function StudentDetail() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [erp, setErp] = React.useState("");
  const [showListBtn, setShowListBtn] = React.useState(false);
  const [imgId, setImgId] = React.useState("");
  const [emiList, setEmi] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [interest, setInterest] = React.useState(null);
  const [loanInfo, setLoanInfo] = React.useState();
  const [customerList, setCustomerList] = React.useState(undefined);
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/student/${id}`);
      const filteredArray = rows.filter((obj) => obj.erpId !== id);
      setRows(filteredArray);
      toast.success("Successfuly deleted");
    } catch (error) {
      navigate("/login");
    }
  };

  const setRecordList = async (data, load) => {
    setRows([]);
    for (const item of data.data) {
      const dateObj = new Date(item.dob);
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getUTCDate()).padStart(2, "0");
      setRows((prevRows) => [
        ...prevRows,
        createData(
          item._id,
          item.firstName,
          item.lastName,
          item.fatherName,
          item.phoneNumber,
          item.city,
          item.address,
          `${year}-${month}-${day}`,
          item?.profileImage?.url,
          item.loanAmount,
          item.loanTerms,
          item.status,
          item.userId
        ),
      ]);
    }
  };
  function createLoanData(emi, amount, status) {
    return { emi, amount, status };
  }

  const setEmiList = async (data) => {
    setEmi([]);
    const detail = data.data[0];
    const res = {
      loanAmount: detail.loanAmount,
      tottleAmount: detail.tottleAmount,
    };
    setLoanInfo(res);
    detail.detail.forEach((value, index) => {
      setEmi((prevRows) => [
        ...prevRows,
        createLoanData(value.emiDate, value.monthlyEmi, value.status),
      ]);
    });
  };
  const getRecordList = async (url) => {
    try {
      const data = await axiosInstance.get(url);
      if (getCookie("user-role") === "1") {
        await setEmiList(data);
      } else {
        await setRecordList(data);
      }
    } catch (error) {
      console.error(error); // Log error for debugging
      // navigate("/login");
    }
  };

  React.useEffect(() => {
    if (getCookie("user-role") === "0" || getCookie("user-role") === "1") {
      getCookie("user-role") === "0" && getRecordList("/customer/requests");
      getCookie("user-role") === "1" && getRecordList("/loan/list");
    } else {
      navigate("/login");
    }
  }, []);

  const handleInputChange = (event) => {
    setErp(event.target.value);
  };
  const handleSearch = async () => {
    if (erp === "") {
      toast.warning("Enter your ERP");
    } else {
      try {
        let result = await axiosInstance.get(`/student/${erp}`);
        result = result.data;
        const dateObj = new Date(result.dob);
        const year = dateObj.getUTCFullYear();
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getUTCDate()).padStart(2, "0");
        setRows([
          createData(
            result._id,
            result.firstName,
            result.lastName,
            result.fatherName,
            result.phoneNumber,
            result.city,
            result.address,
            `${year}-${month}-${day}`,
            result?.profileImage?.url
          ),
        ]);
        setShowListBtn(true);
      } catch (error) {
        console.error(error); // Log error for debugging
        console.log("invalid ERP");
        toast.error("Invalid ERP");
      }
    }
  };

  const handleLoanRequest = async (id, userId, status) => {
    try {
      if (interest && selectedDate) {
        const result = await axiosInstance.patch(`/loan/status/${id}`, {
          status,
          userId,
          startDate: selectedDate,
          interest,
        });
        getRecordList("/customer/requests");
        toast.success("Loan approved");
      } else if (status === "Rejected") {
        const result = await axiosInstance.patch(`/loan/status/${id}`, {
          status,
          userId,
          startDate: selectedDate,
          interest,
        });
        getRecordList("/customer/requests");
        toast.error("Loan rejected");
      } else {
        toast.warning("Interest field and emi start date is required");
      }
    } catch (error) {
      navigate("/login");
    }
  };

  const setDate = React.useCallback(
    (date) => {
      setSelectedDate(date);
    },
    [selectedDate]
  );
  function getRandomName() {
    const firstNames = [
      "Liam",
      "Olivia",
      "Noah",
      "Emma",
      "Elijah",
      "Ava",
      "Oliver",
      "Sophia",
      "James",
      "Isabella",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Martinez",
      "Lopez",
    ];

    // Generate random indices for first and last names
    const randomFirstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName =
      lastNames[Math.floor(Math.random() * lastNames.length)];

    // Combine the two to create a full name
    return `${randomFirstName} ${randomLastName}`;
  }
  function getRandomAmount(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  let count = 0;
  React.useEffect(() => {
    setInterval(async () => {
      count++;
      if (count >= 10) {
        setCustomerList([]);
      }
      setCustomerList({
        name: getRandomName(),
        amount: getRandomAmount(20000, 100000),
      });
    }, 10000);
  }, []);
  return (
    <div style={{ padding: "10px" }}>
      {imgId != "" && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 4,
          }}
          onClick={() => {
            setImgId("");
          }}
        ></Box>
      )}
      {getCookie("user-role") === "0" ? (
        <Box>
          <h1 style={{ textAlign: "center" }}> Loan App List</h1>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
            margin={2}
          >
            <TextField
              id="outlined-basic"
              label="ENTER YOUR ERP"
              variant="outlined"
              InputProps={{
                style: {
                  height: "40px",
                },
              }}
              value={erp}
              onChange={handleInputChange}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSearch}
              >
                Search
              </Button>
              {showListBtn && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setRows([]);
                    getRecordList("/student");
                    setShowListBtn(false);
                    setErp("");
                  }}
                >
                  Back to list
                </Button>
              )}
            </Box>
          </Box>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: "79vh" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ minWidth: 170 }}></TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{
                          minWidth: column.minWidth,
                          textAlign: "center",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}

                    <TableCell style={{ minWidth: 170 }}></TableCell>
                    <TableCell style={{ minWidth: "200px" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          <TableCell
                            align={"center"}
                            sx={{ cursor: "pointer", position: "relative" }}
                            onClick={() => {
                              navigate(`/loan-detail/${row.userId}`);
                            }}
                          >
                            <img
                              src={row.profileImg}
                              alt="alt"
                              width="50"
                              height="50"
                            />
                          </TableCell>
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <>
                                <TableCell key={column.id} align={"center"}>
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              </>
                            );
                          })}
                          {row.status !== "Approved" && (
                            <TableCell
                              align={"left"}
                              sx={{ minWidth: "200px" }}
                            >
                              <Box
                                display={"flex"}
                                flexDirection={"column"}
                                gap={2}
                              >
                                <BasicDatePicker setDate={setDate} />

                                <input
                                  placeholder="Interest %"
                                  type="number"
                                  style={{ width: "192px" }}
                                  onChange={(event) => {
                                    setInterest(event.target.value);
                                  }}
                                />
                              </Box>
                            </TableCell>
                          )}
                          <TableCell align={"left"} sx={{ minWidth: "200px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              {/* <Link to={`/edit-student/${row.erpId}`}>
                            <Button variant="contained" color="success">
                              Edit
                            </Button>
                          </Link> */}
                              {/* <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(row.erpId)}
                          >
                            Delete
                          </Button> */}
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  row.status !== "Approved" &&
                                    handleLoanRequest(
                                      row.id,
                                      row.userId,
                                      "Approved"
                                    );
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  row.status !== "Rejected" &&
                                    handleLoanRequest(
                                      row.id,
                                      row.userId,
                                      "Rejected"
                                    );
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <ToastContainer />
        </Box>
      ) : (
        <Box>
          <Box
            display={"flex"}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              sx={{
                margin: "10px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                maxWidth: "300px",
                borderRadius: "5px",
                padding: "10px",
                color: "white",
                background: "green",
              }}
            >
              <Typography variant="p" fontWeight={600}>
                Loan Amount:
                <span style={{ fontWeight: "400" }}>
                  Rs{loanInfo?.loanAmount}
                </span>
              </Typography>
              <Typography variant="p" fontWeight={600}>
                Tottle Amount with interest:
                <span style={{ fontWeight: "400" }}>
                  Rs{loanInfo?.tottleAmount}
                </span>
              </Typography>
            </Box>
            <Box>
              {customerList && (
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "42px",
                    background: "green",
                    width: "350px",
                    borderRadius: "5px",
                    padding: "10px",
                    color: "white",
                  }}
                >
                  <marquee behavior="scroll" direction="right" scrollamount="5" loop="infinite" style={{ position: "relative" }}>
                    <img
                      style={{
                        position: "absolute",
                        left: "-29px",
                        top: "-5px",
                      }}
                      src="/speaker.png"
                      width={30}
                      height={30}
                    />
                    <Typography variant="p">
                      Loan approved: {customerList?.name}
                    </Typography>
                    <Typography variant="p">
                      Rs{customerList?.amount}
                    </Typography>
                  </marquee>
                </Box>
              )}
            </Box>
          </Box>
          <TableContainer component={Paper} sx={{ margin: "10px 0" }}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell align="left">Emi Date</TableCell>
                  <TableCell align="left">Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emiList.map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">{row.emi}</TableCell>
                    <TableCell align="left">{row.amount}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        background: row.status === "unpaid" ? "red" : "green",
                      }}
                    >
                      {row.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </div>
  );
}
