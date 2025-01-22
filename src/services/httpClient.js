import { removeToken } from "@/services/AuthProvider.js";

const BASE_URL = "http://localhost:3001";
const request = async (
  endpoint,
  method = "GET",
  body = null,
  isAuthRequest = false,
) => {
  // Récupérer le token
  const token = localStorage.getItem("token");
  // Définir les en-têtes
  const headers = {
    "Content-Type": "application/json",
    ...(isAuthRequest && token && { Authorization: `Bearer ${token}` }), // Ajouter le token si la requête n'est pas d'authentification
  };
  // Configurer la requête
  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };
  try {
    // Envoyer la requête
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (response.status === 403 || response.status === 401) {
      // Token expired or invalid, remove token and redirect to login
      removeToken();
      window.location.href = "/login";
      return;
    }
    // Gérer la réponse
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || "Something went wrong");
    }
    // Vérifier si la réponse a du contenu
    const contentType = response.headers.get("content-type");
    return contentType && contentType.includes("application/json")
      ? await response.json()
      : null;
  } catch (error) {
    // Gestion des erreurs
    console.error("API Error:", error);
    throw error;
  }
};
const login = (username, password) => {
  return request("/login", "POST", { username, password }, true);
};
const register = (username, password) => {
  return request("/register", "POST", { username, password }, true);
};
const changeProfile = (username, password) => {
  return request("/user", "PUT", { username, password }, true);
};
const getGames = () => {
  return request("/games", "GET", null, true);
};
const createGame = () => {
  return request("/games", "POST", null, true);
};
const joinGame = (id) => {
  if (id == null || id.length === 0) {
    throw new Error("Id de partie Invalide");
  }
  return request("/games/" + id + "/join", "POST", null, true);
};
const deleteGame = (id) => {
  if (id == null || id.length === 0) {
    throw new Error("Id de partie Invalide");
  }
  return request("/games/" + id, "DELETE", null, true);
};
const getGame = (id) => {
  if (id == null || id.length === 0) {
    throw new Error("Id de partie Invalide");
  }
  return request("/games/" + id, "GET", null, true);
};
const playGame = (id, row, column) => {
  if (id == null || id.length === 0) {
    throw new Error("Id de partie Invalide");
  }
  if (column > 2 || column < 0 || row > 2 || row < 0) {
    throw new Error("Mouvement invalide");
  }
  return request(
    "/games/" + id + "/move/" + row + "/" + column,
    "POST",
    null,
    true,
  );
};
const getUser = (id) => {
  if (id == null || id.length === 0) {
    throw new Error("Id de partie Invalide");
  }
  return request("/user/" + id, "GET", null, true);
};
export {
  request,
  login,
  register,
  changeProfile,
  getGames,
  createGame,
  joinGame,
  deleteGame,
  getGame,
  playGame,
  getUser,
};
