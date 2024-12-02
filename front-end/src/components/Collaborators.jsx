import React, { useEffect, useState } from 'react';
import { 
  getCollaboratorsName,
  getCollaboratorsData
} from "../../api/loginApi";
import SendWorkSpaceInvite from './SendWorkSpaceInvite';
import Collaborator from './Collaborator';
import { readSingleDataFromMongo } from "../../api/mongoRoutingFile";

const Collaborators = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [allCollaborators, setAllCollaborators] = useState([]);
  useEffect(() => {
    const eventId = localStorage.getItem("eventId");
    const userData = localStorage.getItem("user-info");
    const userDataObj = JSON.parse(userData);
    const userId = userDataObj.email;
    if (eventId) {
      getCollaboratorsFromDb(userId);
    }
  }, []);

  const getCollaboratorsFromDb = async (userId) => {
    const id = localStorage.getItem("eventId");
    if (id) {
      readSingleDataFromMongo("events", id)
      .then(async (response) => {
        console.log("Response from single:", response.collaborators);
        const collaboratorsList = response.collaborators;
        setAllCollaborators(collaboratorsList);
      //  const colabList = collaboratorsList.filter(collaborator => collaborator !== userId);
        setCollaborators(collaboratorsList);
      })
      .catch((error) => {
        console.error("Failed to get data:", error);
      });
      // const result = await getCollaboratorsData({ id });
      // // console.log("res collab in front end", result);
      // const collaboratorsList = result.data.collaborators;
      // // console.log("collaboratorsData", collaboratorsList);
      // const colabList = collaboratorsList.filter(collaborator => collaborator !== userId);
      // setCollaborators(colabList);
    } else {
      console.log("No event has been created yet");
    }
  };

  return (
    <div className='collaborators-header'>
      <SendWorkSpaceInvite />
      <h3>Your Collaborators</h3>
      <div  className='collaborators-container'>
        {(collaborators.length > 0) ? collaborators.map((collaborator, index) => {
          return <Collaborator key={index} collaborator={collaborator} allCollaborators={allCollaborators}/>;
        }) : <h5>No collaborators have been added yet</h5>}
      </div>
    </div>
  );
}

export default Collaborators