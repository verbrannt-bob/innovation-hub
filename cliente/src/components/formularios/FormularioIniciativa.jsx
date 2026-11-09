import { useState, useEffect } from 'react'
import FormularioBase from './FormularioBase'
import { TIPOS, CATEGORIAS, VISIBILIDADES } from '../../dataPrueba/iniciativas' // Importa las constantes globales[cite: 10, 12]
import { obtenerCompetencias } from '../../api/iniciativasApi'

function FormularioIniciativa({ usuarioSesion, onIniciativaCreada }) {
    const [formData, setFormData] = useState({
        titulo: '',
        tipo: TIPOS[0] || 'Idea',
        resumen: '',
        descripcion: '',
        problema: '',
        beneficiados: '',
        categoria: CATEGORIAS[0] || 'Tecnología',
        cantidadIntegrantes: 2,
        visibilidad: VISIBILIDADES[0] || 'Pública',
        competenciasSeleccionadas: []
    })

    const [etiquetaInput, setEtiquetaInput] = useState('')
    const [etiquetas, setEtiquetas] = useState([])
    const [catalogoCompetencias, setCatalogoCompetencias] = useState([])
    
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    // Cargar catálogo de competencias al montar
    useEffect(() => {
        async function cargarComps() {
            try {
                const res = await obtenerCompetencias()
                setCatalogoCompetencias(res ?? [])
            } catch (err) {
                console.error("Error al cargar competencias:", err)
            }
        }
        cargarComps()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Manejo de la lista multi-select de competencias
    const handleCompetenciaToggle = (id) => {
        setFormData(prev => {
            const existe = prev.competenciasSeleccionadas.includes(id)
            const seleccionadas = existe
                ? prev.competenciasSeleccionadas.filter(item => item !== id)
                : [...prev.competenciasSeleccionadas, id]
            return { ...prev, competenciasSeleccionadas: seleccionadas }
        })
    }

    // Manejo de etiquetas (Agregar al presionar Enter o Coma)
    const handleEtiquetaKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && etiquetaInput.trim()) {
            e.preventDefault()
            const nueva = etiquetaInput.trim().replace(',', '')
            if (!etiquetas.includes(nueva)) {
                setEtiquetas([...etiquetas, nueva])
            }
            setEtiquetaInput('')
        }
    }

    const eliminarEtiqueta = (index) => {
        setEtiquetas(etiquetas.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        // Validaciones obligatorias de frontend
        if (!formData.titulo.trim() || formData.titulo.trim().length < 2) {
            setError('El título es obligatorio (mínimo 2 caracteres).')
            return
        }

        if (!formData.resumen.trim() || !formData.descripcion.trim()) {
            setError('El resumen y la descripción detallada son obligatorios.')
            return
        }

        const integrantes = parseInt(formData.cantidadIntegrantes, 10)
        if (isNaN(integrantes) || integrantes <= 0) {
            setError('La cantidad estimada de integrantes debe ser mayor que cero.')
            return
        }

        setCargando(true)

        const fechaActual = new Date().toISOString()

        // Estructura generada para el sistema
        const nuevaIniciativa = {
            titulo: formData.titulo.trim(),
            tipo: formData.tipo,
            resumen: formData.resumen.trim(),
            descripcion: formData.descripcion.trim(),
            problema: formData.problema.trim(),
            beneficiados: formData.beneficiados.trim(),
            categoria: formData.categoria,
            competencias: formData.competenciasSeleccionadas,
            cantidadIntegrantes: integrantes,
            visibilidad: formData.visibilidad,
            etiquetas: etiquetas,
            
            // Campos automáticos del sistema
            propietarioId: usuarioSesion?._id,
            miembros: [usuarioSesion?._id],
            fechaCreacion: fechaActual,
            fechaUltimaModificacion: fechaActual,
            estado: 'Borrador'
        }

        try {
            if (onIniciativaCreada) {
                await onIniciativaCreada(nuevaIniciativa)
            }
        } catch (err) {
            setError(err.message || 'Error al guardar la iniciativa.')
        } finally {
            setCargando(false)
        }
    }

    return (
        <FormularioBase
            titulo="Registrar Nueva Iniciativa"
            subtitulo="Complete los campos obligatorios (*) para publicar o guardar su propuesta."
            onSubmit={handleSubmit}
            cargando={cargando}
            errorGlobal={error}
            textoBotonSubmit="Registrar Iniciativa"
        >
            {/* Título */}
            <div className="mb-3">
                <label htmlFor="titulo" className="form-label fw-semibold mb-1">
                    Título de la iniciativa <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    className="form-control form-control-sm"
                    placeholder="Ej. Sistema de reciclaje inteligente"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="row g-3 mb-3">
                {/* Tipo */}
                <div className="col-12 col-md-4">
                    <label htmlFor="tipo" className="form-label fw-semibold mb-1">
                        Tipo <span className="text-danger">*</span>
                    </label>
                    <select
                        id="tipo"
                        name="tipo"
                        className="form-select form-select-sm"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                    >
                        {TIPOS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                {/* Categoría */}
                <div className="col-12 col-md-4">
                    <label htmlFor="categoria" className="form-label fw-semibold mb-1">
                        Categoría <span className="text-danger">*</span>
                    </label>
                    <select
                        id="categoria"
                        name="categoria"
                        className="form-select form-select-sm"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                    >
                        {CATEGORIAS.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Visibilidad */}
                <div className="col-12 col-md-4">
                    <label htmlFor="visibilidad" className="form-label fw-semibold mb-1">
                        Visibilidad <span className="text-danger">*</span>
                    </label>
                    <select
                        id="visibilidad"
                        name="visibilidad"
                        className="form-select form-select-sm"
                        value={formData.visibilidad}
                        onChange={handleChange}
                        required
                    >
                        {VISIBILIDADES.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Resumen */}
            <div className="mb-3">
                <label htmlFor="resumen" className="form-label fw-semibold mb-1">
                    Resumen corto <span className="text-danger">*</span>
                </label>
                <textarea
                    id="resumen"
                    name="resumen"
                    rows="2"
                    className="form-control form-control-sm"
                    placeholder="Breve síntesis de la iniciativa..."
                    value={formData.resumen}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Descripción Detallada */}
            <div className="mb-3">
                <label htmlFor="descripcion" className="form-label fw-semibold mb-1">
                    Descripción detallada <span className="text-danger">*</span>
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="4"
                    className="form-control form-control-sm"
                    placeholder="Explique a fondo la propuesta, alcances y objetivos..."
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="row g-3 mb-3">
                {/* Problema / Situación */}
                <div className="col-12 col-md-6">
                    <label htmlFor="problema" className="form-label fw-semibold mb-1">
                        Problema o situación identificada
                    </label>
                    <textarea
                        id="problema"
                        name="problema"
                        rows="3"
                        className="form-control form-control-sm"
                        placeholder="¿Qué oportunidad o necesidad atiende?"
                        value={formData.problema}
                        onChange={handleChange}
                    />
                </div>

                {/* Beneficiados */}
                <div className="col-12 col-md-6">
                    <label htmlFor="beneficiados" className="form-label fw-semibold mb-1">
                        Población o usuarios beneficiados
                    </label>
                    <textarea
                        id="beneficiados"
                        name="beneficiados"
                        rows="3"
                        className="form-control form-control-sm"
                        placeholder="¿A quiénes va dirigida la solución?"
                        value={formData.beneficiados}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="row g-3 mb-3">
                {/* Cantidad estimada de integrantes */}
                <div className="col-12 col-md-4">
                    <label htmlFor="cantidadIntegrantes" className="form-label fw-semibold mb-1">
                        Integrantes estimados <span className="text-danger">*</span>
                    </label>
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

                {/* Etiquetas */}
                <div className="col-12 col-md-8">
                    <label htmlFor="etiquetaInput" className="form-label fw-semibold mb-1">
                        Etiquetas (Presione Enter para agregar)
                    </label>
                    <input
                        type="text"
                        id="etiquetaInput"
                        className="form-control form-control-sm"
                        placeholder="Ej. react, iot, medio-ambiente"
                        value={etiquetaInput}
                        onChange={(e) => setEtiquetaInput(e.target.value)}
                        onKeyDown={handleEtiquetaKeyDown}
                    />
                    <div className="d-flex flex-wrap gap-1 mt-2 contenedor-etiquetas">
                        {etiquetas.map((tag, index) => (
                            <span key={index} className="badge bg-secondary d-flex align-items-center gap-1">
                                {tag}
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    style={{ fontSize: '0.5rem' }}
                                    onClick={() => eliminarEtiqueta(index)}
                                    aria-label="Eliminar etiqueta"
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Competencias Requeridas */}
            <div className="mb-3">
                <label className="form-label fw-semibold mb-1">Competencias requeridas</label>
                <div className="card p-2 bg-light border-light d-flex flex-row flex-wrap gap-2">
                    {catalogoCompetencias.map((comp) => {
                        const seleccionada = formData.competenciasSeleccionadas.includes(comp._id)
                        return (
                            <button
                                type="button"
                                key={comp._id}
                                className={`btn btn-sm ${seleccionada ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => handleCompetenciaToggle(comp._id)}
                            >
                                {comp.nombre}
                            </button>
                        )
                    })}
                </div>
            </div>
        </FormularioBase>
    )
}

export default FormularioIniciativa