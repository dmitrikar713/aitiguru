// components/InputWithIcons.tsx
import React, { useState, type HTMLInputTypeAttribute } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import c from "./formInput.module.scss";
import clearIcon from "../../assets/clear.svg";

interface InputWithIconsProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  disabled?: boolean;
  leftIcon?: any;
  rightIcon?: any;
  type: HTMLInputTypeAttribute;
  label?: string;
  onClear?: () => void; // дополнительный колбэк при очистке
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  placeholder,
  disabled = false,
  leftIcon,
  rightIcon,
  type,
  onClear,
  label,
}: InputWithIconsProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        const handleClear = () => {
          onChange("");
          onClear?.();
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;

          if (type === "number") {
            if (newValue === "") {
              onChange("");
            } else {
              const numberValue = Number(newValue);
              onChange(isNaN(numberValue) ? "" : numberValue);
            }
          } else {
            onChange(newValue);
          }
        };

        return (
          <div className={c.inputWrapper}>
            {label && <p className={c.label}>{label}</p>}

            <div className={c.input}>
              {leftIcon && (
                <div className={c.icon}>
                  <img src={leftIcon} alt="icon" />
                </div>
              )}

              <input
                type={type}
                value={value || ""}
                onChange={handleChange}
                name={name}
                onBlur={() => {
                  onBlur();
                }}
                placeholder={placeholder}
                disabled={disabled}
                className={c.inputInner}
              />

              {rightIcon && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={c.icon}
                  aria-label="Очистить поле"
                  disabled={disabled}
                >
                  <img src={rightIcon} alt="eye" />
                </button>
              )}

              {onClear && value && (
                <button onClick={handleClear} className={c.icon}>
                  <img src={clearIcon} alt="icon" />
                </button>
              )}
            </div>

            {/* Сообщение об ошибке */}
            {error && <span className={c.error}>{error.message}</span>}
          </div>
        );
      }}
    />
  );
}
