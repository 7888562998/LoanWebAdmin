import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";

export const LogIn = () => {
  const navigate = useNavigate();
  return (
    <div className="login-container">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            setSubmitting(false);
            const data = {
              email: values.email,
              password: values.password,
            };

            try {
              const result = await axiosInstance.post("/login", data);
              if (result.status === 200) {
                console.log("result.data.user",result.data.user[0].role)
                document.cookie = "user-token=" + result.data.token;
                document.cookie = "user-role=" + result.data.user[0].role;
                toast.success("successfully logged in");
                setTimeout(() => {
                  navigate("/");
                }, 5000);
              }
            } catch (error) {
              toast.error("Invalid password or email");
              console.log(error);
            }
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Container maxWidth="sm" id="login-container">
            <form onSubmit={handleSubmit} className="addStudent">
              <input
                type="text"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                value={values.email}
              />
              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                value={values.password}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    margin: "10px",
                    width: "24%",
                    padding: "8px",
                    borderRadius: "5px",
                    background: "green",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Login
                </button>
              </div>
            </form>
          </Container>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
};
