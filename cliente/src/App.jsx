import { createBrowserRouter, RouterProvider } from "react-router"

import Inicio from './paginas/Inicio.jsx'
import Catalogo from './paginas/Catalogo.jsx'
import Iniciativa from './paginas/Iniciativa.jsx'
import Perfil from './paginas/Perfil.jsx'
import SolicitudIniciativa from "./paginas/SolicitudIniciativa.jsx"
import NoEncontrado from "./paginas/NoEncontrado.jsx"
import CrearIniciativa from "./paginas/CrearIniciativa.jsx"
import Registro from "./paginas/Registro.jsx"
import EditarIniciativa from "./paginas/EditarIniciativa.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Inicio />,
    errorElement: <NoEncontrado />
  }, 
  {
    path: "/catalogo",
    element: <Catalogo />
  },
  {
    path:"/iniciativa/:id",
    element: <Iniciativa />
  },
  {
    path:"/perfil/:id",
    element: <Perfil />
  },
  {
    path:"/solicitud/:id",
    element: <SolicitudIniciativa />
  },
  {
    path:"/crear",
    element: <CrearIniciativa />
  },
  {
    path:"/registro",
    element: <Registro />
  },
  {
    path:"/editar/:id",
    element: <EditarIniciativa />
  }

])

function App() {
  return (
    <RouterProvider router={router} />
  )
}
 export default App


