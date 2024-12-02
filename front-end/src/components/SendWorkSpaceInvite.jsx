import React, { useState } from "react";
import { useSnackbar } from "./SnackbarContext";
import axios from "axios";

const SendWorkSpaceInvite = () => {
  const showSnackbar = useSnackbar();
  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const subject = "Join the Event Workspace";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (email) => emailRegex.test(email);

  const generateLink = () => {
    const eventId = localStorage.getItem("eventId");
    if (eventId) {
      return `https://togathr.ca/join-workspace/${eventId}`;
    }
  };

  const handleInvite = () => {
    console.log("Input value:", inputValue);
    if (!validateEmail(inputValue)) {
      showSnackbar("Oops!", "Please enter a valid email address.", "#FBECE7");
      return;
    }
    setEmail(inputValue);
    const link = generateLink();
    console.log("link", link);
    if (link) {
      const userData = localStorage.getItem("user-info");
      const userDataObj = JSON.parse(userData);
      const userName = userDataObj?.name || "Event Creator";

      const msg = `
      <p>You're invited to collaborate on our event planning workspace!
      Click the link to <a href="${link}" target="_blank" rel="noopener noreferrer">Join workspace</a>
      </p>
    
       <p>Best regards, ${userName}</p>
     `;

      setMessage(msg);
      if (msg && inputValue) {
        sendWorkSpaceInvite(msg, inputValue);
      }
    } else {
      alert("Failed to generate a shareable link.");
    }
  };

  const sendWorkSpaceInvite = async (msg, inputValue) => {
    // console.log("email", email, subject, message);
    const emailFormatData = [
      { 'email': email || inputValue, 'first_name': "buddy", 'last_name': "" },
    ];
    const data = {
      'email': JSON.stringify(email || inputValue),
      'subject': subject,
      'message': message || msg,
      'nameOfGuest': "buddy",
      'guestAllData': JSON.stringify(emailFormatData),
      "emailType": "collaborate"
    };
    try {
      const response = await axios.post(
        "https://togather-project-backend.vercel.app/api/email",
        data
      );
      if (
        response.data.message === "Email sent successfully" ||
        response.data
      ) {
        console.log("data after", response.data);
        showSnackbar(
          "Invitation Sent",
          "Email has been sent! Wait for the recipient to join the workspace."
        );
      } else {
        showSnackbar("Oops!", "Error in sending email", "#FBECE7");
      }

      setInputValue("");
    } catch (error) {
      showSnackbar("Oops!", "Error in sending email", "#FBECE7");
    }
  };

  return (
    <div className="share-workspace">
      <div className="svg-container">
        <svg
          width="335"
          height="263"
          viewBox="0 0 335 263"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="svg-background"
        >
          <path
            opacity="0.5"
            d="M53.5426 262C19.7249 234.211 -32.2648 167.081 30.3184 120.875C108.547 63.1169 200.833 207.511 239.948 120.875C279.062 34.238 242.392 16.2568 176.387 1"
            stroke="#F500E5"
          />
          <path
            opacity="0.5"
            d="M137.663 262C94.0326 181.518 72.2174 33.0558 334 83.0657"
            stroke="#F500E5"
          />
          <path
            opacity="0.5"
            d="M20.5809 1C11.2423 64.8365 38.8521 206.408 224 262"
            stroke="#F500E5"
          />
        </svg>
      </div>

      <h2 className="share-workspace-header">
        Add friends, family or teammates to help you with your planning!
      </h2>

      <div className="share-workspace-content">
        <h5>Enter your collaborator's Email</h5>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button onClick={handleInvite}>
          Send Invite
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.35584 9.03704L13.1089 9.03704L7.97313 14.1728C7.57806 14.6173 7.57806 15.2593 7.97313 15.7037C8.36819 16.0988 9.05955 16.0988 9.45461 15.7037L16.4176 8.74074C16.8126 8.34568 16.8126 7.65432 16.4176 7.25926L9.45461 0.296297C9.05954 -0.0987657 8.36819 -0.0987656 7.97313 0.296297C7.57806 0.740742 7.57806 1.38272 7.97313 1.82716L13.1089 6.96296L1.35584 6.96296C0.763249 6.96296 0.269422 7.40741 0.269422 8C0.269422 8.59259 0.763249 9.03704 1.35584 9.03704Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SendWorkSpaceInvite;
