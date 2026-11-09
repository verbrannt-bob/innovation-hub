import { useState, useEffect, useRef } from "react"
import { obtenerIniciativaId, eliminarIniciativa } from "../../api/iniciativasApi"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faClipboardCheck, faEllipsisV, faPenToSquare, faTriangleExclamation, faInbox } from "@fortawesome/free-solid-svg-icons"
import { faUser, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../autenticacion/AuthContext"


function DetalleIniciativa({ id }) {
    const { usuario: usuarioSesion } = useAuth()
    const [iniciativa, setIniciativa] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [eliminando, setEliminando] = useState(false)
    const [errorEliminar, setErrorEliminar] = useState(null)

    // Estado para controlar el desplegable de opciones
    const [menuAbierto, setMenuAbierto] = useState(false)
    const menuRef = useRef(null)

    // Estado para controlar la visibilidad del Modal de confirmación
    const [mostrarModal, setMostrarModal] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function cargar() {
            try {
                const resultado = await obtenerIniciativaId(id)
                setIniciativa(resultado)
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [id])

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuAbierto(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const abrirModalEliminar = () => {
        setMenuAbierto(false)
        setErrorEliminar(null)
        setMostrarModal(true)
    }

    const handleConfirmarEliminar = async () => {
        setEliminando(true)
        setErrorEliminar(null)
        try {
            await eliminarIniciativa(id)
            setMostrarModal(false)
            navigate('/catalogo')
        } catch (err) {
            setErrorEliminar(err.message || "Error al eliminar la iniciativa.")
        } finally {
            setEliminando(false)
        }
    }

    if (cargando) return <p className="text-center p-4 text-muted">Cargando iniciativa...</p>
    if (error) return <p className="text-center p-4 text-danger">Error: {error}</p>
    if (!iniciativa) return <p className="text-center p-4 text-muted">No se encontró la iniciativa.</p>

    const esPropietario = usuarioSesion && (
        usuarioSesion._id === iniciativa.propietarioId ||
        usuarioSesion.email === iniciativa.propietario?.email
    )

    return (
        <div className="detalle-iniciativa container-fluid position-relative">
            <div className="row cuerpo-iniciativa">
                <header className="col-12 encabezado-iniciativa d-flex justify-content-between align-items-start">
                    <div className="pe-4">
                        <h2 className="titulo-iniciativa m-0">{iniciativa.titulo}</h2>
                        <p className="mt-1 text-muted">
                            Por <span className="propietario-iniciativa">
                                {`${iniciativa.propietario?.nombre ?? ''} ${iniciativa.propietario?.apellido1 ?? ''} ${iniciativa.propietario?.apellido2 ?? ''}`}
                            </span>
                        </p>
                    </div>

                    {esPropietario && (
                        <div className="position-relative" ref={menuRef}>
                            <button
                                className="btn btn-outline-primary px-3 py-1"
                                type="button"
                                aria-label="Opciones"
                                onClick={() => setMenuAbierto(!menuAbierto)}
                            >
                                <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                            </button>

                            <div
                                id="opciones"
                                className={`collapse list-group position-absolute top-100 end-0 shadow-sm z-3 mt-1 ${menuAbierto ? 'show' : ''}`}
                            >
                                <NavLink to={`/editar/${iniciativa._id}`}>
                                    <button
                                        className="list-group-item list-group-item-action d-flex gap-2 align-items-center btn-editar"
                                        id="editar"
                                        onClick={() => {
                                            setMenuAbierto(false)
                                            navigate(`/iniciativa/${id}/editar`)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                        <span>Editar</span>
                                    </button>
                                </NavLink>

                                <button
                                    className="list-group-item list-group-item-action d-flex gap-2 align-items-center btn-eliminar text-danger"
                                    id="eliminar"
                                    onClick={abrirModalEliminar}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                <section className="col-12 col-md-8 col-lg-9 d-flex flex-column justify-content-between gap-4 pe-md-4">
                    <p className="descripcion-iniciativa" id="descripcion">{iniciativa.descripcion}</p>

                    <div className="contenedor-competencias">
                        <h3 className="etiqueta">Competencias Requeridas</h3>
                        <div className="d-flex gap-2 flex-wrap mt-2">
                            {iniciativa.competencias?.map((competencia) => (
                                <p className="card m-0 px-2 py-1 d-flex flex-row align-items-center gap-2 tarjeta-competencia" key={competencia._id}>
                                    <FontAwesomeIcon icon={faCheck} size="xs" color="#00a896" />
                                    <span>{competencia.nombre}</span>
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="contenedor-miembros">
                        <h3 className="etiqueta">Miembros</h3>
                        <div className="d-flex gap-2 flex-wrap mt-2">
                            {iniciativa.miembros?.map((miembro) => (
                                <p className="card m-0 px-2 py-1 d-flex flex-row align-items-center gap-2 tarjeta-miembro" key={miembro.email}>
                                    <FontAwesomeIcon icon={faUser} size="xs" color="#00a896" />
                                    <span>{`${miembro.nombre ?? ''} ${miembro.apellido1 ?? ''} ${miembro.apellido2 ?? ''}`}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="col-12 col-md-4 col-lg-3 caracteristicas-iniciativa d-flex flex-column justify-content-between gap-3 ps-md-4">
                    <div className="d-flex flex-column gap-3">
                        <div className="item-caracteristica contenedor-tipo">
                            <h3 className="etiqueta">Tipo</h3>
                            <p>{iniciativa.tipo}</p>
                        </div>
                        <div className="item-caracteristica contenedor-categoria">
                            <h3 className="etiqueta">Categoría</h3>
                            <p>{iniciativa.categoria}</p>
                        </div>
                        <div className="item-caracteristica contenedor-estado">
                            <h3 className="etiqueta">Estado</h3>
                            <p>{iniciativa.estado}</p>
                        </div>
                        <div className="item-caracteristica contenedor-visibilidad">
                            <h3 className="etiqueta">Nivel de Visibilidad</h3>
                            <p>{iniciativa.visibilidad}</p>
                        </div>
                    </div>

                    <div className="mt-3 d-flex flex-column gap-2">
                        {/* Si ES propietario, ve el botón de Ver Solicitudes */}
                        {esPropietario ? (
                            <NavLink to={`/iniciativa/${id}/solicitudes`} className="text-decoration-none d-flex">
                                <button className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2">
                                    <FontAwesomeIcon icon={faInbox} size="sm" />
                                    <span>Ver Solicitudes</span>
                                </button>
                            </NavLink>
                        ) : (
                            /* Si NO es propietario, ve el botón de Solicitar Participación */
                            <NavLink to={`/solicitud/${id}`} className="text-decoration-none d-flex">
                                <button className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center gap-2">
                                    <FontAwesomeIcon icon={faClipboardCheck} size="sm" />
                                    <span>Solicitar Participación</span>
                                </button>
                            </NavLink>
                        )}
                    </div>
                </aside>
            </div>

            {/* MODAL DE CONFIRMACIÓN EN BOOTSTRAP */}
            {mostrarModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content shadow">
                                <div className="modal-header bg-light">
                                    <h5 className="modal-title d-flex align-items-center gap-2 text-danger">
                                        <FontAwesomeIcon icon={faTriangleExclamation} /> Confirmar eliminación
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setMostrarModal(false)}
                                        disabled={eliminando}
                                        aria-label="Cerrar"
                                    ></button>
                                </div>
                                <div className="modal-body py-3">
                                    <p className="mb-0">
                                        ¿Está seguro de que desea eliminar la iniciativa <strong>"{iniciativa.titulo}"</strong>? Esta acción no se puede deshacer.
                                    </p>
                                    {errorEliminar && (
                                        <div className="alert alert-danger mt-3 mb-0 p-2 small">
                                            {errorEliminar}
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer bg-light">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setMostrarModal(false)}
                                        disabled={eliminando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger d-flex align-items-center gap-2"
                                        onClick={handleConfirmarEliminar}
                                        disabled={eliminando}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                        {eliminando ? 'Eliminando...' : 'Eliminar Iniciativa'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Telón de fondo (backdrop) */}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    )
}

export default DetalleIniciativa