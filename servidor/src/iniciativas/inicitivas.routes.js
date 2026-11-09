import { Router } from 'express'
import * as controlador from './iniciativas.controller.js'

export const iniciativasRouter = Router()

iniciativasRouter.get('/', controlador.listar)
iniciativasRouter.get("/:id", controlador.buscar)
iniciativasRouter.post('/', controlador.crear)
iniciativasRouter.patch('/:id/nuevoMiembro', controlador.agregarMiembro)
iniciativasRouter.delete('/:id', controlador.eliminar)
iniciativasRouter.get('/miembro/:usuarioId', controlador.buscarPorMiembro)
iniciativasRouter.put('/:id', controlador.actualizar)
iniciativasRouter.delete('/:id/miembro/:miembroId', controlador.eliminarMiembro)
iniciativasRouter.get('/:id/solicitudes', controlador.listarSolicitudes)
iniciativasRouter.post('/:id/solicitudes/:solicitudId/aceptar', controlador.aceptarSolicitud)
iniciativasRouter.delete('/:id/solicitudes/:solicitudId/rechazar', controlador.rechazarSolicitud)