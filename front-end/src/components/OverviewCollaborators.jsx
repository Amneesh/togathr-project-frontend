import React, { useEffect, useState } from "react";
// import { getCollaboratorName, getCollaboratorsData } from "../api/loginApi";
import { readSingleDataFromMongo, readDataFromMongoWithParam } from "../../api/mongoRoutingFile";

const OverviewCollaborators = ({ active }) => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    getCollaboratorsDataFromDB();
  }, []);

  const getCollaboratorsDataFromDB = async () => {
    const id = localStorage.getItem("eventId");
    readSingleDataFromMongo("events", id)
      .then(async (response) => {
        console.log("Response from single:", response.collaborators);
        const collaboratorsList = response.collaborators;
        if (collaboratorsList) {
          const imgs = await Promise.all(
            collaboratorsList.map(async (colab) => {
              console.log('colab', colab);
              const queryParams = {
                and: [
                  { "email": colab },
                ]
              }

              const result = await readDataFromMongoWithParam(
                "users",
                JSON.stringify(queryParams)
              );
              console.log('result',result[0].image);
              return (
                result[0].image ||
                "https://togather-aws-image.s3.us-east-1.amazonaws.com/test13@mail.com_profilePicture"
              );
            })
          );
          setImages(imgs);
        }
      })
      .catch((error) => {
        console.error("Failed to get data:", error);
      });

    // const response = await getCollaboratorsData({ id });
    // if (response.status === 200 && response.data && response.data.collaborators) {
    //   const collaboratorsList = response.data.collaborators;
    //   console.log("kim", response.data);
    //   if (collaboratorsList) {
    //     // Use Promise.all to wait for all asynchronous calls
    //     const imgs = await Promise.all(
    //       collaboratorsList.map(async (colab) => {
    //         const collaboratorData = await getCollaboratorName(colab);
    //         return (
    //           collaboratorData?.data?.image ||
    //           "https://togather-aws-image.s3.us-east-1.amazonaws.com/test13@mail.com_profilePicture"
    //         );
    //       })
    //     );
    //     setImages(imgs);
    //   }
    // }
  };

  const handleViewMore = () => {
    console.log("View More");
    active("collaborators");
  };

  useEffect(() => {
    console.log("in eff", images);
  }, [images]);

  return (
    <div className="all-clbs-overview">
      <div className="all-clbs-overview-header">
        <h3>Collaborators</h3>
        <button className="button-purple" onClick={() => handleViewMore()}>
          View More
        </button>
      </div>
      <div className="all-clbs-overview-body">
        <div className="all-clbs-overview-body-item">
          <h5>Add friends, family or teammates to help with your planning!</h5>
          <button
            className="button-purple-fill"
            onClick={() => handleViewMore()}
          >
            Invite Collaborators
          </button>
        </div>
        <div className="all-clbs-overview-image-container">
          <div className="all-clbs-images">
            {images.length > 0 ? (
              images.map((img, index) => (
                <img key={index} src={img} alt="CollaboratorImage" />
              ))
            ) : (
              <p>No Person in this event</p>
            )}
          </div>

          <p>{images.length} Person</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewCollaborators;
