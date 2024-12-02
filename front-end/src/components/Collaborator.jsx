import React, { useState, useEffect } from "react";
import {
  getTaskListBasedOnCollaborator,
  assignTaskToCollaborator,
  getCollaboratorName,
  changeTaskCompletionStatus,
  deleteCollaborator,
  deleteTask,
  unAssignTaskFromCollaborator,
  getCollaboratorsName,
  editTaskItem,
} from "../../api/loginApi";
import { useSnackbar } from "./SnackbarContext";
import Dropdown from "react-bootstrap/Dropdown";
import {
  readSingleDataFromMongo,
  readDataFromMongoWithParam,
  updateDataInMongo,
  DeleteDataInMongo,
} from "../../api/mongoRoutingFile";

const Collaborator = ({ collaborator, allCollaborators }) => {
  console.log("get all allCollaborators", allCollaborators);
  const showSnackbar = useSnackbar();
  const [isActiveStatus, setIsActiveStatus] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [inCompleteTasks, setInCompleteTasks] = useState([]);
  const [collaboratorName, setCollaboratorName] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [unAssignedTasks, setUnAssignedTasks] = useState([]);
  const [image, setImage] = useState(
    "https://togather-aws-image.s3.us-east-1.amazonaws.com/test13@mail.com_profilePicture"
  );
  const [eventID, setEventID] = useState(localStorage.getItem("eventId"));

  // Modal PopUp Box
  const [modalActive, setModalActive] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editTaskAssignedTo, setEditTaskAssignedTo] = useState("");
  const [users, setUsers] = useState([]);
  const [taskIdToEdit, setTaskIdToEdit] = useState("");

  useEffect(() => {
    const getCollaboratorInfo = async () => {
      try {
        // live backend api call
        const queryParams = {
          and: [
            { "email": collaborator },
          ]
        };
        const result = await readDataFromMongoWithParam(
          "users",
          JSON.stringify(queryParams)
        );
        // inbuilt backend api call
        // const userInfo = await getCollaboratorName(collaborator);
        setCollaboratorName(result[0].name);
        setIsActiveStatus(result[0].isActive);
        const img =
          result[0].image ||
          "https://togather-aws-image.s3.us-east-1.amazonaws.com/test13@mail.com_profilePicture";
        setImage(img);
      } catch (error) {
        console.error("Error fetching collaborator name:", error);
      }
    };

    getCollaboratorInfo();
  }, [collaborator, eventID]);

  const getEventID = () => {
    const currentEventID = localStorage.getItem("eventId");
    setEventID(currentEventID);
  };

  useEffect(() => {
    getEventID();

    const handleStorageChange = (event) => {
      if (event.key === "eventId") {
        getEventID();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    const intervalId = setInterval(() => {
      const currentEventID = localStorage.getItem("eventId");
      if (currentEventID !== eventID) {
        getEventID();
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [eventID]);

  const getTasks = async () => {
    const eventId = localStorage.getItem("eventId");
    // live backend api call
    allCollaborators.map(async (collaborator) => {
      const queryParamsToPass = {
        and: [
          { "email": collaborator },
        ]
      };
      const user = await readDataFromMongoWithParam(
        "users",
        JSON.stringify(queryParamsToPass)
      )
        .then(async (response) => {
          console.log("Response in collaborator from users:", response);
          return response;
        })
        .catch((error) => {
          console.error("Failed to get data:", error);
        });
      setUsers(user[0].firstName || user[0].name);
    })

    // inbuilt backend api call
    // const collaborators = await getCollaboratorsName({ eventId });
    // console.log("inbuilt response", collaborators.data);
    // setUsers(collaborators.data.uniqueNames);

    if (collaborator) {
      // live backend api call
      const queryParams = {
        and: [{ event: eventId }],
      };
      console.log("calling before api call", eventId);
      const result = await readDataFromMongoWithParam(
        "tasks",
        JSON.stringify(queryParams)
      );
      if (result) {
        console.log("Response in collaborator tasks:", result);
        const collaboratorTaskList = result || [];

        setTasks(collaboratorTaskList);
        console.log("collaboratorTaskList", collaboratorTaskList);

        const unassignedTasks = [];
        const previouslyAssignedTasks = [];

        collaboratorTaskList.forEach((task) => {
          if (task.isAssigned) {
            previouslyAssignedTasks.push({
              id: task._id || task.id,
              name: task.name,
              completed: task.completed,
              isAssigned: task.isAssigned,
              assignedTo: task.assignedTo || "",
            });
          } else {
            unassignedTasks.push({
              id: task._id || task.id,
              name: task.name,
              completed: task.completed,
              isAssigned: task.isAssigned,
              assignedTo: task.assignedTo,
            });
          }
        });

        console.log("previouslyAssignedTasks", previouslyAssignedTasks);
        if (previouslyAssignedTasks) {
          const previouslyCompletedTasks = [];
          previouslyAssignedTasks.forEach((task) => {
            if (task.completed && task.assignedTo === collaborator) {
              previouslyCompletedTasks.push({
                id: task._id || task.id,
                name: task.name,
                completed: task.completed,
                isAssigned: task.isAssigned,
                assignedTo: task.assignedTo || "",
              });
            }
          });
          console.log("compl", previouslyCompletedTasks);
          setCompletedTasks(previouslyCompletedTasks);
        }
        setUnAssignedTasks(unassignedTasks);
        setAssignedTasks(previouslyAssignedTasks);
      } else {
        console.error("Failed to get data:");
      }

      // inbuilt backend api call
      // const response = await getTaskListBasedOnCollaborator({
      //   collaborator,
      //   eventId,
      // });
      // const collaboratorTaskList = response?.data?.tasks || [];

      // setTasks(collaboratorTaskList);
      // console.log("collaboratorTaskList", collaboratorTaskList);

      // const unassignedTasks = [];
      // const previouslyAssignedTasks = [];

      // collaboratorTaskList.forEach((task) => {
      //   if (task.isAssigned) {
      //     previouslyAssignedTasks.push({
      //       id: task._id || task.id,
      //       name: task.name,
      //       completed: task.completed,
      //       isAssigned: task.isAssigned,
      //       assignedTo: task.assignedTo || "",
      //     });
      //   } else {
      //     unassignedTasks.push({
      //       id: task._id || task.id,
      //       name: task.name,
      //       completed: task.completed,
      //       isAssigned: task.isAssigned,
      //       assignedTo: task.assignedTo,
      //     });
      //   }
      // });

      // console.log("previouslyAssignedTasks", previouslyAssignedTasks);
      // if (previouslyAssignedTasks) {
      //   const previouslyCompletedTasks = [];
      //   previouslyAssignedTasks.forEach((task) => {
      //     if (task.completed && task.assignedTo === collaborator) {
      //       previouslyCompletedTasks.push({
      //         id: task._id || task.id,
      //         name: task.name,
      //         completed: task.completed,
      //         isAssigned: task.isAssigned,
      //         assignedTo: task.assignedTo || "",
      //       });
      //     }
      //   });
      //   console.log("compl", previouslyCompletedTasks);
      //   setCompletedTasks(previouslyCompletedTasks);
      // }
      // setUnAssignedTasks(unassignedTasks);
      // setAssignedTasks(previouslyAssignedTasks);
    }
  };

  useEffect(() => {
    getTasks();
  }, [eventID]);

  useEffect(() => {
    console.log("before", inCompleteTasks, completedTasks);
    getTasks();
    // const intervalId = setInterval(() => {
    //   console.log("Fetching latest tasks from backend...");
    //   getTasks();
    // }, 5000);

    // console.log('after', inCompleteTasks, completedTasks);
    // // Cleanup interval on component unmount
    // return () => clearInterval(intervalId);
  }, [collaborator]);

  useEffect(() => {
    const filteredInCompletedTaskList = assignedTasks.filter(
      (task) => task.assignedTo === collaborator && !task.completed
    );

    if (inCompleteTasks.length === 0) {
      setInCompleteTasks(filteredInCompletedTaskList);
    }
  }, [assignedTasks, collaborator, eventID]);

  const assignTask = async (taskId, userId) => {
    const id = localStorage.getItem("eventId");

    // live api call
    const dataToUpdate = {
      assignedTo: userId,
      isAssigned: true,
    };
    updateDataInMongo("tasks", taskId, dataToUpdate).then((response) => {
      console.log("response from updated", response);
      const assignedTask = tasks.find((task) => task._id === taskId);
      if (assignedTask) {
        setAssignedTasks((prevAssignedTasks) => [
          ...prevAssignedTasks,
          { ...assignedTask, assignedTo: userId, isAssigned: true },
        ]);
        if (!assignedTask.completed) {
          setInCompleteTasks((prevIncompleteTasks) => [
            ...prevIncompleteTasks,
            { ...assignedTask, assignedTo: userId, completed: false },
          ]);
        }
        setUnAssignedTasks((prevUnassignedTasks) =>
          prevUnassignedTasks.filter((task) => task.id !== taskId)
        );
      }
    });

    // inbuilt backend api call
    // const result = await assignTaskToCollaborator({ taskId, userId, id });

    // if (result.status === 200) {
    //   const assignedTask = tasks.find((task) => task._id === taskId);
    //   if (assignedTask) {
    //     setAssignedTasks((prevAssignedTasks) => [
    //       ...prevAssignedTasks,
    //       { ...assignedTask, assignedTo: userId, isAssigned: true },
    //     ]);
    //     if (!assignedTask.completed) {
    //       setInCompleteTasks((prevIncompleteTasks) => [
    //         ...prevIncompleteTasks,
    //         { ...assignedTask, assignedTo: userId, completed: false },
    //       ]);
    //     }
    //     setUnAssignedTasks((prevUnassignedTasks) =>
    //       prevUnassignedTasks.filter((task) => task.id !== taskId)
    //     );
    //   }
    // }
  };

  const handleTaskCompletionToggle = async (taskId) => {
    console.log("inCompleteTasks", inCompleteTasks, taskId);
    const taskToToggle = inCompleteTasks.find(
      (task) => task.id === taskId || task._id === taskId
    );

    console.log('incompleted', taskToToggle);
    // live backend api call
    const taskToUpdate = {
      "completed": taskToToggle ? true : false
    }
    updateDataInMongo("tasks", taskId, taskToUpdate).then(async(response) => {
      console.log('task toggle', response);
      if (response) {
        if (taskToToggle) {
          console.log("taskToToggle", taskToToggle, taskId);
          setInCompleteTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId || task._id !== taskId)
          );
          console.log("taskToToggle after", inCompleteTasks);
  
          setCompletedTasks((prevCompletedTasks) => [
            ...prevCompletedTasks,
            { ...taskToToggle, completed: true },
          ]);
        } else {
          console.log("taskToToggle", taskToToggle);
          const completedTaskToToggle = completedTasks.find(
            (task) => task.id === taskId || task._id === taskId
          );
          if (completedTaskToToggle) {
            setCompletedTasks((prevTasks) =>
              prevTasks.filter((task) => task.id !== taskId || task._id !== taskId)
            );
  
            setInCompleteTasks((prevInCompleteTasks) => [
              ...prevInCompleteTasks,
              { ...completedTaskToToggle, completed: false },
            ]);
          }
        }
        await getTasks(); // Call getTasks after toggling completion
      }
    });

    // const updatedTask = await changeTaskCompletionStatus({ taskId });
  };

  const handleDelete = async (collaborator) => {
    const eventId = localStorage.getItem("eventId");
    const result = await deleteCollaborator({ collaborator, eventId });
    if (result.status === 200) {
      showSnackbar(
        "Collaborator removed",
        "Collaborator has been removed from the event. Remember to re-assign his tasks."
      );
      await getTasks();
    } else {
      console.log("error in deletion.");
    }
  };

  const handleEditButton = (taskId, taskName) => {
    setEditTask(taskName);
    setTaskIdToEdit(taskId);
    setModalActive(true);
  };

  const handleUnassign = async (taskId) => {
    console.log("unassign the task", taskId);
    // live backend api call
    const taskToUpdate = {
      isAssigned: false,
      assignedTo: "",
      completed: false,
    };
    updateDataInMongo("tasks", taskId, taskToUpdate).then(async (response) => {
      showSnackbar(
        "Task unassigned",
        "Task has been unassigned from the collaborator."
      );
      const taskToUnassign = inCompleteTasks.find(
        (task) => task.id === taskId || task._id === taskId
      );

      if (taskToUnassign) {
        setInCompleteTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId && task._id !== taskId)
        );

        setUnAssignedTasks((prevTasks) => [
          ...prevTasks,
          { ...taskToUnassign, isAssigned: false, assignedTo: null },
        ]);
      }

      setAssignedTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId && task._id !== taskId)
      );
      await getTasks();
    });

    // inbuilt backend api call
    // const response = await unAssignTaskFromCollaborator({
    //   taskId,
    // });
    // if (response.status === 200) {
    //   showSnackbar(
    //     "Task unassigned",
    //     "Task has been unassigned from the collaborator."
    //   );
    //   const taskToUnassign = inCompleteTasks.find(
    //     (task) => task.id === taskId || task._id === taskId
    //   );

    //   if (taskToUnassign) {
    //     setInCompleteTasks((prevTasks) =>
    //       prevTasks.filter((task) => task.id !== taskId && task._id !== taskId)
    //     );

    //     setUnAssignedTasks((prevTasks) => [
    //       ...prevTasks,
    //       { ...taskToUnassign, isAssigned: false, assignedTo: null },
    //     ]);
    //   }

    //   setAssignedTasks((prevTasks) =>
    //     prevTasks.filter((task) => task.id !== taskId && task._id !== taskId)
    //   );
    //   await getTasks();
    // } else {
    //   console.log("error in unassigning task");
    // }
  };

  const handleRemove = async (taskId) => {
    console.log("remove", taskId);

    // live backend api call
    DeleteDataInMongo("tasks", taskId)
      .then(async (response) => {
        showSnackbar(
          "Delete Confirmation",
          "Task has been removed from the event. You can add new tasks to the event."
        );

        setInCompleteTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId && task._id !== taskId)
        );
        await getTasks();
      })
      .catch((error) => {
        console.error("Failed to delete data:", error);
      });

    // inbuilt backend api call
    // const resultant = await deleteTask({ taskId });
    // console.log("result", resultant);
    // if (resultant.status === 200) {
    //   showSnackbar(
    //     "Delete Confirmation",
    //     "Task has been removed from the event. You can add new tasks to the event."
    //   );

    //   setInCompleteTasks((prevTasks) =>
    //     prevTasks.filter((task) => task.id !== taskId && task._id !== taskId)
    //   );
    //   await getTasks();

    //   console.log("incompleted", inCompleteTasks);
    // }
  };

  const handleEditTask = async () => {
    console.log(
      "Edit task item",
      taskIdToEdit,
      editTask,
      editTaskAssignedTo,
      collaborator
    );

    // live backend api call
    const taskToEdit = {
      name: editTask,
    };
    updateDataInMongo("tasks", taskIdToEdit, taskToEdit).then(
      async (response) => {
        showSnackbar("Task Edited", "Task has been edited successfully.");

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskIdToEdit || task._id === taskIdToEdit
              ? { ...task, name: editTask, assignedTo: editTaskAssignedTo }
              : task
          )
        );

        setInCompleteTasks((prevInCompleteTasks) =>
          prevInCompleteTasks.map((task) =>
            task.id === taskIdToEdit || task._id === taskIdToEdit
              ? { ...task, name: editTask, assignedTo: editTaskAssignedTo }
              : task
          )
        );

        setCompletedTasks((prevCompletedTasks) =>
          prevCompletedTasks.map((task) =>
            task.id === taskIdToEdit || task._id === taskIdToEdit
              ? { ...task, name: editTask, assignedTo: editTaskAssignedTo }
              : task
          )
        );
        await getTasks();

        setModalActive(false);
        setTaskIdToEdit(null);
        setEditTask("");
        setEditTaskAssignedTo("");
      }
    );

    // inbuilt backend api call
    // const response = await editTaskItem({
    //   taskId: taskIdToEdit,
    //   taskName: editTask,
    //   assignedTo: editTaskAssignedTo,
    // });
    // if (response.status === 200) {
    //   showSnackbar("Task Edited", "Task has been edited successfully.");

    //   setTasks((prevTasks) =>
    //     prevTasks.map((task) =>
    //       task.id === taskIdToEdit || task._id === taskIdToEdit
    //         ? { ...task, name: editTask, assignedTo: editTaskAssignedTo }
    //         : task
    //     )
    //   );

    //   setInCompleteTasks((prevInCompleteTasks) =>
    //     prevInCompleteTasks.map((task) =>
    //       task.id === taskIdToEdit || task._id === taskIdToEdit
    //         ? { ...task, name: editTask, assignedTo: editTaskAssignedTo }
    //         : task
    //     )
    //   );

    //   setCompletedTasks((prevCompletedTasks) =>
    //     prevCompletedTasks.map((task) =>
    //       task.id === taskIdToEdit || task._id === taskIdToEdit
    //         ? { ...task, name: editTask, assignedTo: editTaskAssignedTo }
    //         : task
    //     )
    //   );
    //   await getTasks();

    //   setModalActive(false);
    //   setTaskIdToEdit(null);
    //   setEditTask("");
    //   setEditTaskAssignedTo("");
    // } else {
    //   showSnackbar("Error", "Error in editing the task");
    // }
  };

  return (
    <>
      <div className="custom-modal-maker">
        <div
          id="modal-container"
          className={`${
            modalActive == true
              ? "four"
              : modalActive == false
              ? "fourClose"
              : modalActive == null
              ? ""
              : ""
          }`}
        >
          <div className="modal-background">
            <div className="modal-togather">
              <div className="modal-header">
                <div className="modal-header-title">
                  <h4>Edit Task</h4>
                  <i
                    className="fa-solid fa-xmark close"
                    onClick={() => {
                      setModalActive(false);
                    }}
                  ></i>
                </div>
              </div>

              <hr />

              <div className="modal-body">
                <form>
                  <div className="form-fields">
                    <label className="form-label" htmlFor="taskName">
                      Task Description
                    </label>
                    <input
                      type="text"
                      name="taskName"
                      id="taskName"
                      placeholder="Buy Birthday Cake"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                    />
                  </div>
                  {/* <div className="form-fields">
                    <label className="form-label" htmlFor="taskAssignTo">
                      Assign
                    </label>
                    <select
                      id="taskAssignTo"
                      value={editTaskAssignedTo}
                      onChange={(e) => setEditTaskAssignedTo(e.target.value)}
                    >
                      <option value="" disabled>
                        Assign to
                      </option>
                      {users.map((user, index) => (
                        <option key={index} value={user}>
                          {user.charAt(0).toUpperCase() +
                            user.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </form>
              </div>

              <hr />

              <div className="modal-footer" style={{ flexFlow: "row" }}>
                <button
                  className="button-purple"
                  id="cancel"
                  onClick={() => {
                    setModalActive(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="button-purple-fill"
                  id="save-task"
                  onClick={() => handleEditTask()}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="collaborator-card">
        <div className="collaborator-header-container">
          <div
            className="image-container"
            style={{
              border: `3px solid ${
                isActiveStatus
                  ? "var(--primary-green)"
                  : "var(--primary-purple)"
              }`,
              borderRadius: "50%",
            }}
          >
            <img src={image} alt="Collaborator" />
          </div>
          <div>
            <h4>
              {collaboratorName.charAt(0).toUpperCase() +
                collaboratorName.slice(1).toLowerCase()}
            </h4>
            <p>{isActiveStatus ? "Online" : "Offline"}</p>
          </div>
          <div className="collaborator-delete">
            <button onClick={() => handleDelete(collaborator)}>
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
        <div className="collaborator-body">
          <select
            value=""
            onChange={(e) => assignTask(e.target.value, collaborator)}
          >
            <option value="" disabled>
              Assign task
            </option>
            {unAssignedTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name}
              </option>
            ))}
          </select>
          <h4>To-do</h4>
          <div className="clb-incomplete-tasks">
            <ul>
              {inCompleteTasks && inCompleteTasks.length > 0 ? (
                inCompleteTasks.map((task) => (
                  <li key={task._id || task.id}>
                    <div className="task-list-tem">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          handleTaskCompletionToggle(task.id || task._id)
                        }
                      />
                      <div className="clb-incomplete-taskname">
                        {task.name}
                        <button className="task-button">
                          <span
                            onClick={() => handleUnassign(task.id || task._id)}
                            style={{ cursor: "pointer" }}
                          >
                            Unassign
                          </span>
                          <Dropdown>
                            <Dropdown.Toggle
                              as="span"
                              variant="success"
                              id="dropdown-basic"
                              style={{
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-three-dots-vertical"
                                viewBox="0 0 16 16"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "0px",
                                  marginTop: "8px",
                                }}
                              >
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                              </svg>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  handleEditButton(
                                    task.id || task._id,
                                    task.name
                                  )
                                }
                              >
                                Edit
                              </Dropdown.Item>
                              {/* <Dropdown.Divider></Dropdown.Divider> */}
                              <Dropdown.Item></Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleRemove(task.id || task._id)
                                }
                              >
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="no-task-box">Incompleted tasks appear here</div>
              )}
            </ul>
          </div>
          <h4>Completed Tasks</h4>
          <div className="clb-complete-tasks">
            <ul>
              {completedTasks && completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <li key={task._id || task.id}>
                    <div className="task-list-tem">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          handleTaskCompletionToggle(task.id || task._id)
                        }
                      />
                      <div className="clb-complete-taskname">{task.name}</div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="no-task-box">Completed tasks appear here</div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Collaborator;
