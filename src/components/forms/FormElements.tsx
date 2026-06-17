"use client";

import { forwardRef } from "react";
import { Controller } from "react-hook-form";

type FormCheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
  description?: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any;
  shouldUnregister?: boolean;
  labelText?: string;
};

/**
 * Componente checkbox reutilizable para React Hook Form
 */
export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  (
    {
      name,
      control,
      label,
      labelText,
      description,
      error,
      rules,
      shouldUnregister,
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
            <div className="flex items-start gap-2">
              <input
                {...field}
                {...props}
                ref={ref}
                type="checkbox"
                id={name}
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <label
                htmlFor={name}
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                {labelText || label}
                {rules?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            </div>
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

FormCheckbox.displayName = "FormCheckbox";

type FormTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
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
 * Componente textarea reutilizable para React Hook Form
 */
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
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
            <textarea
              {...props}
              {...field}
              ref={ref}
              id={name}
              className={`px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
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

FormTextarea.displayName = "FormTextarea";

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
  description?: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any;
  shouldUnregister?: boolean;
  options: Array<{ value: string | number; label: string }>;
};

/**
 * Componente select reutilizable para React Hook Form
 */
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      name,
      control,
      label,
      description,
      error,
      rules,
      options,
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
            <select
              {...props}
              {...field}
              ref={ref}
              id={name}
              className={`px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-slate-300"
              } ${className}`}
            >
              <option value="">Seleccionar...</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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

FormSelect.displayName = "FormSelect";
