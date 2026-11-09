import TarjetaIniciativa from "./TarjetaIniciativa"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { NavLink } from "react-router-dom";

function ListaIniciativas({ iniciativas, usuarioActivo }) {
    if (!iniciativas || iniciativas.length === 0) {
        return (
            <>
                <NavLink to="/crear">
                    <button className="col-11 btn btn-outline-primary position-relative p-0" type="button">
                        <FontAwesomeIcon icon={faLightbulb} className='me-2' />
                        Crear una Iniciativa
                    </button>
                </NavLink>
                <div className="alert alert-info mb-0">
                    Ninguna serie coincide con los filtros.
                </div>
            </>
        )
    }

    return (
        <section className="contenedor-tarjetas row d-flex justify-content-around gap-3">
            <NavLink to="/crear">
                <button className="col-11 btn btn-outline-primary position-relative p-0" type="button">
                    <FontAwesomeIcon icon={faLightbulb} className='me-2' />
                    Crear una Iniciativa
                </button>
            </NavLink>

            {iniciativas.map((iniciativa) => (
                <TarjetaIniciativa key={iniciativa._id} iniciativa={iniciativa} usuarioActivo={usuarioActivo} />
            ))}
        </section>
    )
}

export default ListaIniciativas