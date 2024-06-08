import React, {  useState } from "react";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const Login = () => {
  const Navigate = useNavigate();

  const [fpkey, setFpkey] = useState(0);
  const [buttonMessage, setButtonMessage] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(0);

  const handleForgetPasswordClick = () => {
    if (fpkey === 0) {
      setFpkey(1);
      setButtonMessage("Change Password");
    }
  };

  const AlertButton = (text) => {
    alert(`Login: ${text}`);
    Navigate('upload', {state:{email}});
  };

  const handleLogin = async () => {
    if (fpkey === 0) {
      setLoading(1);
      const response = await axios.post(
        "https://ams-server-0djz.onrender.com/login",
        {
          email:email.toLowerCase(),
          password,
        }
      );

      if (response.data.key === 1) {
        setLoading(0);
        try {
          localStorage.setItem("amsemail", email);
          AlertButton("Login Successful");
        } catch (error) {
          console.log("Error while storing user details");
        }
      } else {
        setLoading(0);
        alert(`Login Failed: ${response.data.message}`);
      }
    } else if (fpkey === 1) {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      setLoading(1);
      const response = await axios.post(
        "https://ams-server-0djz.onrender.com/forget-password",
        {
          email,
          newPassword,
          confirmPassword,
        }
      );
      setLoading(0);
      if (response.data.key === 1) {
        setFpkey(0);
        setButtonMessage("Login");
        alert(`Password Reset: ${response.data.message}`);
      } else {
        alert(`Password Reset Failed: ${response.data.message}`);
      }
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={{ marginTop: 60, width: "80%" }}>
        <div style={styles.topContainer}>
          <h2 style={styles.heading}>Login</h2>
        </div>

        <div style={styles.formContainer}>
          <h3 style={{ fontSize: 30, fontWeight: "bold", textAlign: "left" }}>
            Welcome
          </h3>
          <p style={styles.subHeading}>Sign in to continue!</p>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Email ID</label>
            <input
              type="email"
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {fpkey === 0 ? (
            <div style={styles.inputContainer}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleForgetPasswordClick} style={styles.forgetPassword}>
                Forget Password?
              </button>
            </div>
          ) : (
            <>
              <div style={styles.inputContainer}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  style={styles.input}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  style={styles.input}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}
          {fpkey === 1 && (
            <button
              onClick={() => {
                setFpkey(0);
                setButtonMessage("Login");
              }}
              style={{
                margin: "auto",
                padding: "4px 8px",
                borderColor: "#ff4c24",
                borderRadius: 5,
                borderWidth: 1,
                width: "80%",
              }}
            >
              <span style={{ textAlign: "center", color: "purple" }}>Back to login</span>
            </button>
          )}
          <button
            onClick={handleLogin}
            style={{
              marginTop: 10,
              backgroundColor: "#ff4c24",
              width: "80%",
              margin: "auto",
              height: 35,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
              display: "flex",
            }}
          >
            {loading === 1 ? (
              <div className="spinner" style={{ color: "#ffffff" }}>Loading...</div>
            ) : (
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  textAlign: "center",
                  color: "white",
                }}
              >
                {buttonMessage}
              </span>
            )}
          </button>
          <div style={styles.signupContainer}>
            <span style={styles.signupText}>I'm a new user.</span>
            <button onClick={() => Navigate('signup')} style={styles.signupLink}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    borderColor: "black",
    borderWidth: 1,
    width: "100%",
    height:'100vh',
    backgroundColor: "#eee",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    // Add styles for your header if needed
  },
  topContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  heading: {
    fontSize: 38,
    fontWeight: 500,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666666",
    marginBottom: 16,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: "100%",
  },
  forgetPassword: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6610f2",
    marginTop: 8,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  signupContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666666",
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6610f2",
    marginLeft: 4,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
};

