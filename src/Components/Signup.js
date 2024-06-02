import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [authenticate, setAuthenticate] = useState(0);
  const [buttonMessage, setButtonMessage] = useState('Request OTP');
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    confirmPassword: '',
    usn: '',
  });
  const [isFormValid, setIsFormValid] = useState('');

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = (data) => {
    if (!data.email.endsWith('@rvce.edu.in')) {
      setIsFormValid('Email should end with @rvce.edu.in');
      return false;
    }

    if (authenticate === 2) {
      if (data.name.length < 3) {
        setIsFormValid('Name should contain at least 3 characters');
        return false;
      }

      if (data.password.length < 6) {
        setIsFormValid('Password should be at least 6 characters long');
        return false;
      }

      if (data.password !== data.confirmPassword) {
        setIsFormValid('Passwords do not match');
        return false;
      }

      if (data.usn.length === 0) {
        setIsFormValid('USN cannot be empty');
        return false;
      }
    }
    setIsFormValid('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm(formData)) {
      return;
    }
    setLoading(true);
    alert("Please be patient till you receive OTP, it will take around a minute for the OTP to reach your mail")

    try {
      if (authenticate === 0) {
        const response = await axios.post(
          'https://ams-server-0djz.onrender.com/signup',
          {
            key: 0,
            email: formData.email.toLowerCase(),
          }
        );

        if (response.data.key === 1) {
          setAuthenticate(1);
          setButtonMessage('Verify OTP');
          alert('OTP sent. Please enter the OTP sent to your mail ID to verify your email.');
        }
      } else if (authenticate === 1) {
        const response = await axios.post(
          'https://ams-server-0djz.onrender.com/signup',
          {
            email: formData.email.toLowerCase(),
            otp: formData.otp,
            key: 1,
          }
        );

        if (response.data.key === 1) {
          setAuthenticate(2);
          setButtonMessage('Signup');
          alert('Your email is verified and safe with us. Please fill up the details to finish signing up.');
        } else {
          setIsFormValid('Wrong OTP, try again with the right one');
        }
      } else {
        const response = await axios.post(
          'https://ams-server-0djz.onrender.com/signup',
          {
            email: formData.email.toLowerCase(),
            name: formData.name,
            password: formData.password,
            usn: formData.usn,
          }
        );

        if (response.data.key === 1) {
          alert('Signup successful. Please login to continue.');
          navigate('/');
        } else {
          alert(`Error: ${response.data.message}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{width:'100%', margin:0, padding:0, backgroundColor:'#eee', height:'100vh'}}>
      <Header />
      <Box sx={{ pt: 4, width:'85%', margin:'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom style={{fontWeight:500}}>
          Signup
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={isFormValid && !formData.email.endsWith('@rvce.edu.in')}
            helperText="Email should be a valid RVCE email address."
          />
          {authenticate === 1 && (
            <TextField
              fullWidth
              margin="normal"
              label="OTP"
              value={formData.otp}
              onChange={(e) => handleChange('otp', e.target.value)}
              helperText="OTP should be a valid OTP code."
            />
          )}
          {authenticate === 2 && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                helperText="Name should contain at least 3 characters."
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                helperText="Password should be at least 6 characters long."
              />
              <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                helperText="Confirm password should match the password."
              />
              <TextField
                fullWidth
                margin="normal"
                label="USN"
                value={formData.usn}
                onChange={(e) => handleChange('usn', e.target.value)}
                helperText="USN should not be empty."
              />
            </>
          )}
          {isFormValid && <Alert severity="error">{isFormValid}</Alert>}
          <Box sx={{ mt: 2,  }}>
            <Button
            style={{backgroundColor:'#ff4c24',}}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : buttonMessage}
            </Button>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center', }}>
            <Typography variant="body2">
              Already signed up?{' '}
              <Button onClick={() => navigate('/')} variant="text">
                Login
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
