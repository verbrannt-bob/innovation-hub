import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faUser, faGraduationCap } from '@fortawesome/free-solid-svg-icons'

function TarjetaSolicitud({ solicitud, onAceptar, onRechazar, procesando }) {
    const { solicitante, mensaje } = solicitud

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h5 className="card-title m-0 d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-primary" />
                        {`${solicitante.nombre} ${solicitante.apellido1} ${solicitante.apellido2 ?? ''}`}
                    </h5>
                    <p className="text-muted small mb-1">
                        <FontAwesomeIcon icon={faGraduationCap} className="me-1" />
                        {solicitante.carrera} — {solicitante.email}
                    </p>
                    {mensaje && (
                        <p className="card-text bg-light p-2 rounded border small mb-0 mt-2">
                            "{mensaje}"
                        </p>
                    )}
                </div>
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                        onClick={() => onRechazar(solicitud._id)}
                        disabled={procesando}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                        Rechazar
                    </button>
                    <button
                        className="btn btn-sm btn-success d-flex align-items-center gap-1"
                        onClick={() => onAceptar(solicitud._id, solicitante._id)}
                        disabled={procesando}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TarjetaSolicitud