import FormularioSolicitudIniciativa from '../components/formularios/FormularioSolicitudIniciativa.jsx'
import Pagina from '../components/layout/Pagina.jsx'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../autenticacion/AuthContext.jsx'
import { crearSolicitud } from '../api/iniciativasApi.js'

function SolicitudIniciativa(){
    const { id } = useParams()
    const { usuario: usuarioSesion } = useAuth()
    const navigate = useNavigate()

    async function enviarSolicitud(nuevaSolicitud){
        await crearSolicitud(nuevaSolicitud)
        navigate(`/iniciativa/${id}`)
    }

    return(
        <Pagina>
            <FormularioSolicitudIniciativa 
                iniciativaId={id} 
                usuarioSesion={usuarioSesion} 
                onSolicitudEnviada={enviarSolicitud}
            />
        </Pagina>
    )
}

export default SolicitudIniciativa