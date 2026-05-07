import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa axios
import './EditProfile.css'; // Asegúrate de agregar los estilos necesarios
import Navbar from './Navbar';

function EditProfile() {
    const [profileData, setProfileData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        telefono: '',
        direccion: '',
        avatar: '',
        password: '' // Se agrega el campo para la contraseña
    });
    const [initialProfile, setInitialProfile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [initialAvatar, setInitialAvatar] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const formatApiErrors = (data, status) => {
        if (!data) {
            return status ? `Error ${status} al actualizar perfil.` : 'Error al actualizar perfil.';
        }

        if (typeof data === 'string') {
            return data;
        }

        if (Array.isArray(data)) {
            return data.join('\n');
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
            .join('\n');
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = JSON.parse(localStorage.getItem('user'))?.id;
            const storedAvatar = localStorage.getItem('userAvatar') || '';
            setAvatarPreview(storedAvatar);
            setInitialAvatar(storedAvatar);

            if (!userId) {
                navigate('/'); // Redirige si no hay usuario
                return;
            }

            try {
                const response = await axios.get(`/api/usuarios/${userId}/`); // Usamos axios.get
                const avatarValue = response.data.avatar || storedAvatar;
                setAvatarPreview(avatarValue);
                setInitialAvatar(avatarValue);
                setProfileData({
                    username: response.data.username,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: response.data.email,
                    telefono: response.data.telefono,
                    direccion: response.data.direccion,
                    avatar: avatarValue,
                    password: '' // No llenamos la contraseña al obtener los datos
                });
                setInitialProfile({
                    username: response.data.username,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: response.data.email,
                    telefono: response.data.telefono,
                    direccion: response.data.direccion,
                    avatar: avatarValue,
                    password: ''
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Selecciona un archivo de imagen valido.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setProfileData({ ...profileData, avatar: reader.result });
                setAvatarPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarClick = () => {
        if (!isEditing) {
            setInitialProfile({ ...profileData, password: '' });
            setInitialAvatar(avatarPreview);
            setIsEditing(true);
        }
        const input = document.getElementById('avatar-input');
        if (input) {
            input.click();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEditing) {
            setInitialProfile({ ...profileData, password: '' });
            setInitialAvatar(avatarPreview);
            setIsEditing(true);
            return;
        }

        const errors = [];

        if (!profileData.first_name.trim()) errors.push('Nombre es obligatorio.');
        if (!profileData.last_name.trim()) errors.push('Apellido es obligatorio.');
        if (!profileData.telefono.trim()) errors.push('Telefono es obligatorio.');
        if (!profileData.direccion.trim()) errors.push('Direccion es obligatoria.');

        const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
        if (profileData.username && !usernameRegex.test(profileData.username)) {
            errors.push('Nombre de usuario invalido: usa 3-20 caracteres, letras, numeros, punto, guion o guion bajo.');
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (profileData.email && !emailRegex.test(profileData.email)) {
            errors.push('Correo invalido.');
        }

        const telefonoRegex = /^\d{11}$/;
        if (profileData.telefono && !telefonoRegex.test(profileData.telefono)) {
            errors.push('Telefono invalido: solo numeros, deben ser 11 digitos.');
        }

        if (profileData.password && profileData.password.length < 8) {
            errors.push('Contrasena muy corta: minimo 8 caracteres.');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        // Si la contraseña está vacía, no la incluimos en los datos a enviar
        const { password, ...profileWithoutPassword } = profileData;
        const dataToUpdate = password ? { ...profileWithoutPassword, password } : profileWithoutPassword;

        console.log('Datos enviados:', dataToUpdate); // Verifica los datos enviados

        const userId = JSON.parse(localStorage.getItem('user'))?.id;

        try {
            const response = await axios.patch(`/api/usuarios/${userId}/`, dataToUpdate, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Actualiza el localStorage con los nuevos datos
                const updatedUser = {
                    id: userId,
                    username: profileData.username,
                    email: profileData.email,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                if (avatarPreview) {
                    localStorage.setItem('userAvatar', avatarPreview);
                } else {
                    localStorage.removeItem('userAvatar');
                }

                // Muestra el mensaje de éxito y luego redirige al Dashboard
                alert('Perfil actualizado con éxito');
                setInitialProfile({ ...profileData, password: '' });
                setInitialAvatar(avatarPreview);
                setIsEditing(false);
                navigate('/'); // Redirige al dashboard después de la actualización
            } else {
                alert('Error al actualizar el perfil');
            }
        } catch (err) {
            console.error('Error al actualizar perfil:', err.response ? err.response.data : err.message);
            alert(formatApiErrors(err.response?.data, err.response?.status));
        }
    };

    const handleCancelEdit = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (initialProfile) {
            setProfileData({ ...initialProfile, password: '' });
        }
        setAvatarPreview(initialAvatar);
        setIsEditing(false);
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <Navbar />
            <div className="edit-profile-container">
                <div className="edit-profile-card">
                    <div className="edit-profile-header">
                        <div>
                            <p className="edit-profile-kicker">settings</p>
                            <h1 className="edit-profile-title">Editar perfil</h1>
                        </div>
                        <button
                            type="button"
                            className="edit-profile-avatar"
                            onClick={handleAvatarClick}
                            aria-label="Cambiar foto de perfil"
                            title="Cambiar foto de perfil"
                        >
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="edit-profile-avatar__image"
                                />
                            ) : (
                                profileData.username ? profileData.username[0].toUpperCase() : 'U'
                            )}
                        </button>
                    </div>
                    <form className="edit-profile-form" onSubmit={handleSubmit}>
                        <input
                            id="avatar-input"
                            className="edit-profile-input edit-profile-input--hidden"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            disabled={!isEditing}
                        />
                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Nombre de usuario</label>
                            <input
                                className="edit-profile-input"
                                type="text"
                                name="username"
                                value={profileData.username || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Nombre</label>
                            <input
                                className="edit-profile-input"
                                type="text"
                                name="first_name"
                                value={profileData.first_name || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Apellido</label>
                            <input
                                className="edit-profile-input"
                                type="text"
                                name="last_name"
                                value={profileData.last_name || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Email</label>
                            <input
                                className="edit-profile-input"
                                type="email"
                                name="email"
                                value={profileData.email || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Telefono</label>
                            <input
                                className="edit-profile-input"
                                type="tel"
                                name="telefono"
                                value={profileData.telefono || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="edit-profile-field">
                            <label className="edit-profile-label">Direccion</label>
                            <input
                                className="edit-profile-input"
                                type="text"
                                name="direccion"
                                value={profileData.direccion || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="edit-profile-field edit-profile-field--full">
                            <label className="edit-profile-label">Nueva contrasena (opcional)</label>
                            <input
                                className="edit-profile-input"
                                type="password"
                                name="password"
                                value={profileData.password || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="edit-profile-actions">
                            {isEditing ? (
                                <>
                                    <button type="button" className="edit-profile-button edit-profile-button--ghost" onClick={handleCancelEdit}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="edit-profile-button">
                                        Guardar
                                    </button>
                                </>
                            ) : (
                                <button type="submit" className="edit-profile-button">
                                    Editar perfil
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default EditProfile;
