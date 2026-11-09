import { useState, useEffect } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { 
    obtenerIniciativaId, 
    obtenerSolicitudesIniciativa, 
    aceptarSolicitudApi, 
    rechazarSolicitudApi 
} from '../api/iniciativasApi'
import Pagina from '../components/layout/Pagina'
import TarjetaSolicitud from '../components/solicitudes/TarjetaSolicitud'
import { useAuth } from '../autenticacion/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

function VerSolicitudes() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { usuario: usuarioSesion } = useAuth()

    const [iniciativa, setIniciativa] = useState(null)
    const [solicitudes, setSolicitudes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [procesandoId, setProcesandoId] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function cargar() {
            try {
                const [iniData, solData] = await Promise.all([
                    obtenerIniciativaId(id),
                    obtenerSolicitudesIniciativa(id)
                ])

                // Verificar si es propietario
                const esProp = usuarioSesion && (
                    usuarioSesion._id === iniData.propietarioId || 
                    usuarioSesion.email === iniData.propietario?.email
                )

                if (!esProp) {
                    navigate(`/iniciativa/${id}`)
                    return
                }

                setIniciativa(iniData)
                setSolicitudes(solData ?? [])
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [id, usuarioSesion, navigate])

    const handleAceptar = async (solicitudId, usuarioId) => {
        setProcesandoId(solicitudId)
        try {
            await aceptarSolicitudApi(id, solicitudId, usuarioId)
            setSolicitudes(prev => prev.filter(s => s._id !== solicitudId))
        } catch (err) {
            alert(err.message || "Error al aceptar la solicitud.")
        } finally {
            setProcesandoId(null)
        }
    }

    const handleRechazar = async (solicitudId) => {
        setProcesandoId(solicitudId)
        try {
            await rechazarSolicitudApi(id, solicitudId)
            setSolicitudes(prev => prev.filter(s => s._id !== solicitudId))
        } catch (err) {
            alert(err.message || "Error al rechazar la solicitud.")
        } finally {
            setProcesandoId(null)
        }
    }

    if (cargando) return <Pagina><p className="text-center p-5">Cargando solicitudes...</p></Pagina>
    if (error) return <Pagina><p className="text-center p-5 text-danger">{error}</p></Pagina>

    return (
        <Pagina titulo={`Solicitudes: ${iniciativa?.titulo}`}>
            <div className="container py-3">
                <NavLink to={`/iniciativa/${id}`} className="btn btn-outline-secondary btn-sm mb-4">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Volver a la Iniciativa
                </NavLink>

                {solicitudes.length > 0 ? (
                    solicitudes.map(solicitud => (
                        <TarjetaSolicitud
                            key={solicitud._id}
                            solicitud={solicitud}
                            onAceptar={handleAceptar}
                            onRechazar={handleRechazar}
                            procesando={procesandoId === solicitud._id}
                        />
                    ))
                ) : (
                    <div className="text-center py-5 text-muted border rounded bg-light">
                        <h5>No hay solicitudes pendientes</h5>
                        <p className="mb-0">Las solicitudes de nuevos miembros aparecerán aquí.</p>
                    </div>
                )}
            </div>
        </Pagina>
    )
}

export default VerSolicitudes