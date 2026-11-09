function FormularioBase({ 
    titulo, 
    subtitulo, 
    onSubmit, 
    cargando = false, 
    errorGlobal = null, 
    textoBotonSubmit = 'Guardar', 
    children 
}) {
    return (
        <div className="card shadow-sm border-0 mx-auto tarjeta-formulario">
            <div className="card-body p-4">
                {titulo && <h2 className="card-title h4 fw-bold text-primary mb-1">{titulo}</h2>}
                {subtitulo && <p className="text-muted small mb-4">{subtitulo}</p>}

                {errorGlobal && (
                    <div className="alert alert-danger py-2 small mb-3" role="alert">
                        {errorGlobal}
                    </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                    {children}

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                        <button 
                            type="submit" 
                            className="btn btn-primary px-4 d-flex align-items-center gap-2 boton-accion"
                            disabled={cargando}
                        >
                            {cargando ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                textoBotonSubmit
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormularioBase