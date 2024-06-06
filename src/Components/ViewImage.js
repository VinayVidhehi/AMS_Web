import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import Header from "./Header";

const ViewImage = () => {
  const [imageBase64, setImageBase64] = useState("");
  const [students, setStudents] = useState([]);
  const [email, setEmail] = useState("");
  const [uploadStatus, setUploadStatus] = useState(""); // State to track upload status
  const location = useLocation();

  useEffect(() => {
    const handleSetEmail = () => {
      if (location.state !== null || location.state !== undefined) {
        console.log("email is ", location.state.email);
        setEmail(location.state.email);
      }
    };
    handleSetEmail();
  }, [location.state]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setImageBase64(base64String);
        sendImageInChunks(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendImageInChunks = async (base64String) => {
    const chunkSize = 1024 * 64; // Define the size of each chunk
    const totalChunks = Math.ceil(base64String.length / chunkSize);
    console.log("base64", base64String);
    setUploadStatus("Uploading"); // Set upload status to "Uploading"
    try {
      for (let i = 0; i < totalChunks; i++) {
        const chunk = base64String.slice(i * chunkSize, (i + 1) * chunkSize);
        const isLastChunk = i === totalChunks - 1;
        const response = await axios.post("http://127.0.0.1:5000/predict", {
          email,
          chunk,
          sequenceNumber: i,
          isLastChunk,
        });
        if (response.data.key === 0) {
          setUploadStatus("Error"); // Set status to "Error" if upload fails
          return;
        }
        if (response.data.key === 2) {
          console.log("got response");
          setStudents(response.data.predictions);
        }
        console.log("response data is ", response.json, response.data);
      }
      setUploadStatus("Success"); // Set upload status to "Success"
    } catch (error) {
      console.error("Error uploading image in chunks:", error);
      setUploadStatus("Error"); // Set status to "Error" on exception
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        paddingBottom: 2,
        backgroundColor: "#eee",
        height: "100vh",
        marginX: 0,
        textAlign: "center",
      }}
    >
      <Header />
      <p
        style={{
          color: "gray",
          fontSize: 20,
          width: "90%",
          margin: "auto",
          paddingTop: 20,
        }}
      >
        Help us train our face recognition model better by taking a selfie of
        yours or in a group, no restrictions but comment down the error if you
        had of any sort.{" "}
      </p>
      <Button
        variant="contained"
        component="label"
        startIcon={<PhotoCamera />}
        sx={{ marginTop: 10 }}
      >
        Upload Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </Button>
      {uploadStatus === "Uploading" && (
        <Typography variant="body1" color="gray" sx={{ marginTop: 2 }}>
          Please wait, uploading image...
        </Typography>
      )}
      {uploadStatus === "Success" && (
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="body1" color="gray">
            is this you?
          </Typography>
          <div>
            <ul>
              {students.map((usn, index) => (
                <li key={index}>{usn}</li>
              ))}
            </ul>
          </div>
          <img
            src={`data:image/jpeg;base64,${imageBase64}`}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: 200, marginTop: 10 }}
          />
        </Box>
      )}
      {uploadStatus === "Error" && (
        <Typography variant="body1" color="red" sx={{ marginTop: 2 }}>
          Error uploading image. Please try again.
        </Typography>
      )}
    </Box>
  );
};

export default ViewImage;
