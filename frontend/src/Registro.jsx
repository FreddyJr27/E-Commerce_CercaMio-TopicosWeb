import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Registro.css";
import ButtonBack from './ButtonBack';
import apiClient from './api/api';

const RegistroUsuario = () => {
  const navigate = useNavigate();
  const formatApiErrors = (data, status) => {
    if (!data) {
      return status ? `Error ${status} al registrar el usuario.` : "Ocurrió un error al registrar el usuario.";
    }

    if (typeof data === 'string') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.join("\n");
    }

    if (data.detail) {
      return data.detail;
    }

    return Object.entries(data)
      .map(([field, messages]) => {
        if (Array.isArray(messages)) {
          return `${field}: ${messages.join(', ')}`;
        }
        return `${field}: ${messages}`;
      })
      .join("\n");
  };


  // Estados para manejar los datos del formulario
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    direccion: '',
    fecha_nacimiento: '',
    password: '',
    confirmPassword: '',
    telefono: ''
  });

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Manejar el envío del formulario
  const handleRegisterClick = async (e) => {
    e.preventDefault();

    // Validaciones de formulario
    const errors = [];

    if (!formData.first_name.trim()) errors.push('Nombre es obligatorio.');
    if (!formData.last_name.trim()) errors.push('Apellido es obligatorio.');
    if (!formData.username.trim()) errors.push('Nombre de usuario es obligatorio.');
    if (!formData.email.trim()) errors.push('Correo es obligatorio.');
    if (!formData.telefono.trim()) errors.push('Telefono es obligatorio.');
    if (!formData.direccion.trim()) errors.push('Direccion es obligatoria.');
    if (!formData.fecha_nacimiento) errors.push('Fecha de nacimiento es obligatoria.');
    if (!formData.password) errors.push('Contrasena es obligatoria.');
    if (!formData.confirmPassword) errors.push('Confirmar contrasena es obligatorio.');

    const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
    if (formData.username && !usernameRegex.test(formData.username)) {
      errors.push('Nombre de usuario invalido: usa 3-20 caracteres, letras, numeros, punto, guion o guion bajo.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Correo invalido.');
    }

    const telefonoRegex = /^\d{11}$/;
    if (formData.telefono && !telefonoRegex.test(formData.telefono)) {
      errors.push('Telefono invalido: solo numeros, deben ser 11 digitos.');
    }

    if (formData.password && formData.password.length < 8) {
      errors.push('Contrasena muy corta: minimo 8 caracteres.');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Las contrasenas no coinciden.');
    }

    if (formData.fecha_nacimiento) {
      const birthDate = new Date(formData.fecha_nacimiento);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (birthDate > today) {
        errors.push('Fecha de nacimiento no puede ser futura.');
      }

      const cutoff = new Date(today);
      cutoff.setFullYear(today.getFullYear() - 18);
      if (birthDate > cutoff) {
        errors.push('Debes ser mayor de 18 anos.');
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Crear el payload con el formato adecuado
    const payload = {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      fecha_nacimiento: formData.fecha_nacimiento,
      password: formData.password,
    };

    try {
      // Realiza el POST al backend
      const response = await apiClient.post('/api/usuarios/', payload);

      if (response.status === 201) {
        alert("Usuario registrado con éxito.");
        navigate('/'); // Redirigir al inicio de sesión
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error.response?.data || error.message);
      const message = formatApiErrors(error.response?.data, error.response?.status) || error.message;
      alert(message);
    }
  };

  return (
    <div className='cuerpo'>
      <ButtonBack />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Registro de Usuario</h1>
          <form>
            <label htmlFor="first_name" className="login-label">Nombre</label>
            <input
              type="text"
              id="first_name"
              className="login-input"
              placeholder="Ingrese su nombre"
              value={formData.first_name}
              onChange={handleInputChange}
            />

            <label htmlFor="last_name" className="login-label">Apellido</label>
            <input
              type="text"
              id="last_name"
              className="login-input"
              placeholder="Ingrese su apellido"
              value={formData.last_name}
              onChange={handleInputChange}
            />

            <label htmlFor="username" className="login-label">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              className="login-input"
              placeholder="Ingrese su nombre de usuario"
              value={formData.username}
              onChange={handleInputChange}
            />

            <label htmlFor="email" className="login-label">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="login-input"
              placeholder="Ingrese su correo"
              value={formData.email}
              onChange={handleInputChange}
            />

            <label htmlFor="telefono" className="login-label">Teléfono</label>
            <input
              type="text"
              id="telefono"
              className="login-input"
              placeholder="Ingrese su número de teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
            />

            <label htmlFor="direccion" className="login-label">Dirección</label>
            <input
              type="text"
              id="direccion"
              className="login-input"
              placeholder="Ingrese su dirección"
              value={formData.direccion}
              onChange={handleInputChange}
            />

            <label htmlFor="fecha_nacimiento" className="login-label">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fecha_nacimiento"
              className="login-input"
              placeholder="Ingrese su fecha de nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleInputChange}
            />

            <label htmlFor="password" className="login-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder="Ingrese su contraseña"
              value={formData.password}
              onChange={handleInputChange}
            />

            <label htmlFor="confirmPassword" className="login-label">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              className="login-input"
              placeholder="Confirme su contraseña"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />

            <button type="submit" className="login-button" onClick={handleRegisterClick}>
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;

