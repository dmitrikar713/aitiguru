import axios, { type AxiosResponse } from "axios";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { api } from "../../api/axios";
import { notifications } from "@mantine/notifications";

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", {
    username: credentials.username,
    password: credentials.password,
  });
  return response.data;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}
export async function register(
  credentials: RegisterCredentials,
): Promise<AxiosResponse<AuthResponse, any, {}>["status"]> {
  const response = await api.post<AuthResponse>("/users/add", {
    username: credentials.username,
    password: credentials.password,
  });
  return response.status;
}

interface AuthState {
  user: Omit<AuthResponse, "accessToken" | "refreshToken"> | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  rememberMe: boolean;

  setRememberMe: (value: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
        rememberMe: false,

        setRememberMe: (value: boolean) => set({ rememberMe: value }),

        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });

          try {
            const { accessToken, refreshToken, ...userData } =
              await login(credentials);

            set({
              user: userData,
              accessToken,
              refreshToken,
              isLoading: false,
              rememberMe: credentials.rememberMe ?? false, // сохраняем выбор
              error: null,
            });

            // Устанавливаем токен в заголовки для будущих запросов
            api.defaults.headers.common["Authorization"] =
              `Bearer ${accessToken}`;
          } catch (error) {
            let errorMessage = "Ошибка авторизации";

            if (axios.isAxiosError(error)) {
              errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
              errorMessage = error.message;
            }

            set({
              error: errorMessage,
              isLoading: false,
              user: null,
              accessToken: null,
              refreshToken: null,
            });

            throw new Error(errorMessage);
          }
        },

        refreshAccessToken: async () => {
          const { refreshToken } = get();

          try {
            const response = await api.post<{ accessToken: string }>(
              "/auth/refresh",
              {
                refreshToken,
              },
            );

            const { accessToken } = response.data;

            set({ accessToken });
            api.defaults.headers.common["Authorization"] =
              `Bearer ${accessToken}`;
          } catch (error) {
            throw error;
          }
        },

        clearError: () => set({ error: null }),
      }),

      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => {
          if (!state.rememberMe) {
            return {};
          }

          return {
            user: state.user,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            rememberMe: state.rememberMe,
          };
        },
      },
    ),
  ),
);

// Хук для проверки авторизации
export const useLogin = () => {
  const { login, isLoading, error, clearError, rememberMe, setRememberMe } =
    useAuthStore();

  const handleLogin = async (
    username: string,
    password: string,
    rememberMe: boolean,
  ) => {
    try {
      await login({ username, password, rememberMe });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Ошибка входа",
      };
    }
  };

  return {
    login: handleLogin,
    isLoading,
    error,
    clearError,
    rememberMe,
    setRememberMe,
  };
};

// Инициализация токена при загрузке (если есть в localStorage)
const token = useAuthStore.getState().accessToken;
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Перехватчик для обновления токена при 401 ошибке
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshAccessToken();
        const newToken = useAuthStore.getState().accessToken;

        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        notifications.show({ message: refreshError as string });
      }
    }

    return Promise.reject(error);
  },
);
