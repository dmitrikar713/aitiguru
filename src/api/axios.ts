import { notifications } from "@mantine/notifications";
import axios from "axios";

export const api = axios.create({
  method: "POST",
  baseURL: "https://dummyjson.com",
  headers: { "Content-Type": "application/json" },
});

const showErrorNotification = (error: any) => {
  let message = "Произошла неизвестная ошибка";
  let title = "Ошибка";

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      title = `Ошибка ${status}`;

      switch (status) {
        case 400:
          message = data?.message || "Неверный запрос";
          break;
        case 401:
          message = "Не авторизован. Пожалуйста, войдите снова";
          break;
        case 403:
          message = "Доступ запрещен";
          break;
        case 404:
          message = "Ресурс не найден";
          break;
        case 422:
          message = data?.message || "Ошибка валидации";
          break;
        case 500:
          message = "Внутренняя ошибка сервера";
          break;
        default:
          message = data?.message || error.message;
      }
    } else if (error.request) {
      title = "Ошибка сети";
      message = "Нет соединения с сервером. Проверьте интернет";
    } else {
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  notifications.show({
    title,
    message,
    color: "red",
    icon: "❌",
    autoClose: 5000,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.red[0],
        borderColor: theme.colors.red[6],
      },
      title: {
        color: theme.colors.red[9],
      },
      description: {
        color: theme.colors.red[8],
      },
    }),
  });
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    showErrorNotification(error);
    return Promise.reject(error);
  },
);
