import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function QueEs() {
    return (
        <section className="py-5">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-12">
                        <h2 className="fw-bold text-primary mb-3">¿Qué es Innovation Hub?</h2>
                        <p className="text-secondary lead fs-6">
                            Es un punto de encuentro digital para estudiantes, docentes y personal institucional donde cualquier persona puede proponer soluciones, expresar necesidades de mejora o plantear desafíos innovadores.
                        </p>
                        <p className="text-secondary">
                            El objetivo principal es eliminar las barreras de comunicación e impulsar el trabajo colaborativo, permitiendo que las propuestas encuentren a las personas con las competencias adecuadas para hacerlas realidad.
                        </p>
                        <div className="d-flex gap-3 mt-4">
                            <div className="d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faCircleCheck} color="#198754"> </FontAwesomeIcon>
                                <span className="fw-semibold text-dark">Acceso Transparente</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faCircleCheck} color="#198754"> </FontAwesomeIcon>
                                <span className="fw-semibold text-dark">Impacto Real</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default QueEs