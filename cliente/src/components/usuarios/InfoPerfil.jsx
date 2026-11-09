import { useState, useEffect } from 'react'
import fotoPerfilDefecto from '../../assets/fotoPerfilDefecto.jpg'
import {
    obtenerUsuarioId,
    obtenerIniciativasPorMiembro,
    obtenerCompetencias,
    agregarCompetenciaAUsuario
} from '../../api/iniciativasApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faBrain, faLightbulb, faPlus } from "@fortawesome/free-solid-svg-icons"
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../autenticacion/AuthContext'
import { NIVELES } from '../../dataPrueba/iniciativas'

function InfoPerfil({ id }) {
    const { usuario: usuarioSesion } = useAuth()

    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [iniciativas, setIniciativas] = useState([])


    const [listaCompetencias, setListaCompetencias] = useState([])
    const [mostrarForm, setMostrarForm] = useState(false)
    const [competenciaSeleccionada, setCompetenciaSeleccionada] = useState('')
    const [nivelSeleccionado, setNivelSeleccionado] = useState(NIVELES[0])
    const [guardandoComp, setGuardandoComp] = useState(false)


    useEffect(() => {
        async function cargar() {
            try {
                const resultado = await obtenerUsuarioId(id)
                setUsuario(resultado)
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        if (id) cargar()
    }, [id])


    useEffect(() => {
        async function cargarIniciativas() {
            if (id) {
                try {
                    const res = await obtenerIniciativasPorMiembro(id)
                    setIniciativas(res ?? [])
                } catch (e) {
                    setIniciativas([])
                }
            }
        }
        cargarIniciativas()
    }, [id])


    useEffect(() => {
        async function cargarCatalogo() {
            try {
                const comps = await obtenerCompetencias()
                setListaCompetencias(comps)
                if (comps.length > 0) setCompetenciaSeleccionada(comps[0]._id)
            } catch (err) {
                console.error("Error al cargar competencias:", err)
            }
        }
        if (mostrarForm) cargarCatalogo()
    }, [mostrarForm])


    const handleAgregarCompetencia = async (e) => {
        e.preventDefault()
        if (!competenciaSeleccionada) return

        // Buscar el objeto completo de la competencia seleccionada para extraer su nombre
        const compObjeto = listaCompetencias.find(c => c._id === competenciaSeleccionada)
        if (!compObjeto) return

        setGuardandoComp(true)
        try {
            const usuarioActualizado = await agregarCompetenciaAUsuario(
                usuario._id,
                compObjeto._id,
                compObjeto.nombre,
                nivelSeleccionado
            )
            setUsuario(usuarioActualizado)
            setMostrarForm(false)
        } catch (err) {
            console.log(err.message)
        } finally {
            setGuardandoComp(false)
        }
    }

    if (cargando) return <p className="text-center p-5">Cargando perfil...</p>
    if (error) return <p className="text-center p-5 text-danger">Error: {error}</p>
    if (!usuario) return <p className="text-center p-5">No se encontró el usuario.</p>


    const esMiPerfil = usuarioSesion?.email === usuario.email

    return (
        <section className="row d-flex justify-content-start align-items-top perfil-usuario">
            <img src={fotoPerfilDefecto} alt="foto-perfil" className="col-6 col-sm-4 col-md-3 col-lg-2 img-fluid object-fit-cover mb-5" />
            <div className="col-6 col-lg-10 mb-5">
                <h2 className="nombre">
                    {`${usuario.nombre ?? ''} ${usuario.apellido1 ?? ''} ${usuario.apellido2 ?? ''}`}
                </h2>
                <p>{usuario.email}</p>
                <p>{usuario.tipo}</p>
                <div className="d-flex flex-column justify-content-around">
                    <h3 className="etiqueta">Carrera</h3>
                    <p>{usuario.carrera}</p>
                </div>
                <div>
                    <h3 className="etiqueta">Descripción Personal</h3>
                    <p>{usuario.descripcion}</p>
                </div>
            </div>

            <div className="col-12 col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="etiqueta m-0">Competencias</h3>
                    {esMiPerfil && (
                        <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            onClick={() => setMostrarForm(!mostrarForm)}
                        >
                            <FontAwesomeIcon icon={faPlus} size="xs" /> Competencia
                        </button>
                    )}
                </div>

                {esMiPerfil && mostrarForm && (
                    <form onSubmit={handleAgregarCompetencia} className="card p-3 mb-3 shadow-sm bg-light">
                        <div className="mb-2">
                            <label className="form-label fw-bold">Seleccionar Competencia</label>
                            <select
                                className="form-select form-select-sm"
                                value={competenciaSeleccionada}
                                onChange={(e) => setCompetenciaSeleccionada(e.target.value)}
                            >
                                {listaCompetencias.map((comp) => (
                                    <option key={comp._id} value={comp._id}>
                                        {comp.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="form-label fw-bold">Nivel</label>
                            <select
                                className="form-select form-select-sm"
                                value={nivelSeleccionado}
                                onChange={(e) => setNivelSeleccionado(e.target.value)}
                            >
                                {NIVELES.map((nivel) => (
                                    <option key={nivel} value={nivel}>
                                        {nivel}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="d-flex gap-2 justify-content-end mt-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                onClick={() => setMostrarForm(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-sm btn-primary"
                                disabled={guardandoComp}
                            >
                                {guardandoComp ? 'Guardando...' : 'Agregar'}
                            </button>
                        </div>
                    </form>
                )}

                <div>
                    {usuario.competencias?.map((competencia) => (
                        <p className="card m-0 mt-1 p-1 d-flex flex-row align-items-center gap-3 tarjeta-perfil" key={competencia._id || competencia}>
                            <FontAwesomeIcon icon={faCheck} size="xs" color="#00a896" />
                            <span>{competencia.nombre + " - " + competencia.nivel}</span>
                        </p>
                    ))}
                </div>
            </div>

            <div className="col-12 col-md-6">
                <h3 className="etiqueta">Intereses</h3>
                <div>
                    {usuario.intereses?.map((interes, index) => (
                        <p className="card m-0 mt-1 p-1 d-flex flex-row align-items-center gap-3 tarjeta-perfil" key={index}>
                            <FontAwesomeIcon icon={faBrain} size="xs" color="#00a896" />
                            <span>{interes}</span>
                        </p>
                    ))}
                </div>
            </div>

            <div className="col-12 mt-3">
                <h3 className="etiqueta">Iniciativas</h3>
                <div>
                    {iniciativas?.map((iniciativa) => (
                        <div className="card m-0 mt-1 p-2 d-flex flex-row align-items-center justify-content-between tarjeta-perfil" key={iniciativa._id}>
                            <div className="d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faLightbulb} size="xs" color="#00a896" />
                                <span>{iniciativa.titulo}</span>
                            </div>
                            <NavLink to={`/iniciativa/${iniciativa._id}`}>
                                <button className='btn btn-sm btn-outline-primary'>Detalles</button>
                            </NavLink>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default InfoPerfil