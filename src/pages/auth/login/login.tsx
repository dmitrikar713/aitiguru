import { useForm, type SubmitHandler } from "react-hook-form";
import c from "./login.module.scss";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../../../components/input/formInput";
import lock from "../../../assets/lock.svg";
import eye from "../../../assets/eye.svg";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../routes/routes";
import { useLogin } from "../authSlice";
import { RememberCheckBox } from "./rememberMe";
import userIcon from "../../../assets/user.svg";

export const loginSchema = z.object({
  username: z.string().min(1, "username обязателен"),
  password: z
    .string()
    .min(1, "Пароль обязателен")
    .min(6, "Пароль должен быть минимум 6 символов")
    .max(50, "Пароль слишком длинный"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const { login } = useLogin();
  const navigate = useNavigate();

  const { control, handleSubmit, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      username: "emilys",
      password: "emilyspass",
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const result = await login(data.username, data.password, data.rememberMe);
    if (result.success) {
      navigate(ROUTES.TABLE.path, { replace: true });
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
        type="password"
        leftIcon={lock}
        rightIcon={eye}
      />
      <RememberCheckBox control={control} name="rememberMe" />

      <button type="submit" className={c.button}>
        <div className={c.buttonBg} />
        Войти
      </button>
    </form>
  );
};
