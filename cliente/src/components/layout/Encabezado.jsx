import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb, faCircleUser, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../autenticacion/AuthContext'

function Encabezado() {
    const { usuario, login, logout } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    
    // Estados nativos de React para controlar los menús desplegables
    const [menuUserAbierto, setMenuUserAbierto] = useState(false)
    const [navBarAbierta, setNavBarAbierta] = useState(false)

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            await login(email, password)
            setEmail('')
            setPassword('')
            setMenuUserAbierto(false) // Cierra el menú desplegable tras el login exitoso
        } catch (err) {
            setError(err.message)
        }
    }

    const handleLogout = () => {
        logout()
        setMenuUserAbierto(false)
    }

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container-fluid px-5">
                    <NavLink to='/' className="navbar-brand fw-bold fs-4">
                        <FontAwesomeIcon icon={faLightbulb} className='me-2' />Innovation Hub
                    </NavLink>
                    
                    {/* Botón Toggler para móvil manejado con React */}
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        onClick={() => setNavBarAbierta(!navBarAbierta)}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    {/* Contenedor del navbar con clase condicional 'show' de Bootstrap */}
                    <div className={`collapse navbar-collapse ${navBarAbierta ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link fw-semibold" onClick={() => setNavBarAbierta(false)}>Inicio</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/catalogo" className="nav-link" onClick={() => setNavBarAbierta(false)}>Iniciativas</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/publicar" className="nav-link" onClick={() => setNavBarAbierta(false)}>Publicar</NavLink>
                            </li>

                            {/* --- BOTÓN DE USUARIO Y MENÚ DESPLEGABLE --- */}
                            <li className="nav-item position-relative btn-user ms-lg-2">
                                <button 
                                    type="button"
                                    className="btn btn-user text-white d-flex align-items-center gap-2 border-0"
                                    aria-label="Opciones de usuario" 
                                    onClick={() => setMenuUserAbierto(!menuUserAbierto)}
                                >
                                    <FontAwesomeIcon icon={faCircleUser} size='xl'/>
                                    {usuario && <span className="d-none d-lg-inline">{usuario.nombre}</span>}
                                </button>

                                {/* Desplegable de Login / Opciones activado con clase 'show' */}
                                <div className={`collapse position-absolute end-0 mt-2 p-3 bg-white text-dark rounded shadow-lg style-menu-usuario ${menuUserAbierto ? 'show' : ''}`} style={{ width: '260px', zIndex: 1000 }}>
                                    {usuario ? (
                                        // VISTA USUARIO LOGUEADO
                                        <div className="d-flex flex-column gap-2">
                                            <p className="fw-bold m-0 text-primary">{usuario.nombre} {usuario.apellido1}</p>
                                            <small className="text-muted">{usuario.email}</small>
                                            <hr className="my-1" />
                                            <NavLink 
                                                to={`/perfil/${usuario._id}`}
                                                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                                                onClick={() => setMenuUserAbierto(false)}
                                            >
                                                <FontAwesomeIcon icon={faUser} /> Mi Perfil
                                            </NavLink>
                                            <button onClick={handleLogout} className="btn btn-sm btn-danger d-flex align-items-center gap-2">
                                                <FontAwesomeIcon icon={faRightFromBracket} /> Cerrar Sesión
                                            </button>
                                        </div>
                                    ) : (
                                        // VISTA FORMULARIO DE LOGIN
                                        <form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-2">
                                            <h6 className="fw-bold m-0 text-center">Iniciar Sesión</h6>
                                            {error && <small className="text-danger text-center">{error}</small>}
                                            <div>
                                                <input 
                                                    type="email" 
                                                    className="form-control form-control-sm" 
                                                    placeholder="Correo"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div>
                                                <input 
                                                    type="password" 
                                                    className="form-control form-control-sm" 
                                                    placeholder="Contraseña"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-sm w-100 mt-1">
                                                Ingresar
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Encabezado