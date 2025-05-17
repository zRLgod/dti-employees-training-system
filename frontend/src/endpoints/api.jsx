import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';
const REFRESH_URL = `${API_URL}token/refresh/`;
const LOGOUT_URL = `${API_URL}logout/`;
const AUTH_URL = `${API_URL}authenticated/`;
const TRAINING_URL = `${API_URL}training/`;
const TRAINING_CREATE_URL = `${API_URL}training/create/`;
const USERLIST_URL = `${API_URL}users/`;
const USER_UPDATE_URL = `${API_URL}user/update/`;
const CURRENTUSER_URL = `${API_URL}userprofile/`;
const USER_CREATE_URL = `${API_URL}user/create/`;
const EMPLOYEE_URL = `${API_URL}employees/`;



// --------- Axios Instance ---------
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, 
});

// --------- Attach Authorization Token ---------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------- Token Handling ---------
export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('token/', { username: username, password });
    if (response.data.success) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post(LOGOUT_URL, {});
  } catch (error) {
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const is_authenticated = async () => {
  try {
    await axiosInstance.post(AUTH_URL, {});
    return true;
  } catch (error) {
    return false;
  }
};

export const refresh_token = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    const response = await axiosInstance.post(REFRESH_URL, { refresh });
    localStorage.setItem('access_token', response.data.access);
    return true;
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return false;
  }
};

// --------- Retry on Token Expiration ---------

const call_refresh = async (error, retryFunc) => {
  if (error.response && error.response.status === 401) {
    const refreshed = await refresh_token();
    if (refreshed) {
      const retryResponse = await retryFunc();
      return retryResponse.data;
    }
  }
  throw error;
};

// --------- API Functions ---------

export const getUserData = async () => {
  try {
    const response = await axiosInstance.get(CURRENTUSER_URL);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(CURRENTUSER_URL));
  }
};


export const ViewTraining = async () => {
  try {
    const response = await axiosInstance.get(TRAINING_URL);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(TRAINING_URL));
  }
};

export const create_training = async (trainingData) => {
  try {
    const response = await axiosInstance.post(TRAINING_CREATE_URL, trainingData);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.post(TRAINING_CREATE_URL, trainingData));
  }
};

export const assign_training = async (assignmentData) => {
  try {
    const response = await axiosInstance.post(`${TRAINING_URL}assign/`, assignmentData);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.post(`${TRAINING_URL}assign/`, assignmentData));
  }
};

export const list_users = async () => {
  try {
    const response = await axiosInstance.get(USERLIST_URL);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(USERLIST_URL));
  }
};

export const user_profile = async () => {
  try {
    const response = await axiosInstance.get(CURRENTUSER_URL);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(CURRENTUSER_URL));
  }
};

export const create_user = async (userData) => {
  try {
    const response = await axiosInstance.post(USER_CREATE_URL, userData);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.post(USER_CREATE_URL, userData));
  }
};

export const update_user = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`${USER_UPDATE_URL}${userId}/`, userData);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.put(`${USER_UPDATE_URL}${userId}/`, userData));
  }
};

export const ViewEmployee = async () => {
  try {
    const response = await axiosInstance.get(EMPLOYEE_URL);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(EMPLOYEE_URL));
  }
};

export const getAssignedUsers = async (trainingId) => {
  try {
    const response = await axiosInstance.get(`${TRAINING_URL}${trainingId}/assigned-users/`);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(`${TRAINING_URL}${trainingId}/assigned-users/`));
  }
};

export const getEnrolledUsersForTraining = async (trainingId) => {
  try {
    const response = await axiosInstance.get(`enrolledtrainings/${trainingId}/users/`);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(`enrolledtrainings/${trainingId}/users/`));
  }
};

export const update_training = async (trainingId, trainingData) => {
  try {
    const response = await axiosInstance.put(`${TRAINING_URL}update/${trainingId}`, trainingData);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.put(`${TRAINING_URL}update/${trainingId}`, trainingData));
  }
};

export const getAssignedTrainingsForUser = async () => {
  try {
    const response = await axiosInstance.get(`${TRAINING_URL}assigned/current-user/`);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(`${TRAINING_URL}assigned/current-user/`));
  }
};

export const enrollInTraining = async (trainingId) => {
  try {
    const response = await axiosInstance.post('enrolledtrainings/', { en_training: trainingId });
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.post('enrolledtrainings/', { en_training: trainingId }));
  }
};

export const getEnrolledTrainingsForUser = async (status) => {
  try {
    let url = 'enrolledtrainings/current-user/';
    if (status) {
      url += `?status=${status}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(url));
  }
};

export const createLearningActionPlan = async (lapData) => {
  try {
    const response = await axiosInstance.post('learning_action_plans/create/', lapData);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.post('learning_action_plans/create/', lapData));
  }
};

export const getUserLearningActionPlans = async () => {
  try {
    const response = await axiosInstance.get('learning_action_plans/user/');
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get('learning_action_plans/user/'));
  }
};

export const getLAP = async () => {
  try {
    const response = await axiosInstance.get('learning_action_plans/all/');
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get('learning_action_plans/all/'));
  }
};

export const update_progress = async (progressId, progressData) => {
  try {
    const response = await axiosInstance.put(`progress/update/${progressId}/`, progressData); 
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.put(`progress/update/${progressId}/`, progressData));
  }
};

export const create_progress = async (progressData) => {
  try {
    const response = await axiosInstance.post(`progress/`, progressData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Backend error:", error.response.data); 
      alert(JSON.stringify(error.response.data)); 
    }
    return call_refresh(error, () => axiosInstance.post(`progress/`, progressData));
  }
};

export const get_progress_by_lap = async (lapId) => {
  try {
    const response = await axiosInstance.get(`progress/lap/${lapId}/`);
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get(`progress/lap/${lapId}/`));
  }
};

export const getProgressForCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('progress/current-user/');
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get('progress/current-user/'));
  }
};

export const getAllProgress = async () => {
  try {
    const response = await axiosInstance.get('progress/all/');
    return response.data;
  } catch (error) {
    return call_refresh(error, () => axiosInstance.get('progress/all/'));
  }
};

