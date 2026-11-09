import { useState, useEffect } from "react"
import { obtenerIniciativaId } from "../../api/iniciativasApi"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faClipboardCheck } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { NavLink } from "react-router-dom"

function DetalleIniciativa({ id }) {
    const [iniciativa, setIniciativa] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

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

    if (cargando) return <p className="text-center p-4 text-muted">Cargando iniciativa...</p>
    if (error) return <p className="text-center p-4 text-danger">Error: {error}</p>
    if (!iniciativa) return <p className="text-center p-4 text-muted">No se encontró la iniciativa.</p>

    return (
        <div className="detalle-iniciativa container-fluid">
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
                    <div className="position-relative">
                        <button className="btn btn-outline-primary px-3 py-1" type="button"
                            aria-label="Opciones" data-bs-toggle="collapse" data-bs-target="#opciones">
                            <i className="fa-solid fa-ellipsis-vertical fa-lg" aria-hidden="true"></i>
                        </button>
                        <div id="opciones" className="collapse list-group position-absolute top-100 end-0 shadow-sm z-3 mt-1">
                            <button className="list-group-item list-group-item-action d-flex gap-2 align-items-center btn-editar" id="editar">
                                <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i><span>Editar</span>
                            </button>
                            <button className="list-group-item list-group-item-action d-flex gap-2 align-items-center btn-eliminar" id="eliminar">
                                <i className="fa-regular fa-trash-can" aria-hidden="true"></i><span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                </header>

                <section className="col-12 col-md-8 col-lg-9 d-flex flex-column justify-content-between gap-4 pe-md-4">
                    <p className="descripcion-iniciativa" id="descripcion">{iniciativa.descripcion}</p>
                    
                    <div className="contenedor-competencias">
                        <h3 className="etiqueta">Competencias Requeridas</h3>
                        <div className="d-flex gap-2 flex-wrap mt-2">
                            {iniciativa.competencias?.map((competencia) => (
                                <p className="card m-0 px-2 py-1 d-flex flex-row align-items-center gap-2 tarjeta-competencia" key={competencia._id}>
                                    <FontAwesomeIcon icon={faCheck} size="xs" color="#00a896"/>
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
                                    <FontAwesomeIcon icon={faUser} size="xs" color="#00a896"/>
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

                    <div className="mt-3">
                        <NavLink to={`/solicitud/${id}`} className="text-decoration-none d-flex">
                            <button className="btn btn-outline-primary d-flex justify-content-center align-items-center gap-2">
                                <FontAwesomeIcon icon={faClipboardCheck} size="sm"/>
                                <span>Solicitar Participación</span>
                            </button>
                        </NavLink>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default DetalleIniciativa