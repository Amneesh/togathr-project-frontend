import React from "react";
import Modal from './ModalPopupBox';
import { useState, useEffect } from "react";
import { addCollaborator, joinWorkspace } from "../../api/loginApi.js";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {Link} from 'react-router-dom';

export const JoinWorkspace = ({eventID}) => {
  const { workspaceLink } = useParams();
  const [message, setMessage] = useState("Joining the workspace...");
  const [newEventID, setNewEventID] = useState(eventID);
  const navigate = useNavigate();

  const handleJoinWorkSpace = () => {
    const userData = localStorage.getItem("user-info");
    const userDataObj = JSON.parse(userData);
    const userId = userDataObj?.email;

    if (newEventID && userId) {
      joinWorkspace({ newEventID, userId })
        .then((response) => {
          console.log("response", response);
          localStorage.setItem("eventId", newEventID);
          setMessage("Successfully joined the workspace!");
          document.getElementById('joinWorkSpace').style = 'display: none';
          // const collaboratorId =  addCollaborator({userId});
          // console.log('response', collaboratorId);
          // const { eventId } = response.data;
          // navigate(`/workspace/${eventId}`);
        })
        .catch((error) => {
          console.error("Error joining workspace:", error);
          setMessage("Failed to join the workspace. Please try again.");
        });
    } else {
      setMessage("Invalid workspace link or information.");
    }
  }
 
  // useEffect(() => {
  //   const userData = localStorage.getItem("user-info");
  //   const userDataObj = JSON.parse(userData);
  //   const userId = userDataObj?.email;
  //   // const id = localStorage.getItem("eventId");
  //   console.log('workspace', newEventID, userId)
  //   if (newEventID && userId) {
  //     joinWorkspace({ newEventID, userId })
  //       .then((response) => {
  //         console.log("response", response);
  //         localStorage.setItem("eventId", newEventID);
  //         setMessage("Successfully joined the workspace!");
  //         // const collaboratorId =  addCollaborator({userId});
  //         // console.log('response', collaboratorId);
  //         // const { eventId } = response.data;
  //         // navigate(`/workspace/${eventId}`);
  //       })
  //       .catch((error) => {
  //         console.error("Error joining workspace:", error);
  //         setMessage("Failed to join the workspace. Please try again.");
  //       });
  //   } else {
  //     setMessage("Invalid workspace link or information.");
  //   }
  // }, [workspaceLink, navigate]);
  return (
    <div className="join-workspace-container">
      <h1>You have been invited to join the planning team of event.</h1>
      <h2>{message}</h2>
      <Link className="home-page-btn"
        to="/home"
        // className="w-full py-2 px-4 my-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Go to Home Page
      </Link>
      <Modal
        className="join-wrkspc-btn"
        buttonId="joinWorkSpace"
        buttonLabel="Join Workspace"
        modalHeaderTitle="Join Workspace"
        // modalBodyHeader=""
        modalBodyContent={<p>Are you sure you want to join workspace? </p>}
        saveDataAndOpenName="Yes"
        saveDataAndOpenId="yes"
        saveDataAndOpenFunction={() => handleJoinWorkSpace()}
        buttonAlign="column"
        onModalClose={() => console.log("Modal 1 closed")}
        closeModalAfterDataSend="true"
      />
    </div>
  );
};
