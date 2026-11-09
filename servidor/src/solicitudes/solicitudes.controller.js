// solicitudes.controller.js
import * as servicio from './solicitudes.service.js'

export async function crear(req, res) {
  const solicitud = await servicio.crear(req.body ?? {})
  res.status(201).json(solicitud)
}