import Pagina from '../components/layout/Pagina.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass, faPlus } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'

function Inicio() {
    return (
        <Pagina >
            <section className="bg-primary text-white py-5 text-center position-relative overflow-hidden">
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-9">
                            <h1 className="display-4 fw-bold mb-3">Conecta, Innova y Transforma</h1>
                            <p className="lead mb-4">
                                La plataforma institucional diseñada para transformar ideas en proyectos reales, resolver retos académicos y facilitar la colaboración entre toda la comunidad universitaria.
                            </p>
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <NavLink to="/catalogo">
                                    <button className="btn btn-light btn-lg fw-semibold px-4 shadow-sm">
                                        <FontAwesomeIcon icon={faCompass} className='me-2' />Explorar Iniciativas
                                    </button>

                                </NavLink>
                                <NavLink to="/">
                                    <button className="btn btn-outline-light btn-lg fw-semibold px-4">
                                        <FontAwesomeIcon icon={faPlus} className='me-2' />Proponer Idea
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </Pagina>
    )
}

export default Inicio