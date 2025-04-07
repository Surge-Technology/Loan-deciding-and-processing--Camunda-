/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/UserRegistration.css';


const SignInPage = () => {
  const [email, setEmail] = useState('');  // Treat everything as email
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [headerError, setHeaderError] = useState('');
  const [serverError, setServerError] = useState(''); // To store error from the API response
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    let newErrors = {};
    setHeaderError(''); // Reset header error
    setServerError(''); // Reset server error

    // Validation: Check if email is provided
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    }

    // Validation: Check if password is empty
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);

    // If no errors, make the API call
    if (Object.keys(newErrors).length === 0) {
      try {
        // Make the POST request to login using email
        const response = await axios.post(`${URL}/login`, {
          email: email.trim(),  // Send email as the key
          password,
        });

        // If the response is successful, navigate to taskInbox

        if (response.status === 200) {
        const userName= localStorage.setItem("username", response.data.userName);
        console.log(response.data.userName);
        const approverRoles = ["InitialApprover", "UnderWriter", "LegalApprover", "DisbursementOfficer","LoanOfficer"];

        if (approverRoles.includes(response.data.userName)) {
          navigate("/loanApproverDashboard");
        } else {
          const EmailId= localStorage.setItem("email", response.data.email);

          navigate("/applicantDashboard");
        }
      
        console.log('Login successful:', response.data);
        } else {
          setServerError('Invalid credentials, please try again.');
        }
      } catch (error) {
        console.error('Login failed:', error);
        
        // Check if error response exists, then display it
        if (error.response && error.response.data) {
          setServerError('Invalid credentials, please try again.');

          // setServerError(error.response.data.message || 'Something went wrong. Please try again later.');
        } else {
          setServerError('Something went wrong. Please try again later.');
        }
      }
    }
  };

  return (
    <div>
    <section className="login-CA" >
    <Container maxWidth="xs" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Paper elevation={6} style={{ padding: '20px', width: '100%', marginTop: '40px', textAlign: 'center' }}>
    <Typography variant="h4" gutterBottom>
    Login
    </Typography>

        {/* Show Header Error Message when both fields are empty */}
        {headerError && (
          <Box mt={2} p={1} style={{ backgroundColor: '#ffdddd', color: '#d32f2f', textAlign: 'center', borderRadius: '5px' }}>
            {headerError}
          </Box>
        )}

        {/* Show Server Error Message if login fails */}
        {serverError && (
          <Box mt={2} p={1} style={{ backgroundColor: '#ffdddd', color: '#d32f2f', textAlign: 'center', borderRadius: '5px' }}>
            {serverError}
          </Box>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '10px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Email/UserName"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Log In
              </Button>
            </Grid>
          </Grid>
          <Typography variant="body2" style={{ marginTop: '15px', cursor: 'pointer' }} onClick={() => navigate('/UserRegistration')}>
            Create an account <span style={{ color: '#007bff' }}>Create Account</span>
          </Typography>
        </form>
      </Paper>
    </Container>
    </section>
    </div>
  );
};

export default SignInPage;
