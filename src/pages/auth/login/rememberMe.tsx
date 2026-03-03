import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import c from "./login.module.scss";

interface InputWithIconsProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
}

export function RememberCheckBox<T extends FieldValues>({
  name,
  control,
}: InputWithIconsProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <div className={c.remember}>
            <input
              className={c.rememberInput}
              type={"checkbox"}
              name={name}
              value={value || ""}
              onChange={onChange}
              onBlur={() => {
                onBlur();
              }}
            />
            <p className={c.rememberText}>Запомнить данные</p>
          </div>
        );
      }}
    />
  );
}
