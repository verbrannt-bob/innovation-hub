import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRocket, faUsers, faDiagramProject } from "@fortawesome/free-solid-svg-icons"
import { obtenerIniciativas, obtenerUsuarios } from '../../api/iniciativasApi'

function Metricas() {
    const [totalIniciativas, setTotalIniciativas] = useState(0)
    const [totalUsuarios, setTotalUsuarios] = useState(0)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        async function cargarMetricas() {
            try {
                // Peticiones simultáneas a la API
                const [iniciativasRes, usuariosRes] = await Promise.all([
                    obtenerIniciativas(),
                    obtenerUsuarios()
                ])

                setTotalIniciativas(iniciativasRes?.length ?? 0)
                setTotalUsuarios(usuariosRes?.length ?? 0)
            } catch (error) {
                console.error("Error al cargar métricas:", error)
            } finally {
                setCargando(false)
            }
        }

        cargarMetricas()
    }, [])

    return (
        <section className="py-4 bg-white border-bottom">
            <div className="container">
                <div className="row text-center g-4">
                    <div className="col-md-4">
                        <div className="p-3">
                            <FontAwesomeIcon icon={faRocket} size="2x" className="mb-2" color="#032057" />
                            <h3 className="fw-bold mb-0" id="statIniciativas">
                                {cargando ? '...' : totalIniciativas}
                            </h3>
                            <p className="text-muted mb-0">Iniciativas Registradas</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 border-start border-end border-md-0">
                            <FontAwesomeIcon icon={faUsers} size="2x" className="mb-2" color="#032057" />
                            <h3 className="fw-bold mb-0">
                                {cargando ? '...' : totalUsuarios}
                            </h3>
                            <p className="text-muted mb-0">Usuarios Registrados</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3">
                            <FontAwesomeIcon icon={faDiagramProject} size="2x" className="mb-2" color="#032057" />
                            <h3 className="fw-bold mb-0">7</h3>
                            <p className="text-muted mb-0">Categorías de Impacto</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Metricas