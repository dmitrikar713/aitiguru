import { useForm, type SubmitHandler } from "react-hook-form";
import c from "./register.module.scss";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../../../components/input/formInput";
import lock from "../../../assets/lock.svg";
import { register } from "../authSlice";
import userIcon from "../../../assets/user.svg";
import { notifications } from "@mantine/notifications";

const registerSchema = z.object({
  username: z.string().min(1, "username обязателен"),
  password: z
    .string()
    .min(1, "Пароль обязателен")
    .min(6, "Пароль должен быть минимум 6 символов")
    .max(50, "Пароль слишком длинный"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register = () => {
  const { control, handleSubmit, setValue } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      username: "emilys",
      password: "emilyspass",
    },
  });
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const status = await register(data);
    console.log(status);
    if (status === 201) {
      notifications.show({
        title: "Успешно",
        message: "Вы успешно зарегистрировались!",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось регистрироваться!",
      });
    }
  };

  return (
    <form className={c.form} onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        type="text"
        control={control}
        name="username"
        onClear={() => setValue("username", "")}
        leftIcon={userIcon}
        label="Логин"
      />
      <FormInput
        label="Пароль"
        control={control}
        name="password"
        type="text"
        leftIcon={lock}
      />

      <button type="submit" className={c.button}>
        <div className={c.buttonBg} />
        Зарегистрироваться
      </button>
    </form>
  );
};
