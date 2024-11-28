import React, { useEffect } from "react";
import {
  getCollaboratorsName,
  openAI,
  getTasksBasedOnIdFromDB,
  getCollaboratorName,
  addTaskToList,
  changeTaskCompletionStatus,
} from "../../api/loginApi";
import { useState } from "react";
import { saveTasksToDatabase, assignTaskToCollaborator } from "../../api/loginApi";
import Modal from "./ModalPopupBox";
import { useSnackbar } from './SnackbarContext';

export const TaskList = ({ TaskeventId, TaskeventType }) => {
  console.log(TaskeventId, "eventId");
  const showSnackbar = useSnackbar();
  const [eventType, setEventType] = useState("birthday");
  const [newTask, setNewTask] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState({});
  const [users, setUsers] = useState([]);

  const [eventId, setEventId] = useState(localStorage.getItem("eventId"));
  const [inCompletedTasks, setInCompletedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const userData = localStorage.getItem("user-info");
  const userDataObj = JSON.parse(userData);
  const userId = userDataObj.email;

  // useEffect(() => {}, [tasks]);
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
      const response = await getTasksBasedOnIdFromDB(eventId);
      console.log("response in component with id", response.data);
      if (response && response.status === 200) {
        const taskArray = await Promise.all(
          response.data.taskList.map(async (task) => {
            let assignedToName = "";
            if (task.assignedTo) {
              const nameResponse = await getCollaboratorName(task.assignedTo);
              assignedToName = nameResponse.data.userName;
            }
            return {
              id: task._id,
              name: task.name,
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
        const collaborators = await getCollaboratorsName({ eventId });
        setUsers(collaborators.data.uniqueNames);
      } else {
        console.log("Error in generating task list");
      }
    }
  };

  const getIncompleteAndCompleteTasks = (taskArray) => {
    const incompleteTasks = [];
    const completeTasks = [];
    taskArray.forEach((task) => {
      if (task.isCompleted) {
        completeTasks.push(task);
      } else {
        incompleteTasks.push(task);
      }
    });
    setInCompletedTasks(incompleteTasks);
    setCompletedTasks(completeTasks);
  };

  const handleTaskCompletionToggle = async (taskId) => {
    console.log("change checked", tasks, taskId);
    const updatedTask = await changeTaskCompletionStatus({ taskId });

    const taskToToggle = inCompletedTasks.find(
      (task) => task.id === taskId || task._id === taskId
    );

    if (updatedTask.status === 200) {
      if (taskToToggle) {
        setInCompletedTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );

        setCompletedTasks((prevCompletedTasks) => [
          ...prevCompletedTasks,
          { ...taskToToggle, completed: true },
        ]);
      } else {
        const completedTaskToToggle = completedTasks.find(
          (task) => task.id === taskId
        );
        if (completedTaskToToggle) {
          setCompletedTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId)
          );

          setInCompletedTasks((prevInCompleteTasks) => [
            ...prevInCompleteTasks,
            { ...completedTaskToToggle, completed: false },
          ]);
        }
      }
      displayAITaskList();
    }
  };

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
    const result = await assignTaskToCollaborator({ taskId, userId, id });
    console.log("assign", result);
    if (result && result.status === 200) {
      showSnackbar('Confirmation',`Task is assigned to ${userId}`);
    } else {
      showSnackbar('Oops!',"Task is not assigned", '#FBECE7');
    }
  };

  const handleAddTask = async () => {
    console.log("task item", newTask, newTaskAssignedTo);
    const eventId = localStorage.getItem("eventId");
    if (newTask) {
      try {
        const result = await addTaskToList({
          eventId,
          newTask,
          newTaskAssignedTo,
        });
        console.log("result", result);
        // await generateTaskList();
        displayAITaskList();
      } catch (error) {
        console.error("Error adding task to list:", error);
      }
    } else {
      showSnackbar('Oops!',"You did not add a task", '#FBECE7');
    }
  };

  return (
    <div className="overview-task">
      <div className="overview-tasks-header">
        <h2>Tasks</h2>
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
            saveDataAndOpenFunction={() => console.log('cancel add task')}
            saveDataAndCloseName="Add Task"
            saveDataAndCloseId="addTask"
            saveDataAndCloseFunction={async () => await handleAddTask()}
            buttonAlign="row"
            onModalClose={() => console.log("Modal closed")}
            closeModalAfterDataSend="true"
          />
        </div>
      </div>
      <div className="overview-tasks-para">
        <p>Here is a task list to get you started</p>
      </div>
      <div className="todo-list">
        <h4>To-Do</h4>
        <div className="todo-list-items">
          {inCompletedTasks && inCompletedTasks.length > 0 ? (
            inCompletedTasks.map((task, index) => (
              <div key={index} className="todo-list-item">
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
      </div>
    </div>
  );
};
