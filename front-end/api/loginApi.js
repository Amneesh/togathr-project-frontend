import axios from 'axios';

const liveURL = 'https://togather-project-backend.vercel.app/api';
const api = axios.create({
    baseURL: 'http://localhost:8080/'
});

// const apiRoute = axios.create({
//     baseURL: 'http://localhost:6982/'
// });
// export const googleAuth = (code) => api.get(`/google?code=${code}`)

export async function signUpUser(data) {
    try {
        const url = `${liveURL}/signUpUser`;
        //  const url = `${baseUrl}/create-data/${collectionName}`;
        const response = await axios.post(url, data);
        console.log('Data created successfully');
        return response.data; // Return the response data id
    } catch (error) {
        console.error('Error updating data:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

export async function loginUser(data) {
    try {
        const url = `${liveURL}/loginUser`;
        //  const url = `${baseUrl}/create-data/${collectionName}`;
        const response = await axios.post(url, data);
        console.log('Data created successfully');
        return response.data; // Return the response data id
    } catch (error) {
        console.error('Error updating data:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}
export async function googleLoginLive(data) {
    try {
        const url = `${liveURL}/googleLogin`;
        //  const url = `${baseUrl}/create-data/${collectionName}`;
        const response = await axios.post(url, data);
        console.log('Data created successfully');
        return response.data; // Return the response data id
    } catch (error) {
        console.error('Error updating data:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

export async function logoutUser(data) {
    try {
        const url = `${liveURL}/logoutUser`;
        //  const url = `${baseUrl}/create-data/${collectionName}`;
        const response = await axios.post(url, data);
        console.log('Data created successfully');
        return response.data; // Return the response data id
    } catch (error) {
        console.error('Error updating data:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}




export const googleAuth = (code) => {
    return api.get(`/google?code=${code}`)
        .then(response => {
            console.log('Google Auth Success:', response);
            return response;
        })
        .catch(error => {
            if (error.response) {
                // The request was made, and the server responded with a status code outside the 2xx range
                console.error('Google Auth Server Error:', error.response.data);
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('Google Auth No Response:', error.request);
            } else {
                // Something else happened while setting up the request
                console.error('Google Auth Error:', error.message);
            }
            throw error;
        });
};

export const signUser = (req, res) => {
    return api.post(`/signup`, req)
    .then(
        response => {
            console.log('response in api', response);
            return response;
        }
    ).catch(error => {
        return error;
    })
}

// export const loginUser = (req, res) => {
//     return api.post(`/login`, req)
//     .then(
//         response => {
//             console.log('response in login api', response);
//             return response;
//         }
//     ).catch(error => {
//         console.log('error', error)
//     })

// export const loginUser = (req) => {
//     return api.post(`/login`, req)
//     .then(response => {
//         console.log('response in login api', response);
//         return response;
//     })
//     .catch(error => {
//         if (error.response) {
//             console.error('Login Server Error:', error.response.data);
//             return error.response.data; // Return the error response
//         } else {
//             console.error('Login Error:', error.message);
//             return { message: error.message }; // Return a custom error message
//         }
//     });
// }

// export const logOutUser = async(req) => {
//     return api.post(`/logout`, req)
//     .then(response => {
//         return response;
//     })
//     .catch(error => {
//         return error;
//     })
// }

export const googleVendorAuth = (code) => {
    return api.get(`/vendor-google?code=${code}`)
        .then(response => {
            return response;
        })
        .catch(error => {
            if (error.response) {
                // The request was made, and the server responded with a status code outside the 2xx range
                console.error('Google Auth Server Error:', error.response.data);
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('Google Auth No Response:', error.request);
            } else {
                // Something else happened while setting up the request
                console.error('Google Auth Error:', error.message);
            }
            throw error;
        });
};

export const signUpVendor = (req, res) => {
    return api.post(`/vendor-signup`, req)
    .then(
        response => {
            return response;
        }
    ).catch(error => {
        return error;
    })
}

export const vendorLogin = (req) => {
    return api.post(`/vendor-login`, req)
    .then(response => {
        return response;
    })
    .catch(error => {
        if (error.response) {
            console.error('Login Server Error:', error.response.data);
            return error.response.data; 
        } else {
            console.error('Login Error:', error.message);
            return { message: error.message }; 
        }
    });
}

export const vendorLogout = async(req) => {
    return api.post(`/vendor-logout`, req)
    .then(response => {
        return response;
    })
    .catch(error => {
        return error;
    })
}

export const openAI = (input) => {
    return api.post(`/generate-task-list`, {input})
    .then(response => {
        console.log('response in task list', response);
        return response;
    })
    .catch(error => {
        if (error.response) {
            console.error('Login Server Error:', error.response.data);
            return error.response.data; // Return the error response
        } else {
            console.error('Login Error:', error.message);
            return { message: error.message }; // Return a custom error message
        }
    });
}

export const getTasksBasedOnIdFromDB = (eventId) => {
    return api.post(`/get-tasks`, {eventId})
    .then(response => {
        return response
    })
    .catch(error => {
        return { 
            message: "Error in getting tasks from the database", 
            error: error.response ? error.response.data : "Server error"
        };
    })
}

export const generateWorkspaceLink = (req) => {
    return api.post(`/generate-workspace-link`, req)
    .then(response => {
        return response;
    })
    .catch(error => {
        if (error.response) {
            console.error('Login Server Error:', error.response.data);
            return error.response.data; 
        } else {
            console.error('Login Error:', error.message);
            return { message: error.message }; 
        }
    });
}

export const saveTasksToDatabase = (req) => {
    return api.post(`/save-tasks-db`, req)
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const assignTaskToCollaborator = (req) => {
    return api.post(`/assign-task`, req)
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

// export const joinWorkspace = async ({ workspaceLink, userId }) => {
//     return api.get('/join-workspace/:workspaceLink', { workspaceLink, userId })
//     .then(response => {
//         return response
//     })
//     .catch(error => {
//         console.log('eroor', error);
//     })
// };

export const joinWorkspace = async ({ newEventID, userId }) => {
    return api.post(`/join-workspace/${newEventID}`, { userId, newEventID })
        .then(response => {
            console.log('workspace', newEventID, userId);
            return response;
        })
        .catch(error => {
            console.log('error', error);
        });
};

export const getCollaboratorsName = (req) => {
    return api.post(`/get-collaborators-names`, req)
    .then(response => {
        console.log('res coll', response);
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const getCollaboratorsData = (req) => {
    return api.post(`/get-collaborators-data`, req)
    .then(response => {
        // console.log('res coll', response);
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const addCollaborator = (req) => {
    return api.post(`/add-collaborator`, req)
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const sendEmailToInvite = async(dataToSend) => {
    console.log('dataToSend', dataToSend);
    return await api.post(`/send-email-invite`, {dataToSend})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const getTaskListBasedOnCollaborator = async({collaborator, eventId}) => {
    return await api.post(`/get-task-list`, {collaborator, eventId})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}


export const getCollaboratorName = async(collaborator) => {
    return await api.post(`/get-collaborator-name`, {collaborator})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const changeTaskCompletionStatus = (req) => {
    return api.post(`/task-completion-status`, req)
    .then(response => {
        return response;
    })
    .catch(error => {
        return error;
    })
}


export const addTaskToList = (req) => {
    return api.post(`/add-task`, req)
    .then(response => {
        return response;
    })
    .catch(error => {
        return error;
    })
}

export const updateUserData= async(userUpdatedData) => {
    return await api.post(`/update-user-data`, {userUpdatedData})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const updateVendorData= async(vendorUpdatedData) => {
    return await api.post(`/update-vendor-data`, {vendorUpdatedData})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const updateUserPassword = async(userUpdatedPassword, email) => {
    return await api.post(`/update-user-password`, {userUpdatedPassword, email})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const updateVendorPassword = async(vendorUpdatedPassword, email) => {
    return await api.post(`/update-vendor-password`, {vendorUpdatedPassword, email})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}


export const getAllDataOfUser = async(emailOfUser) => {
    return await api.post(`/get-user-data`, {emailOfUser})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const getAllDataOfVendor = async(emailOfVendor) => {
    return await api.post(`/get-vendor-data`, {emailOfVendor})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const checkCurrentPasswordValidation = async(currentpassword, email) => {
    return await api.post(`/check-current-password-validation`, {currentpassword, email})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const checkVendorPasswordValidation = async(vendorpassword, email) => {
    return await api.post(`/check-vendor-password-validation`, {vendorpassword, email})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const getAllPastEvents = async (email) => {
    return await api.post(`/get-all-past-events`, {email})
    .then(response => {
        return response
    })
    .catch(error => {
        console.log('eroor', error);
    })
}

export const deleteCollaborator = (req) => {
    return api.post(`/delete-collaborator`, req)
    .then(response => {
        return response;
    })
    .catch(error => {
        return error;
    })
}

export const deleteTask = (req) => {
    return api.post(`/delete-task`, req)
    .then(response => {
        return response;
    })
    .catch(error => {
        return error;
    })
}

export const unAssignTaskFromCollaborator = (req) => {
    return api.post(`/unassign-task`, req)
    .then(response => {
        return response;
    })
    .catch(error => {
        return error;
    })
}

export const editTaskItem = (req) => {
    return api.post(`/edit-task`, req)
    .then(response => {
        return response;
    })
    .catch(error => {
        return error;
    })
}