import {jwtDecode} from "jwt-decode";

const isAuthenticated = () => {
  if (localStorage.getItem("token") === null) {
    return false;
  }
  return true;
};

const removeToken = () => {
  localStorage.removeItem("token");
};

const setToken = (token) => {
  localStorage.setItem("token", token);
};

const getUserIdentity = ()=>{
  if(isAuthenticated()){
    const token = localStorage.getItem("token");
    return jwtDecode(token)
  }else{
    return null;
  }
}

export {isAuthenticated, setToken, removeToken, getUserIdentity}