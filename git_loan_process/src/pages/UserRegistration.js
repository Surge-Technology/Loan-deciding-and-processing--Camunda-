/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper, Box, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const UserRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BASE_URL;

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
   onSubmit: async (values) => {
      try {
        // Define the base URL from environment variable

        // Make the API call
        const response = await axios.post(`${URL}/createUser`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle successful response
        if (response.status === 200) {
          Swal.fire({
            title: "SignUp Successful!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/customerForm");
          });
        } else {
          // Handle error if needed
          Swal.fire({
            title: "Error!",
            text: "There was an error while creating your account. Please try again.",
            icon: "error",
            confirmButtonText: "Retry",
          });
        }
      } catch (error) {
        // Handle any network or API call errors
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Paper elevation={6} style={{ padding: "20px", marginTop: "40px", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Sign up
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          {/* Name Field */}
          <TextField
            fullWidth
            label="Name"
            name="username"
            variant="outlined"
            margin="normal"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            // variant="outlined"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />


          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button fullWidth type="submit" variant="contained" color="primary" style={{ marginTop: "20px" }}>
            Sign Up
          </Button>

          <Typography variant="body2" style={{ marginTop: "15px", cursor: "pointer" }} onClick={() => navigate("/loginPage")}>
            Already have an account? <span style={{ color: "#007bff" }}>Log In</span>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default UserRegistration;
