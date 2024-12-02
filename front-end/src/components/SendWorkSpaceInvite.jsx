import React, { useEffect, useState } from "react";
import { sendEmailToInvite } from "../../api/loginApi";
import { generateWorkspaceLink } from "../../api/loginApi";
import { useSnackbar } from './SnackbarContext';
// import { ReactComponent as ShareWorkspaceBg } from '../resources/assets/svgImages/email_bg.svg';

const SendWorkSpaceInvite = () => {
  const showSnackbar = useSnackbar();
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [shareableLink, setShareableLink] = useState("");
  const userData = localStorage.getItem("user-info");
  const userDataObj = JSON.parse(userData);
  const userId = userDataObj.email;
  const subject = "Join the Event Workspace";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // const [eventId, seteventId] = useState(localStorage.getItem("eventId"));


  const validateEmail = (email) => emailRegex.test(email);

  const handleInvite = async () => {
    console.log("Input value:", inputValue);

    if (!validateEmail(inputValue)) {
      showSnackbar('Oops!',"Please enter a valid email address.", '#FBECE7');
      return;
    }
  

    try {
      const link = await generateLink(); 
      console.log('link', link)
      if (!!link) {
        const userData = localStorage.getItem("user-info");
        const userDataObj = JSON.parse(userData);
        const userName = userDataObj?.name || "Event Creator";
        const msg = `Hello, You're invited to collaborate on our event planning workspace!
        **Join us here:** ${link}
        Best regards, 
        ${userName}`;
        setMessage(msg); 
        if (message && link) {
          sendWorkSpaceInvite(inputValue, msg);
        }
      } else {
        alert("Failed to generate a shareable link.");
      }
    } catch (error) {
      console.error("Error generating link or sending invite:", error);
    }
  };

    // useEffect(() => {
    //   generateLink();
    // }, []);



  const generateLink = async () => {

    try {
      const eventId = localStorage.getItem("eventId");
      if (eventId) {
        const result = await generateWorkspaceLink({ eventId });
        console.log('link generate hogya', result)
        const link = result.data.shareableLink;
        if (!link) {
          const result = await generateWorkspaceLink({ eventId });
          const link2 = result.data.shareableLink;
          setShareableLink(link2); 
          return link2; 
        }
        setShareableLink(link); 
        return link; 
      } else {
        setShareableLink("No event has been created yet");
        return null;
      }
    } catch (error) {
      console.error("Error generating link:", error);
      return null;
    }
  };

  const sendWorkSpaceInvite = async (inputValue, msg) => {
    const email = inputValue;
    const mesg = message || msg;
    console.log("email", email, subject, message);
    const dataToSend = {
      email,
      subject,
      message,
    };
    try {
      const response = await sendEmailToInvite(dataToSend);
      console.log("response", response);
      showSnackbar('Invitation Sent', 'Email has been sent! Wait for the recipient to join the workspace.');
      setInputValue('');
    } catch (error) {
      showSnackbar('Oops!',"Error in sending email", '#FBECE7');
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
