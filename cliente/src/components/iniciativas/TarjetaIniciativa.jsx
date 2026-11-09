import { NavLink } from 'react-router-dom'

function TarjetaIniciativa({ iniciativa, usuarioActivo }) {
    if (!iniciativa) return null

    const emailUsuario = usuarioActivo?.email ?? ''
    const emailPropietario = iniciativa.propietario?.email ?? ''

    // Si la iniciativa es privada y el usuario no es el propietario, no se muestra
    if (iniciativa.visibilidad === "Privada" && emailUsuario !== emailPropietario) return null

    if (iniciativa.visibilidad === "Restringida" && emailUsuario !== emailPropietario) {
        return (
            <article className="col-11 col-sm-5 col-lg-3 p-2 tarjeta-iniciativa d-flex flex-column gap-1 justify-content-between">
                <div className="d-flex justify-content-between gap-3 encabezado-tarjeta">
                    <h3>{iniciativa.titulo}</h3>
                    <p>{iniciativa.tipo}</p>
                </div>
                <div className="resumen">
                    <p>{iniciativa.resumen}</p>
                </div>
                <div className="categoria d-flex justify-content-between">
                    <p className="etiqueta">Categoria: </p>
                    <p>{iniciativa.categoria}</p>
                </div>
                <div className="competencias d-flex flex-column">
                    <p className="etiqueta">Competencias Requeridas: </p>
                    {iniciativa.competencias?.map((competencia, index) => (
                        <p key={competencia._id || index}>{competencia.nombre || competencia}</p>
                    ))}
                </div>
            </article>
        )
    }

    if (
        (iniciativa.visibilidad === "Institucional" && emailUsuario.endsWith("@ucenfotec.ac.cr")) || 
        iniciativa.visibilidad === "Pública" || 
        emailUsuario === emailPropietario
    ) {
        // Nombre del propietario seguro (evita undefined/null)
        const nombrePropietario = iniciativa.propietario 
            ? `${iniciativa.propietario.nombre || ''} ${iniciativa.propietario.apellido1 || ''}`.trim()
            : 'Sin propietario'

        return (
            <article className="col-11 col-sm-5 col-lg-3 p-2 tarjeta-iniciativa d-flex flex-column gap-1 justify-content-between">
                <div className="d-flex justify-content-between gap-3 encabezado-tarjeta">
                    <h3>{iniciativa.titulo}</h3>
                    <p>{iniciativa.tipo}</p>
                </div>
                <div className="resumen">
                    <p>{iniciativa.resumen}</p>
                </div>
                <div className="categoria d-flex justify-content-between">
                    <p className="etiqueta">Categoria: </p>
                    <p>{iniciativa.categoria}</p>
                </div>
                <div className="propietario d-flex justify-content-between">
                    <p className="etiqueta">Propietario: </p>
                    <p>{nombrePropietario}</p>
                </div>
                <div className="estado d-flex justify-content-between">
                    <p className="etiqueta">Estado:</p>
                    <p>{iniciativa.estado}</p>
                </div>
                <div className="competencias d-flex flex-column">
                    <p className="etiqueta">Competencias Requeridas: </p>
                    {iniciativa.competencias?.map((competencia, index) => (
                        <p key={competencia._id || index}>{competencia.nombre || competencia}</p>
                    ))}
                </div>
                <NavLink to={`/iniciativa/${iniciativa._id}`} className="btn btn-primary btn-detalles-iniciativa">Detalle</NavLink>
            </article>
        )
    } else {
        return null
    }
}

export default TarjetaIniciativa