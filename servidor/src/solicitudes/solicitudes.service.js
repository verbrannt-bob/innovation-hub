// solicitudes.service.js
import { ObjectId } from 'mongodb'
import * as repositorioSolicitudes from './solicitudes.repository.js'
import * as repositorioIniciativas from '../iniciativas/iniciativas.repository.js'
import { HttpError } from '../utils/HttpError.js'
import { revisarId } from '../utils/revisarId.js'

export async function crear(datos) {
  revisarId(datos.iniciativaId)
  revisarId(datos.usuarioSolicitanteId)

  // Verificar que la iniciativa exista
  const iniciativa = await repositorioIniciativas.buscarPorId(datos.iniciativaId)
  if (!iniciativa) {
    throw new HttpError(404, 'INICIATIVA_NO_ENCONTRADA', 'La iniciativa no existe.')
  }

  const hoy = new Date()

  // Guardar la nueva solicitud
  const solicitudId = await repositorioSolicitudes.crear({
    iniciativaId: new ObjectId(datos.iniciativaId),
    usuarioSolicitanteId: new ObjectId(datos.usuarioSolicitanteId),
    mensajePresentacion: datos.mensajePresentacion.trim(),
    competenciaAportar: datos.competenciaAportar,
    rolDesempenar: datos.rolDesempenar,
    disponibilidad: datos.disponibilidad,
    fechaSolicitud: hoy,
    estado: 'Pendiente'
  })

  // Asociar la solicitud a la iniciativa
  await repositorioIniciativas.agregarSolicitudId(datos.iniciativaId, solicitudId)

  return repositorioSolicitudes.buscarPorId(solicitudId)
}