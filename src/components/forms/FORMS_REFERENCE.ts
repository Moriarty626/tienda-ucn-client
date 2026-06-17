// Referencia de Formularios con React Hook Form e Integracion Zod

/**
 * COMPONENTES BASE DE FORMULARIOS
 * ==============================
 *
 * 1. FormInput
 *    Componente input reutilizable integrado con React Hook Form
 *    Props:
 *      - name: nombre del campo (requerido)
 *      - control: control del formulario (requerido)
 *      - label: etiqueta del campo (opcional)
 *      - type: tipo de input (email, password, text, etc)
 *      - placeholder: placeholder del input
 *      - error: mensaje de error a mostrar
 *      - rules: reglas de validacion de React Hook Form
 *      - description: descripcion del campo
 *
 * 2. FormCheckbox
 *    Componente checkbox integrado con React Hook Form
 *    Props:
 *      - name: nombre del campo (requerido)
 *      - control: control del formulario (requerido)
 *      - label: etiqueta del campo
 *      - labelText: texto alternativo para la etiqueta (en checkbox)
 *      - error: mensaje de error
 *      - rules: reglas de validacion
 *
 * 3. FormTextarea
 *    Componente textarea integrado con React Hook Form
 *    Props:
 *      - name: nombre del campo
 *      - control: control del formulario
 *      - label: etiqueta del campo
 *      - placeholder: placeholder del textarea
 *      - error: mensaje de error
 *      - rules: reglas de validacion
 *
 * 4. FormSelect
 *    Componente select integrado con React Hook Form
 *    Props:
 *      - name: nombre del campo
 *      - control: control del formulario
 *      - label: etiqueta del campo
 *      - options: array de opciones { value, label }
 *      - error: mensaje de error
 *      - rules: reglas de validacion
 *
 *
 * FORMULARIOS DE AUTENTICACION
 * ===========================
 *
 * 1. LoginForm
 *    Props:
 *      - onSubmit: funcion async que recibe { email, password }
 *      - isLoading: booleano para estado de carga
 *
 *    Ejemplo:
 *      const handleLogin = async (data: LoginFormData) => {
 *        await axiosClient.post("/auth/login", data);
 *      };
 *      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
 *
 * 2. RegisterForm
 *    Props:
 *      - onSubmit: funcion async que recibe datos de registro
 *      - isLoading: booleano para estado de carga
 *
 *    Datos validados:
 *      - nombre (2-100 caracteres)
 *      - email (debe ser valido)
 *      - password (minimo 8, con mayuscula, numero, especial)
 *      - confirmPassword (debe coincidir)
 *      - terminos (debe ser true)
 *
 * 3. ChangePasswordForm
 *    Props:
 *      - onSubmit: funcion async que recibe datos de cambio
 *      - isLoading: booleano para estado de carga
 *
 *    Datos validados:
 *      - currentPassword
 *      - newPassword
 *      - confirmPassword (debe coincidir)
 *
 * 4. ForgotPasswordForm
 *    Props:
 *      - onSubmit: funcion async que recibe { email }
 *      - isLoading: booleano para estado de carga
 *
 * 5. ResetPasswordForm
 *    Props:
 *      - token: token de recuperacion (requerido)
 *      - onSubmit: funcion async que recibe datos
 *      - isLoading: booleano para estado de carga
 *
 * 6. VerifyEmailForm
 *    Props:
 *      - email: email a verificar (requerido)
 *      - onSubmit: funcion async que recibe { email, code }
 *      - isLoading: booleano para estado de carga
 *      - onResendCode: funcion async para reenviar codigo (opcional)
 *
 * 7. EditProfileForm
 *    Props:
 *      - initialData: datos iniciales para precargar (opcional)
 *      - onSubmit: funcion async que recibe datos
 *      - isLoading: booleano para estado de carga
 *
 *    Datos validados:
 *      - nombre (2-100 caracteres)
 *      - telefono (opcional)
 *      - direccion (opcional, maximo 255 caracteres)
 *
 *
 * EJEMPLO DE USO COMPLETO
 * =======================
 *
 * import { LoginForm } from "@/components/forms";
 * import { axiosClient } from "@/clients";
 * import { useState } from "react";
 *
 * export function LoginPage() {
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   const handleLogin = async (data: LoginFormData) => {
 *     setIsLoading(true);
 *     try {
 *       const response = await axiosClient.post("/auth/login", data);
 *       // Guardar token
 *       localStorage.setItem("token", response.data.token);
 *       // Redirigir
 *       router.push("/");
 *     } catch (error) {
 *       throw new Error("Credenciales invalidas");
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 *
 *   return (
 *     <div className="max-w-md mx-auto mt-8">
 *       <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
 *     </div>
 *   );
 * }
 *
 *
 * INTEGRACION CON VALIDACION ZOD
 * =============================
 *
 * Todos los formularios estan integrados con esquemas Zod:
 *   - LoginSchema
 *   - RegisterSchema
 *   - ChangePasswordSchema
 *   - ForgotPasswordSchema
 *   - ResetPasswordSchema
 *   - VerifyEmailSchema
 *   - EditProfileSchema
 *
 * La validacion ocurre automanticamente en onBlur o al submitir el formulario.
 * Los errores se muestran bajo cada campo del formulario.
 *
 *
 * ESTRATEGIA DE VALIDACION
 * =======================
 *
 * Mode: "onBlur"
 *   - Los campos se validan cuando pierde el foco
 *   - Permite mejor experiencia UX sin validar en tiempo real
 *   - Los errores persisten hasta que se corrija el valor
 *
 * Custom errors:
 *   - Todos los campos muestran mensaje de error personalizado
 *   - Se usa la funcion formatValidationErrors() para parsear errores Zod
 *   - Los errores se pasan al componente via prop "error"
 */
