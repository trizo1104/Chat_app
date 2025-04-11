import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

type AuthUser = {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt: string;
};

type AuthState = {
  authUser: AuthUser | null;
  onlineUsers: string[];
  isSigningUp: boolean;
  isLogingIn: boolean;
  isUpadatingProfile: boolean;
  signup: (data: FormDataSignUp) => void;
  isCheckingAuth: boolean;
  checkAuth: () => void;
  logout: () => void;
  login: (data: FormDataLogIn) => void;
  updateProfile: (data: UpdateProfile) => void;
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
};

type UpdateProfile = {
  profilePic: string;
};

type FormDataLogIn = {
  email: string;
  password: string;
};

type FormDataSignUp = {
  fullName: string;
  email: string;
  password: string;
};

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpadatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("check auth error: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: FormDataSignUp) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account create successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response.data.mess);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("logged out successfully");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response.data.mess);
    }
  },

  login: async (data) => {
    set({ isLogingIn: true });
    try {
      const res = await axiosInstance.post("auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response.data.mess);
    } finally {
      set({ isLogingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpadatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile update successfully");
    } catch (error: any) {
      toast.error(error.response.data.mess);
    } finally {
      set({ isUpadatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
