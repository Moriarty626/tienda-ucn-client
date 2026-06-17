"use client";

import { forwardRef } from "react";
import { Controller } from "react-hook-form";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
  description?: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any;
  shouldUnregister?: boolean;
};

/**
 * Componente input reutilizable para React Hook Form
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      name,
      control,
      label,
      description,
      error,
      rules,
      shouldUnregister,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        shouldUnregister={shouldUnregister}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            {label && (
              <label
                htmlFor={name}
                className="text-sm font-medium text-slate-700"
              >
                {label}
                {rules?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            )}
            <input
              {...props}
              {...field}
              ref={ref}
              id={name}
              className={`px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-slate-300"
              } ${className}`}
            />
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )}
      />
    );
  }
);

FormInput.displayName = "FormInput";
