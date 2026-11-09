import ListaIniciativas from '../components/iniciativas/ListaIniciativas'
import Pagina from '../components/layout/Pagina.jsx'
import { CATEGORIAS, TIPOS, COMPETENCIAS } from '../dataPrueba/iniciativas.js'
import BarraBusqueda from '../components/filtros/BarraBusqueda.jsx'
import Filtro from '../components/filtros/Filtro.jsx'
import { useState, useEffect } from 'react'
import { obtenerIniciativas } from '../api/iniciativasApi.js'
import { useAuth } from '../autenticacion/AuthContext.jsx'

function Catalogo() {

  const [filtroCategoria, setFiltroCategoria] = useState('Todos')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroCompetencia, setFiltroCompetencia] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const { usuario } = useAuth()

  const [iniciativas, setIniciativas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const visibles = iniciativas.filter((iniciativa) => {
    // 1. Filtros de categoría, tipo y competencia
    const coincideCategoria = filtroCategoria === 'Todos' || iniciativa.categoria === filtroCategoria
    const coincideTipo = filtroTipo === 'Todos' || iniciativa.tipo === filtroTipo

    // Si competencias son objetos o strings en la respuesta
    const coincideCompetencia = filtroCompetencia === 'Todos' ||
      iniciativa.competencias?.some(c => (c.nombre ?? c) === filtroCompetencia)

    // 2. Filtro textual sobre título, resumen, descripción y etiquetas
    const termino = busqueda.toLowerCase().trim()
    const coincideTexto = !termino || (
      (iniciativa.titulo?.toLowerCase().includes(termino)) ||
      (iniciativa.resumen?.toLowerCase().includes(termino)) ||
      (iniciativa.descripcion?.toLowerCase().includes(termino)) ||
      (iniciativa.etiquetas?.some(tag => tag.toLowerCase().includes(termino)))
    )

    return coincideCategoria && coincideTipo && coincideCompetencia && coincideTexto
  })

  useEffect(() => {
    async function cargar() {
      try {
        const listaIniciativas = await obtenerIniciativas()
        setIniciativas(listaIniciativas)
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  if (cargando) {
    return (
      <Pagina>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Cargando series…</p>
        </div>
      </Pagina>
    )
  }

  return (
    <Pagina titulo="Iniciativas">
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      <BarraBusqueda>
        <Filtro nombre='Categorías' opciones={CATEGORIAS} valor={filtroCategoria} onCambiar={setFiltroCategoria} />
        <Filtro nombre='Tipos' opciones={TIPOS} valor={filtroTipo} onCambiar={setFiltroTipo} />
        <Filtro nombre='Competencias' opciones={COMPETENCIAS} valor={filtroCompetencia} onCambiar={setFiltroCompetencia} />
      </BarraBusqueda>
      <ListaIniciativas iniciativas={visibles} usuarioActivo={usuario} />
    </Pagina>
  )
}

export default Catalogo
