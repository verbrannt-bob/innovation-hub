import FormularioSolicitudIniciativa from '../components/formularios/FormularioSolicitudIniciativa.jsx'
import Pagina from '../components/layout/Pagina.jsx'
import { useParams } from 'react-router-dom'
import { useAuth } from '../autenticacion/AuthContext.jsx'

function SolicitudIniciativa(){
    const { id } = useParams()
    const { usuario: usuarioSesion } = useAuth()

    async function enviarSolicitud(){

    }

    return(
        <Pagina >
            <FormularioSolicitudIniciativa iniciativaId={id} usuarioSesion={usuarioSesion} onSolicitudEnviada={enviarSolicitud}/>
        </Pagina>
    )
}

export default SolicitudIniciativa