import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/service";

export function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = React.useState("");

  const getData = async () => {
    try {
      const result = await axiosInstance.get(`/student/${id}`);
      setData(result.data);
    } catch (error) {
      navigate("/login");
    }
  };
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{
            // bgcolor: "#cfe8fc",
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={5} xl={5} p={2}>
              <Box display={"flex"} justifyContent={"center"}>
                <img
                  src={data?.profileImage?.url}
                  alt="alt"
                  style={{ width: "300px", height: "300px" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <p>FirstName:{`${data.firstName} ${data.lastName}`}</p>
              <p>FatherName:{data.fatherName}</p>
              <p>Date of birth:{data.dob}</p>
              <p>Phone number:{data.phoneNumber}</p>
              <p>city:{data.city}</p>
              <p>address:{data.address}</p>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
}
