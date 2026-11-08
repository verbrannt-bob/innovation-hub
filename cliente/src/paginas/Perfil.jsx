import Pagina from '../components/layout/Pagina.jsx'
import InfoPerfil from '../components/usuarios/InfoPerfil.jsx'
import Panel from '../components/comunes/Panel.jsx'
import { useParams } from "react-router-dom";

function Perfil() {
    const { id } = useParams()

    return (
        <Pagina>
            <Panel>
                <InfoPerfil id={id} />
            </Panel>
        </Pagina>
    )
}

export default Perfil