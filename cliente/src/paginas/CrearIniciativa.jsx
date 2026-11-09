// CrearIniciativa.jsx
import FormularioIniciativa from '../components/formularios/FormularioIniciativa.jsx'
import Pagina from '../components/layout/Pagina.jsx'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../autenticacion/AuthContext.jsx'
import { crearIniciativa } from '../api/iniciativasApi.js'

function CrearIniciativa() {
    const { usuario: usuarioSesion } = useAuth()
    const navigate = useNavigate()

    async function handleIniciativaCreada(nuevaIniciativa) {
        // Enviar al backend
        const iniciativaCreada = await crearIniciativa(nuevaIniciativa)
        // Redirigir a la vista de detalle de la iniciativa recién registrada
        navigate(`/iniciativa/${iniciativaCreada._id}`)
    }

    return (
        <Pagina>
            <FormularioIniciativa
                usuarioSesion={usuarioSesion}
                onIniciativaCreada={handleIniciativaCreada}
            />
        </Pagina>
    )
}

export default CrearIniciativa