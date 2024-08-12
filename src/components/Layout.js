import { Box, Button } from "@mui/material";
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../commonFunctions/common";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    document.cookie =
      "user-token" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast.success("Successfuly logged out");
    setTimeout(() => {
      navigate("/login");
    }, 4000);
  };
  return (
    <div>
      <header>
        <Box>
          <marquee behavior="scroll" direction="right" scrollamount="5" loop="infinite">
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
            <img style={{paddingRight:"20px"}} src="/CashLoan.png" width={70} height={70} />
          </marquee>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          sx={{
            margin: "10px",
            float: getCookie("user-role") === "0" ? "right" : "",
          }}
        >
          {getCookie("user-role") === "1" && (
            <Link to="/add-student">
              <Button variant="contained" color="success">
                Apply Loan
              </Button>
            </Link>
          )}

          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </header>
      <main>
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}

export default Layout;
