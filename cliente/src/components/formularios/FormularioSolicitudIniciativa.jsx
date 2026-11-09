import { useState } from 'react'
import FormularioBase from './FormularioBase'
import { COMPETENCIAS, ROLES_DISPONIBLES, DISPONIBILIDADES } from '../../dataPrueba/iniciativas.js'



function FormularioSolicitudIniciativa({ iniciativaId, usuarioSesion, onSolicitudEnviada }) {
    const [formData, setFormData] = useState({
        mensajePresentacion: '',
        competenciaAportar: COMPETENCIAS[0] || '',
        rolDesempenar: ROLES_DISPONIBLES[0],
        disponibilidad: DISPONIBILIDADES[2]
    })

    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!formData.mensajePresentacion.trim()) {
            setError('Por favor escriba un mensaje de presentación.')
            return
        }

        setCargando(true)

        const nuevaSolicitud = {
            iniciativaId: iniciativaId,
            usuarioSolicitanteId: usuarioSesion?._id,
            mensajePresentacion: formData.mensajePresentacion.trim(),
            competenciaAportar: formData.competenciaAportar,
            rolDesempenar: formData.rolDesempenar,
            disponibilidad: formData.disponibilidad,
            fechaSolicitud: new Date().toISOString(),
            estado: 'Pendiente'
        }

        try {
            if (onSolicitudEnviada) {
                onSolicitudEnviada(nuevaSolicitud)
            }
        } catch (err) {
            setError(err.message || 'Error al procesar la solicitud.')
        } finally {
            setCargando(false)
        }
    }

    return (
        <FormularioBase
            titulo="Unirse a la Iniciativa"
            subtitulo="Envía tu solicitud al propietario de la iniciativa especificando tu aporte."
            onSubmit={handleSubmit}
            cargando={cargando}
            errorGlobal={error}
            textoBotonSubmit="Enviar Solicitud"
        >
            <div className="mb-3">
                <label className="form-label fw-semibold mb-1">Solicitante</label>
                <input 
                    type="text" 
                    className="form-control form-control-sm campo-deshabilitado" 
                    value={`${usuarioSesion?.nombre ?? ''} ${usuarioSesion?.apellido1 ?? ''} (${usuarioSesion?.email ?? ''})`}
                    disabled 
                />
            </div>

            <div className="mb-3">
                <label htmlFor="mensajePresentacion" className="form-label fw-semibold mb-1">
                    Mensaje de Presentación <span className="text-danger">*</span>
                </label>
                <textarea
                    id="mensajePresentacion"
                    name="mensajePresentacion"
                    rows="3"
                    className="form-control form-control-sm"
                    placeholder="Explica brevemente por qué deseas unirte y cómo puedes contribuir..."
                    value={formData.mensajePresentacion}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                    <label htmlFor="competenciaAportar" className="form-label fw-semibold mb-1">
                        Competencia a aportar
                    </label>
                    <select
                        id="competenciaAportar"
                        name="competenciaAportar"
                        className="form-select form-select-sm"
                        value={formData.competenciaAportar}
                        onChange={handleChange}
                    >
                        {COMPETENCIAS.map((comp, idx) => (
                            <option key={idx} value={comp}>
                                {comp}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-6">
                    <label htmlFor="rolDesempenar" className="form-label fw-semibold mb-1">
                        Rol a desempeñar
                    </label>
                    <select
                        id="rolDesempenar"
                        name="rolDesempenar"
                        className="form-select form-select-sm"
                        value={formData.rolDesempenar}
                        onChange={handleChange}
                    >
                        {ROLES_DISPONIBLES.map((rol, idx) => (
                            <option key={idx} value={rol}>
                                {rol}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="disponibilidad" className="form-label fw-semibold mb-1">
                    Disponibilidad de tiempo
                </label>
                <select
                    id="disponibilidad"
                    name="disponibilidad"
                    className="form-select form-select-sm"
                    value={formData.disponibilidad}
                    onChange={handleChange}
                >
                    {DISPONIBILIDADES.map((disp, idx) => (
                        <option key={idx} value={disp}>
                            {disp}
                        </option>
                    ))}
                </select>
            </div>
        </FormularioBase>
    )
}

export default FormularioSolicitudIniciativa