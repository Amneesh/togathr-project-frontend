import React from "react";
import Modal from "./ModalPopupBox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  readSingleDataFromMongo,
  updateDataInMongo,
} from "../../api/mongoRoutingFile";

export const JoinWorkspace = () => {
  // console.log(eventID, 'agyi oye event id');
  const [eventID, setEventID] = useState(localStorage.getItem('workspace-id') || []);

  const [message, setMessage] = useState("Joining the workspace...");
  const [collaborators, setCollaborators] = useState([]);
  const navigate = useNavigate();

  const handleJoinWorkSpace = () => {
    const userData = localStorage.getItem("user-info");
    const userDataObj = JSON.parse(userData);
    const userId = userDataObj?.email;
    if (eventID && userId) {
      joinWorkSpaceEvent(eventID, userId);
    } else {
      setMessage("Invalid workspace link or information.");
    }
  };

  const joinWorkSpaceEvent = (eventID, userId) => {
    readSingleDataFromMongo("events", eventID)
      .then(async (response) => {
        console.log("Response from single:", response.collaborators);
        const collaboratorsList = response.collaborators;
        setCollaborators(collaboratorsList);
        console.log(collaboratorsList.includes(userId));
        if (!collaboratorsList.includes(userId)) {
          collaboratorsList.push(userId);
          const dataToUpdate = {
            collaborators: collaboratorsList,
          };
          updateDataInMongo("events", eventID, dataToUpdate).then(
            (response) => {
              console.log("response from updated", response);
              document.getElementById("joinWorkSpace").style = "display: none";
              localStorage.setItem("eventId", eventID);
              setMessage("Successfully joined the workspace!");
            }
          );
        } else {
          setMessage("You are already in workspace, Please go to homepage!");
          console.log("User is already a collaborator");
        }
      })
      .catch((error) => {
        setMessage("This event does not exist.");
      });
  };

  return (
    <div className="join-workspace-container">
      <h1>You have been invited to join the planning team of event.</h1>
      <h2>{message}</h2>
      <Link
        className="home-page-btn"
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
