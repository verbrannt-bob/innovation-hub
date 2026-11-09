import { useState } from 'react'
import FormularioBase from './FormularioBase'

const TIPOS_MIEMBRO = ['Estudiante', 'Docente', 'Administrativo']

function FormularioRegistroUsuario({ onRegistroExitoso }) {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido1: '',
        apellido2: '',
        email: '',
        password: '',
        confirmarPassword: '',
        tipo: TIPOS_MIEMBRO[0],
        carrera: '',
        aceptaTerminos: false
    })

    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    const [interesInput, setInteresInput] = useState('')
    const [intereses, setIntereses] = useState([])

    // Agregar un interés al presionar Enter o Coma
    const handleInteresKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && interesInput.trim()) {
            e.preventDefault()
            const nuevo = interesInput.trim().replace(',', '')
            if (!intereses.includes(nuevo)) {
                setIntereses([...intereses, nuevo])
            }
            setInteresInput('')
        }
    }

    // Eliminar un interés de la lista
    const eliminarInteres = (index) => {
        setIntereses(intereses.filter((_, i) => i !== index))
    }


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (formData.password !== formData.confirmarPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        if (!formData.aceptaTerminos) {
            setError('Debe aceptar los términos de utilización.')
            return
        }

        setCargando(true)

        try {
            if (onRegistroExitoso) {
                await onRegistroExitoso({
                    ...formData,
                    intereses
                })
            }
        } catch (err) {
            setError(err.message || 'Error al procesar el registro.')
        } finally {
            setCargando(false)
        }
    }

    return (
        <FormularioBase
            titulo="Crear Cuenta de Usuario"
            subtitulo="Complete la información solicitada para unirse al Innovation Hub."
            onSubmit={handleSubmit}
            cargando={cargando}
            errorGlobal={error}
            textoBotonSubmit="Registrarse"
        >
            <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                    <label htmlFor="nombre" className="form-label fw-semibold mb-1">
                        Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="form-control form-control-sm"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="apellido1" className="form-label fw-semibold mb-1">
                        Primer Apellido <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        id="apellido1"
                        name="apellido1"
                        className="form-control form-control-sm"
                        value={formData.apellido1}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="apellido2" className="form-label fw-semibold mb-1">
                        Segundo Apellido (Opcional)
                    </label>
                    <input
                        type="text"
                        id="apellido2"
                        name="apellido2"
                        className="form-control form-control-sm"
                        value={formData.apellido2}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold mb-1">
                    Correo Electrónico <span className="text-danger">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control form-control-sm"
                    placeholder="ejemplo@dominio.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                    <label htmlFor="password" className="form-label fw-semibold mb-1">
                        Contraseña <span className="text-danger">*</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control form-control-sm"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="confirmarPassword" className="form-label fw-semibold mb-1">
                        Confirmación de Contraseña <span className="text-danger">*</span>
                    </label>
                    <input
                        type="password"
                        id="confirmarPassword"
                        name="confirmarPassword"
                        className="form-control form-control-sm"
                        value={formData.confirmarPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                    <label htmlFor="tipo" className="form-label fw-semibold mb-1">
                        Tipo de Miembro <span className="text-danger">*</span>
                    </label>
                    <select
                        id="tipo"
                        name="tipo"
                        className="form-select form-select-sm"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                    >
                        {TIPOS_MIEMBRO.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="carrera" className="form-label fw-semibold mb-1">
                        Carrera o Área Profesional <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        id="carrera"
                        name="carrera"
                        className="form-control form-control-sm"
                        placeholder="Ej. Ingeniería de Software"
                        value={formData.carrera}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="interesInput" className="form-label fw-semibold mb-1">
                    Intereses (Opcional)
                </label>
                <input
                    type="text"
                    id="interesInput"
                    className="form-control form-control-sm"
                    placeholder="Ej. Inteligencia Artificial, Sostenibilidad (Presione Enter para agregar)"
                    value={interesInput}
                    onChange={(e) => setInteresInput(e.target.value)}
                    onKeyDown={handleInteresKeyDown}
                />
                <div className="d-flex flex-wrap gap-1 mt-2 contenedor-etiquetas">
                    {intereses.map((interes, index) => (
                        <span key={index} className="badge bg-secondary d-flex align-items-center gap-1">
                            {interes}
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                style={{ fontSize: '0.5rem' }}
                                onClick={() => eliminarInteres(index)}
                                aria-label="Eliminar interés"
                            />
                        </span>
                    ))}
                </div>
            </div>

            <div className="form-check mb-3">
                <input
                    type="checkbox"
                    id="aceptaTerminos"
                    name="aceptaTerminos"
                    className="form-check-input"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="aceptaTerminos" className="form-check-label small">
                    Acepto los términos de utilización del sistema <span className="text-danger">*</span>
                </label>
            </div>
        </FormularioBase>
    )
}

export default FormularioRegistroUsuario