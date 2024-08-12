import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axiosInstance from "../services/service";
import { useParams } from "react-router-dom";

export const LoanDetail = () => {
  const [emiList, setEmi] = React.useState([]);
  const [loanInfo, setLoanInfo] = useState();
  const { id } = useParams();
  function createLoanData(emi, amount, status) {
    return { emi, amount, status };
  }

  const setEmiList = async (data) => {
    setEmi([]);
    console.log(data.data[0].detail);
    const detail = data.data[0];
    console.log("userId", detail);
    const res = {
      loanAmount: detail.loanAmount,
      tottleAmount: detail.tottleAmount,
    };
    console.log("res", res);
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
      await setEmiList(data);
    } catch (error) {
      console.error(error); // Log error for debugging
      // navigate("/login");
    }
  };

  React.useEffect(() => {
    getRecordList(`/users/loan/list?id=${id}`);
  }, []);

  const handleChange = async (index, e) => {
    console.log(e.target.value, id, index);
    const body = {
      index,
      status: e.target.value,
    };
    try {
      const result = await axiosInstance.patch(`loan/emi-status/${id}`, body);
      console.log(result);

      const updatedData = [...emiList];

      // Update the object at the specified index
      updatedData[index] = { ...updatedData[index], status: e.target.value };
      setEmi(updatedData);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box>
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
          <span style={{ fontWeight: "400" }}>Rs{loanInfo?.loanAmount}</span>
        </Typography>
        <Typography variant="p" fontWeight={600}>
          Tottle Amount with interest:
          <span style={{ fontWeight: "400" }}>Rs{loanInfo?.tottleAmount}</span>
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ margin: "10px 0" }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
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
                  <select
                    name="status"
                    id="loanStatus"
                    defaultValue={row.status}
                    onChange={(event) => {
                      handleChange(index, event);
                    }}
                  >
                    <option value="unpaid">unpaid</option>
                    <option value="paid">paid</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
