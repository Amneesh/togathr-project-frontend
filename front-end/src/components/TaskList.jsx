import React, { useEffect } from "react";
// import {
//   getCollaboratorsName,
//   getTasksBasedOnIdFromDB,
//   getCollaboratorName,
//   addTaskToList,
//   changeTaskCompletionStatus,
// } from "../../api/loginApi";
import { useState } from "react";
// import {
//   saveTasksToDatabase,
//   assignTaskToCollaborator,
// } from "../../api/loginApi";
import Modal from "./ModalPopupBox";
import { useSnackbar } from "./SnackbarContext";
import {
  readDataFromMongoWithParam,
  readSingleDataFromMongo,
  updateDataInMongo,
  createDataInMongo,
  addTaskToAIList
} from "../../api/mongoRoutingFile";
import AOS from "aos";
import "aos/dist/aos.css";
export const TaskList = ({ TaskeventId, TaskeventType }) => {
  console.log(TaskeventId, "eventId");
  const showSnackbar = useSnackbar();
  const [eventType, setEventType] = useState("birthday");
  const [newTask, setNewTask] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState({});
  const [users, setUsers] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [unAssignedTasks, setUnAssignedTasks] = useState([]);
 
  const [eventId, setEventId] = useState(localStorage.getItem("eventId"));
  const [inCompletedTasks, setInCompletedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const userData = localStorage.getItem("user-info");
  const userDataObj = JSON.parse(userData);
  const userId = userDataObj.email;


  // useEffect(() => {}, [tasks]);
  useEffect(() => {
    AOS.init({
        duration: 700,
        easing: "ease-in-cubic",
    });
  }, []);

  useEffect(() => {
    displayAITaskList();
    console.log("page loaded", eventId);
  }, []);

  useEffect(() => {
    displayAITaskList();
  }, [eventId]);

  const getEventID = () => {
    const currentEventID = localStorage.getItem("eventId");
    setEventId(currentEventID);
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
      if (currentEventID !== eventId) {
        getEventID();
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [eventId]);

  const displayAITaskList = async () => {
    if (!!eventId) {
      const queryParams = {
        and: [{ event: eventId }],
      };
      const result = await readDataFromMongoWithParam(
        "tasks",
        JSON.stringify(queryParams)
      );
      console.log("response in component with id", result);
      // const response = await getTasksBasedOnIdFromDB(eventId);
      // console.log("response in component with id", response.data);
      if (result) {
        const taskArray = await Promise.all(
          result.map(async (task) => {
            let assignedToName = "";
            if (task.assignedTo) {
              console.log("task.assignedTo", task.assignedTo);
              const queryParams = {
                and: [{ email: task.assignedTo }],
              };
              const result = await readDataFromMongoWithParam(
                "users",
                JSON.stringify(queryParams)
              );
              console.log("getCollaboratorName", result);
              // const nameResponse = await getCollaboratorName(task.assignedTo);
              assignedToName = result[0].name;
            }
            return {
              id: task._id,
              name: task.name,
              isAssigned: task.isAssigned,
              assignedTo: task.assignedTo || "",
              assignedToName: assignedToName || "",
              isCompleted: task.completed || false,
            };
          })
        );
        setTasks(taskArray);
        console.log("tasks", taskArray);
        getIncompleteAndCompleteTasks(taskArray);
        const assignedData = taskArray.reduce((acc, task) => {
          acc[task.id] = task.assignedToName || "";
          return acc;
        }, {});
        setAssignedTasks(assignedData);

        // live api call
        readSingleDataFromMongo("events", eventId)
          .then(async (response) => {
            console.log("Response from single:", response.collaborators);
            const collaborators = response.collaborators;

            // Use Promise.all to resolve all async operations in the map
            const colabNames = await Promise.all(
              collaborators.map(async (colab) => {
                const queryParams = {
                  and: [{ email: colab }],
                };

                try {
                  const result = await readDataFromMongoWithParam(
                    "users",
                    JSON.stringify(queryParams)
                  );
                  // console.log("Result in component for", colab, ":", result);
                  return result?.[0]?.name || ""; // Handle missing name or empty results
                } catch (error) {
                  console.error(
                    "Error fetching user data for collaborator:",
                    colab,
                    error
                  );
                  return ""; // Fallback for errors
                }
              })
            );

            console.log("Collaborators' Names:", colabNames);
            setUsers(colabNames);
          })
          .catch((error) => {
            console.error("Failed to get data:", error);
          });

        // inbuilt backend api call
        // const collaborators = await getCollaboratorsName({ eventId });
        // console.log(
        //   "collaborators.data.uniqueNames",
        //   collaborators.data.uniqueNames
        // );
        // setUsers(collaborators.data.uniqueNames);
      } else {
        console.log("Error in generating task list");
      }
    }
  };

  const getIncompleteAndCompleteTasks = (taskArray) => {
    // const incompleteTasks = [];
    // const completeTasks = [];
    const myallTasks = [];
    const unassignedAllTasks = [];
    taskArray.forEach((task) => {
      console.log('myTasks Details', task, userId)
      if (task.assignedTo === userId) {
        myallTasks.push(task);
      }
      if (!task.isAssigned) {
        unassignedAllTasks.push(task);
      }
      // if (task.isCompleted) {
      //   completeTasks.push(task);
      // } else {
      //   incompleteTasks.push(task);
      // }
    });
    // setInCompletedTasks(incompleteTasks);
    // setCompletedTasks(completeTasks);
    setUnAssignedTasks(unassignedAllTasks);
    setMyTasks(myallTasks);
  };

  // const handleTaskCompletionToggle = async (taskId) => {
  //   console.log("change checked", tasks, taskId);
  //   const taskToToggle = inCompletedTasks.find(
  //     (task) => task.id === taskId || task._id === taskId
  //   );

  //   // live backend api call
  //   const taskToUpdate = {
  //     "completed": taskToToggle ? true : false
  //   }
  //   updateDataInMongo("tasks", taskId, taskToUpdate).then(async(response) => {
  //     console.log('task toggle', response);
  //     if (response) {
  //       if (taskToToggle) {
  //         setInCompletedTasks((prevTasks) =>
  //           prevTasks.filter((task) => task.id !== taskId)
  //         );
  
  //         setCompletedTasks((prevCompletedTasks) => [
  //           ...prevCompletedTasks,
  //           { ...taskToToggle, completed: true },
  //         ]);
  //       } else {
  //         const completedTaskToToggle = completedTasks.find(
  //           (task) => task.id === taskId
  //         );
  //         if (completedTaskToToggle) {
  //           setCompletedTasks((prevTasks) =>
  //             prevTasks.filter((task) => task.id !== taskId)
  //           );
  
  //           setInCompletedTasks((prevInCompleteTasks) => [
  //             ...prevInCompleteTasks,
  //             { ...completedTaskToToggle, completed: false },
  //           ]);
  //         }
  //       }
  //       showSnackbar("Confirmation", 'Task status has been updated');
  //       displayAITaskList();
  //     }
      
  //   });
  // };

  const handleUserSelect = (taskId, userName) => {
    // console.log('Assigning task', task, 'to user', userName);
    setAssignedTasks((prev) => ({
      ...prev,
      [taskId]: userName,
    }));
    assignTask(taskId, userName);
  };

  const assignTask = async (taskId, userId) => {
    const id = localStorage.getItem("eventId");
    console.log(
      `Assigned task "${taskId}" to user ID: ${userId} and eventId: ${id}`
    );
    const queryParams = {
      and: [
        { "name": userId },
      ]
    };
    const userEmailData = await readDataFromMongoWithParam(
      "users",
      JSON.stringify(queryParams)
    );
    const userEmail = userEmailData[0].email;
    const dataToUpdate = {
      assignedTo: userEmail,
      isAssigned: true,
    };
    updateDataInMongo("tasks", taskId, dataToUpdate).then(
      (response) => {
      displayAITaskList();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, assignedTo: userEmail, assignedToName: userId }
            : task
        )
      );

      setMyTasks((prevTasks) =>
        prevTasks.some((task) => task.id === taskId)
          ? prevTasks
          : [
              ...prevTasks,
              { id: taskId, assignedTo: userEmail, assignedToName: userId },
            ]
      );

      showSnackbar("Confirmation", `Task is assigned to ${userId}`);
    });
    // const result = await assignTaskToCollaborator({ taskId, userId, id });
    // console.log("assign", result);
    // if (result && result.status === 200) {
    //   showSnackbar("Confirmation", `Task is assigned to ${userId}`);
    // } else {
    //   showSnackbar("Oops!", "Task is not assigned", "#FBECE7");
    // }
  };

  const handleAddTask = async () => {
    console.log("task item", newTask, newTaskAssignedTo);
    const eventId = localStorage.getItem("eventId");
    if (newTask) {
      try {
        // live backend api call
        // const queryParams = {
        //   and: [
        //     { "name": newTaskAssignedTo },
        //   ]
        // };
        // const userEmailData = await readDataFromMongoWithParam(
        //   "users",
        //   JSON.stringify(queryParams)
        // );
        // const userEmail = userEmailData[0].email;
        // const taskToAdd = {
        //   name: newTask,
        //   event: eventId,
        //   assignedTo: userEmail,
        //   isAssigned: userEmail ? true : false,
        //   completed: false
        // };
        // createDataInMongo("tasks", taskToAdd)
        //   .then((response) => {
        //     console.log("Response from createdData:", response._id);
        //   })
        //   .catch((error) => {
        //     console.error("Failed to update data:", error);
        //   });
        // updateDataInMongo("events", eventId, taskToUpdate).then(async (response) => {
        //   console.log('updateDataInMongo', response);
        // });

        // live backend api
        const taskToAdd = {
          eventId,
          newTask,
          newTaskAssignedTo
        }
        console.log('taskToAdd', taskToAdd);
        // const result = await addTaskToAIList(taskToAdd);
        // addTaskToAIList(taskToAdd)
        //   .then((response) => {
        //     console.log("Response from createdData:", response);
        //   })
        //   .catch((error) => {
        //     console.error("Failed to update data:", error);
        //     showSnackbar("Oops!", `Try again`, "#FBECE7");
        //   });
        // displayAITaskList();
      } catch (error) {
        console.error("Error adding task to list:", error);
      }
    } else {
      showSnackbar("Oops!", "You did not add a task", "#FBECE7");
    }
  };

  return (
    <div className="overview-task">
      <div className="overview-tasks-header">
        <h2>Tasks</h2>

        <Modal
          className="all-tasks"
          buttonId="allTasks"
          buttonLabel="All Tasks"
          modalHeaderTitle="All AI generated Tasks"
          // modalBodyHeader=""
          modalBodyContent={tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div key={index} className="all-tasks-list-item">
                <svg
                  width="24"
                  height="24"
                  margin="1px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z"
                    fill="#04ED98"
                  />
                </svg>
                <div className="todo-task-name-container">
                  <div className="todo-task-name">
                    <p>{task.name ? task.name : "Task"}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-task-box">AI generated tasks appear here</div>
          )}
          onModalClose={() => console.log("Modal 1 closed")}
          closeModalAfterDataSend="true"
        />
        <div>
          <Modal
            className="add-task"
            buttonId="addTask"
            buttonLabel="+ Add Task"
            modalHeaderTitle="Add Task"
            modalBodyContent={
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
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                </div>
                <div className="form-fields">
                  <label className="form-label" htmlFor="taskAssignTo">
                    Assign
                  </label>
                  <select
                    id="taskAssignTo"
                    value={newTaskAssignedTo}
                    onChange={(e) => setNewTaskAssignedTo(e.target.value)}
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
                </div>
              </form>
            }
            saveDataAndOpenName="Cancel"
            saveDataAndOpenId="cancel"
            saveDataAndOpenFunction={() => console.log("cancel add task")}
            saveDataAndCloseName="Add Task"
            saveDataAndCloseId="addTask"
            saveDataAndCloseFunction={async () => await handleAddTask()}
            buttonAlign="row"
            onModalClose={() => console.log("Modal closed")}
            closeModalAfterDataSend="true"
          />
        </div>

        <div className="overview-tasks-para">
          <p>Here is a AI task list to get you started</p>
        </div>
      </div>
      {/* <div className="todo-list">
        <h4>To-Do</h4>
        <div className="todo-list-items" >
        {inCompletedTasks && inCompletedTasks.length > 0 ? (
            inCompletedTasks.map((task, index) => (
              <div key={index} className="todo-list-item" >
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleTaskCompletionToggle(task.id)}
                  readOnly
                />
                <div className="todo-task-name-container">
                  <div className="todo-task-name">
                    <p>{task.name ? task.name : "Task"}</p>
                  </div>
                  <div className="todo-task-assigned">
                    <select
                      value={assignedTasks[task.id] || ""}
                      onChange={(e) =>
                        handleUserSelect(task.id, e.target.value)
                      }
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
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-task-box">Incompleted tasks appear here</div>
          )}
        </div>
      </div>
      <div className="todo-list">
        <h4>Completed Tasks</h4>
        <div className="todo-list-items">
          {completedTasks && completedTasks.length > 0 ? (
            completedTasks.map((task, index) => (
              <div key={index} className="todo-list-item">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleTaskCompletionToggle(task.id)}
                />
                <div className="todo-task-name-container">
                  <div className="todo-task-name">
                    <p>{task.name ? task.name : "Task"}</p>
                  </div>
                  <div className="todo-task-assigned">
                    <select
                      value={assignedTasks[task.id] || ""}
                      onChange={(e) =>
                        handleUserSelect(task.id, e.target.value)
                      }
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
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-task-box">Completed tasks appear here</div>
          )}
        </div>
      </div> */}
      <div className="todo-list">
        <h4>Unassigned Tasks</h4>
        <div className="todo-list-items">
          {unAssignedTasks && unAssignedTasks.length > 0 ? (
            unAssignedTasks.map((task, index) => (
              <div key={index} className="todo-list-item">
                {/* <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleTaskCompletionToggle(task.id)}
                /> */}
                <div className="todo-task-name-container">
                  <div className="todo-task-name">
                    <p>{task.name ? task.name : "Task"}</p>
                  </div>
                  <div className="todo-task-assigned">
                    <select
                      value={assignedTasks[task.id] || ""}
                      onChange={(e) =>
                        handleUserSelect(task.id, e.target.value)
                      }
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
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-task-box">Completed tasks appear here</div>
          )}
        </div>
      </div>
      <div className="todo-list">
        <h4>My Tasks</h4>
        <div className="todo-list-items">
          {myTasks && myTasks.length > 0 ? (
            myTasks.map((task, index) => (
              <div key={index} className="todo-list-item">
                <svg
                  width="24"
                  height="24"
                  margin="1px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z"
                    fill="#04ED98"
                  />
                </svg>
                <div className="todo-task-name-container">
                  <div className="todo-task-name">
                    <p>{task.name ? task.name : "Task"}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-task-box">Tasks assigned to you appear here</div>
          )}
        </div>
      </div>
    </div>
  );
};
