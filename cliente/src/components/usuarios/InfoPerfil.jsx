import { useState, useEffect } from 'react'
import fotoPerfilDefecto from '../../assets/fotoPerfilDefecto.jpg'
import { obtenerUsuarioId } from '../../api/iniciativasApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faBrain } from "@fortawesome/free-solid-svg-icons"

function InfoPerfil(id) {
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function cargar(){
            try {
                const resultado = await obtenerUsuarioId(id)
                setUsuario(resultado)
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [])


    return (
        <section className="row d-flex justify-content-start align-items-top perfil-usuario">
            <img src={fotoPerfilDefecto} alt="foto-perfil" className="col-6 col-sm-4 col-md-3 col-lg-2" />
            <div className="col-6 col-lg-10">
                <h2 className="nombre">{usuario.nombre + usuario.apellido1 + usuario.apellido2}</h2>
                <p>{usuario.tipo}</p>
                <div className="d-flex flex-column justify-content-around">
                    <h3 className="etiqueta">Carrera</h3>
                    <p>{usuario.carrera}</p>
                </div>
                <div>
                    <h3 className="etiqueta">Descripción Personal</h3>
                    <p>{usuario.descripcion}</p>
                </div>
            </div>
            <div className="col-12 col-md-6">
                <h3 className="etiqueta">Competencias</h3>
                <div>
                    {usuario.competencias?.map((competencia) =>{
                        <p class="card m-0 mt-1 p-1 d-flex flex-row align-items-center gap-3 tarjeta-perfil" key={competencia._id}><FontAwesomeIcon icon={faCheck} size="xs" color="#00a896"/><span>{competencia.nombre}</span></p>
                    })}
                </div>
            </div>
            <div className="col-12 col-md-6">
                <h3 className="etiqueta">Intereses</h3>
                <div>
                    {usuario.intereses?.map((interes, index) => {
                        <p class="card m-0 mt-1 p-1 d-flex flex-row align-items-center gap-3 tarjeta-perfil" key={index}><FontAwesomeIcon icon={faBrain} size="xs" color="#00a896"/><span>{interes}</span></p>
                    })}
                </div>
            </div>
            <div className="col-12">
                <h3 className="etiqueta">Proyectos</h3>
                <div></div>
            </div>
        </section>
    )
}