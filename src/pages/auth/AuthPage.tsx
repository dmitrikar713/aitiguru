import { useState } from "react";
import c from "./AuthPage.module.scss";
import { Login } from "./login/login";
import { Register } from "./register/register";
import logo from "../../assets/logo.svg";
import { FormSwitcher } from "./formSwitcher";

export type FormType = "login" | "register";

export const AuthPage = () => {
  const [form, setForm] = useState<FormType>("login");

  const forms = {
    login: <Login />,
    register: <Register />,
  };

  return (
    <div className={c.page}>
      <div className={c.container}>
        <div className={c.containerBorder}>
          <div className={c.containerBg}>
            <div className={c.containerInner}>
              <Icon />
              <h1 className={c.title}>Добро пожаловать!</h1>
              <p className={c.description}>Пожалуйста, авторизируйтесь</p>
              <div className={c.formContainer}>{forms[form]}</div>

              <FormSwitcher {...{ form, setForm }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Icon = () => {
  return (
    <div className={c.iconContainer}>
      <div className={c.iconContainerBorder}>
        <div className={c.iconContainerBg}>
          <div className={c.iconContainerInner}>
            <img src={logo} alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};
