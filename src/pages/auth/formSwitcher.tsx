import type { FormType } from "./AuthPage";
import c from "./AuthPage.module.scss";

export const FormSwitcher = ({
  setForm,
  form,
}: {
  setForm: (formType: FormType) => void;
  form: FormType;
}) => {
  return (
    <>
      <div className={c.or}>
        <span className={c.orDivider}></span>
        <p>или</p>
        <span className={c.orDivider}></span>
      </div>
      <div className={c.orOption}>
        {form === "login" ? (
          <>
            <p>Нет аккаунта?</p>{" "}
            <button
              onClick={() => setForm("register")}
              className={c.orOptionButton}
            >
              Создать
            </button>
          </>
        ) : (
          <>
            <p>Есть аккаунт?</p>
            <p
              onClick={() => setForm("login")}
              className={c.orOptionButton}
              role="link"
            >
              Войти
            </p>
          </>
        )}
      </div>
    </>
  );
};
