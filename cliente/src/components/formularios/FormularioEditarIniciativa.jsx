import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
    obtenerIniciativaId, 
    actualizarIniciativa, 
    eliminarMiembroIniciativa,
    obtenerCompetencias 
} from '../../api/iniciativasApi'
import { CATEGORIAS, TIPOS, ESTADOS, VISIBILIDADES } from '../../dataPrueba/iniciativas'
import FormularioBase from './FormularioBase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faUser } from '@fortawesome/free-regular-svg-icons'

function FormularioEditarIniciativa() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [iniciativa, setIniciativa] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState(null)
    const [catalogoCompetencias, setCatalogoCompetencias] = useState([])

    const [formData, setFormData] = useState({
        titulo: '',
        tipo: TIPOS[0],
        resumen: '',
        descripcion: '',
        problema: '',
        beneficiados: '',
        categoria: CATEGORIAS[0],
        cantidadIntegrantes: 1,
        visibilidad: VISIBILIDADES[0],
        estado: ESTADOS[0],
        competencias: []
    })

    const [miembros, setMiembros] = useState([])

    useEffect(() => {
        async function cargarDatos() {
            try {
                const [iniRes, compRes] = await Promise.all([
                    obtenerIniciativaId(id),
                    obtenerCompetencias()
                ])

                setIniciativa(iniRes)
                setCatalogoCompetencias(compRes)
                setMiembros(iniRes.miembros ?? [])

                setFormData({
                    titulo: iniRes.titulo ?? '',
                    tipo: iniRes.tipo ?? TIPOS[0],
                    resumen: iniRes.resumen ?? '',
                    descripcion: iniRes.descripcion ?? '',
                    problema: iniRes.problema ?? '',
                    beneficiados: iniRes.beneficiados ?? '',
                    categoria: iniRes.categoria ?? CATEGORIAS[0],
                    cantidadIntegrantes: iniRes.cantidadIntegrantes ?? 1,
                    visibilidad: iniRes.visibilidad ?? VISIBILIDADES[0],
                    estado: iniRes.estado ?? ESTADOS[0],
                    competencias: iniRes.competencias?.map(c => c._id || c) ?? []
                })
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        cargarDatos()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEliminarMiembro = async (miembroId, email) => {
        // Impedir que se intente eliminar al propietario
        if (email === iniciativa.propietario?.email) {
            alert('No se puede eliminar al propietario de la iniciativa.')
            return
        }

        try {
            await eliminarMiembroIniciativa(id, miembroId)
            setMiembros(miembros.filter(m => (m._id || m.email) !== (miembroId || email)))
        } catch (err) {
            setError(err.message || 'Error al eliminar el miembro.')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setGuardando(true)
        setError(null)

        try {
            await actualizarIniciativa(id, formData)
            navigate(`/iniciativa/${id}`)
        } catch (err) {
            setError(err.message || 'Error al actualizar la iniciativa.')
        } finally {
            setGuardando(false)
        }
    }

    if (cargando) return <p className="text-center p-5">Cargando datos de la iniciativa...</p>
    if (error && !iniciativa) return <p className="text-center p-5 text-danger">{error}</p>

    return (
        <FormularioBase
            titulo="Editar Iniciativa"
            subtitulo="Modifique los datos de la iniciativa según sea necesario."
            onSubmit={handleSubmit}
            cargando={guardando}
            errorGlobal={error}
            textoBotonSubmit="Guardar Cambios"
        >
            {/* PROPIETARIO (DESHABILITADO / SOLO LECTURA) */}
            <div className="mb-3">
                <label className="form-label fw-semibold mb-1">Propietario</label>
                <input
                    type="text"
                    className="form-control form-control-sm bg-light"
                    value={`${iniciativa?.propietario?.nombre ?? ''} ${iniciativa?.propietario?.apellido1 ?? ''} (${iniciativa?.propietario?.email ?? ''})`}
                    disabled
                />
                <small className="text-muted">El propietario de la iniciativa no puede ser cambiado.</small>
            </div>

            {/* TÍTULO Y TIPO */}
            <div className="row g-3 mb-3">
                <div className="col-12 col-md-8">
                    <label htmlFor="titulo" className="form-label fw-semibold mb-1">Título *</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        className="form-control form-control-sm"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="tipo" className="form-label fw-semibold mb-1">Tipo *</label>
                    <select
                        id="tipo"
                        name="tipo"
                        className="form-select form-select-sm"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                    >
                        {TIPOS.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* RESUMEN */}
            <div className="mb-3">
                <label htmlFor="resumen" className="form-label fw-semibold mb-1">Resumen *</label>
                <textarea
                    id="resumen"
                    name="resumen"
                    rows="2"
                    className="form-control form-control-sm"
                    value={formData.resumen}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mb-3">
                <label htmlFor="descripcion" className="form-label fw-semibold mb-1">Descripción *</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="4"
                    className="form-control form-control-sm"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* PROBLEMA Y BENEFICIADOS */}
            <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                    <label htmlFor="problema" className="form-label fw-semibold mb-1">Problema que resuelve *</label>
                    <input
                        type="text"
                        id="problema"
                        name="problema"
                        className="form-control form-control-sm"
                        value={formData.problema}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="beneficiados" className="form-label fw-semibold mb-1">Beneficiados *</label>
                    <input
                        type="text"
                        id="beneficiados"
                        name="beneficiados"
                        className="form-control form-control-sm"
                        value={formData.beneficiados}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {/* CATEGORÍA, ESTADO, VISIBILIDAD Y CANTIDAD INTEGRANTES */}
            <div className="row g-3 mb-3">
                <div className="col-12 col-md-3">
                    <label htmlFor="categoria" className="form-label fw-semibold mb-1">Categoría *</label>
                    <select
                        id="categoria"
                        name="categoria"
                        className="form-select form-select-sm"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                    >
                        {CATEGORIAS.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-3">
                    <label htmlFor="estado" className="form-label fw-semibold mb-1">Estado *</label>
                    <select
                        id="estado"
                        name="estado"
                        className="form-select form-select-sm"
                        value={formData.estado}
                        onChange={handleChange}
                        required
                    >
                        {ESTADOS.map(est => (
                            <option key={est} value={est}>{est}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-3">
                    <label htmlFor="visibilidad" className="form-label fw-semibold mb-1">Visibilidad *</label>
                    <select
                        id="visibilidad"
                        name="visibilidad"
                        className="form-select form-select-sm"
                        value={formData.visibilidad}
                        onChange={handleChange}
                        required
                    >
                        {VISIBILIDADES.map(vis => (
                            <option key={vis} value={vis}>{vis}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-3">
                    <label htmlFor="cantidadIntegrantes" className="form-label fw-semibold mb-1">Cupo Integrantes *</label>
                    <input
                        type="number"
                        id="cantidadIntegrantes"
                        name="cantidadIntegrantes"
                        min="1"
                        max="30"
                        className="form-control form-control-sm"
                        value={formData.cantidadIntegrantes}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {/* GESTIÓN DE MIEMBROS (SOLO ELIMINAR) */}
            <div className="mb-3 border rounded p-3 bg-light">
                <h6 className="fw-bold mb-2">Miembros Actuales ({miembros.length})</h6>
                <div className="d-flex flex-column gap-2">
                    {miembros.map((miembro) => {
                        const esPropietario = miembro.email === iniciativa?.propietario?.email
                        return (
                            <div key={miembro._id || miembro.email} className="d-flex align-items-center justify-content-between p-2 bg-white rounded border">
                                <div className="d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faUser} size="xs" className="text-primary" />
                                    <span className="small">
                                        {miembro.nombre} {miembro.apellido1} ({miembro.email})
                                    </span>
                                    {esPropietario && <span className="badge bg-primary ms-1">Propietario</span>}
                                </div>
                                {!esPropietario && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger py-0 px-2"
                                        onClick={() => handleEliminarMiembro(miembro._id, miembro.email)}
                                        title="Eliminar miembro"
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} size="xs" /> Eliminar
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </FormularioBase>
    )
}

export default FormularioEditarIniciativa