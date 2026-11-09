function Guia() {
    return (
        <section className="py-5 bg-white border-top border-bottom">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-primary">¿Cómo funciona la plataforma?</h2>
                    <p className="text-muted">Aprende paso a paso cómo publicar una idea o participar en un proyecto existente.</p>
                </div>

                <div className="row g-4">

                    <div className="col-md-6 col-lg-3">
                        <div className="card h-100 border-0 shadow-sm text-center p-3">
                            <div className="card-body">
                                <span className="badge bg-primary text-white rounded-circle p-3 mb-3 fs-5 fw-bold" >1</span>
                                <h5 className="fw-bold mb-2">Publica tu Propuesta</h5>
                                <p className="small text-secondary mb-0">
                                    Completa el formulario definiendo el título, la visibilidad, los objetivos y agregando las competencias clave que necesitas.
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6 col-lg-3">
                        <div className="card h-100 border-0 shadow-sm text-center p-3">
                            <div className="card-body">
                                <span className="badge bg-primary text-white rounded-circle p-3 mb-3 fs-5 fw-bold" >2</span>
                                <h5 className="fw-bold mb-2">Explora el Catálogo</h5>
                                <p className="small text-secondary mb-0">
                                    Usa los filtros por categoría, tipo o palabras clave para descubrir iniciativas de tu interés en tiempo real.
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6 col-lg-3">
                        <div className="card h-100 border-0 shadow-sm text-center p-3">
                            <div className="card-body">
                                <span className="badge bg-primary text-white rounded-circle p-3 mb-3 fs-5 fw-bold" >3</span>
                                <h5 className="fw-bold mb-2">Súmate a un Equipo</h5>
                                <p className="small text-secondary mb-0">
                                    Ingresa al detalle de una propuesta con el estado *Requiere colaboradores* y presiona Unirme a la iniciativa.
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6 col-lg-3">
                        <div className="card h-100 border-0 shadow-sm text-center p-3">
                            <div className="card-body">
                                <span className="badge bg-primary text-white rounded-circle p-3 mb-3 fs-5 fw-bold" >4</span>
                                <h5 className="fw-bold mb-2">Edita y Administra</h5>
                                <p className="small text-secondary mb-0">
                                    Actualiza la información de tus propuestas creadas o elimínalas fácilmente desde el menú contextual.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Guia