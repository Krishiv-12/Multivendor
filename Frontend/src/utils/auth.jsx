export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const setAuthHeader = (axiosInstance) => {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${getToken()}`;
  };
  