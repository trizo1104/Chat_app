import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

type AuthUser = {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt: string;
};

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  image: string;
};

type Chat = {
  messages: Message[];
  users: AuthUser[];
  selectedUser: AuthUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => void;
  getMessages: (userId: string) => void;
  sendMessage: (messageData: { text: string; image: string | null }) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (user: AuthUser | null) => void;
};

export const useChatStore = create<Chat>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ users: res.data });
    } catch (error: any) {
      toast.error(error.response.data.mess);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error: any) {
      toast.error(error.response.data.mess);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser?._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error: any) {
      toast.error(error.response.data.mess);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket?.on("newMessage", (newMessage: Message) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
