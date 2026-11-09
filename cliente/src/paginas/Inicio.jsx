import Pagina from '../components/layout/Pagina.jsx'
import Hero from '../components/inicio/Hero.jsx'
import Metricas from '../components/inicio/Metricas.jsx'
import QueEs from '../components/inicio/QueEs.jsx'
import Guia from '../components/inicio/Guia.jsx'

function Inicio() {
    return (
        <Pagina >  
            <Hero />
            <Metricas />
            <QueEs />
            <Guia />
        </Pagina>
    )
}

export default Inicio