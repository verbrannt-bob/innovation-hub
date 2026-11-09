import FormularioRegistroUsuario from '../components/formularios/FormularioRegistroUsuario.jsx'
import Pagina from '../components/layout/Pagina.jsx'
import { useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../api/iniciativasApi.js'
import { useAuth } from '../autenticacion/AuthContext.jsx'

function Registro() {
    const navigate = useNavigate()
    const { login } = useAuth()

    async function handleRegistroExitoso(datosRegistro) {
        // Enviar al backend para guardar en BD
        await registrarUsuario(datosRegistro)
        // Autenticar automáticamente al usuario tras crearse la cuenta
        await login(datosRegistro.email, datosRegistro.password)
        // Redirigir a la página principal
        navigate('/')
    }

    return (
        <Pagina>
            <FormularioRegistroUsuario onRegistroExitoso={handleRegistroExitoso} />
        </Pagina>
    )
}

export default Registro