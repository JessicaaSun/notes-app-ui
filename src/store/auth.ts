import { defineStore } from "pinia";
import axios from "axios";

interface User {
  id: number;
  email: string;
  username: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const API_URL = "http://localhost:5018/api/account";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async register(email: string, username: string, password: string) {
      try {
        const response = await axios.post(`${API_URL}/register`, {
          email,
          username,
          password,
        });
        return response.data;
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },

    async login(username: string, password: string) {
      try {
        const response = await axios.post(`${API_URL}/login`, {
          username,
          password,
        });
        const { token, userName, email, id } = response.data;

        if (!token) throw new Error("Token is missing from response!");

        this.token = token;
        this.user = { id, username: userName, email };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(this.user));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return response.data;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user"); 
      delete axios.defaults.headers.common["Authorization"];
    },
  },
});
