import * as servicio from './iniciativas.service.js'
 
export async function listar(req, res) {
  const iniciativas = await servicio.listar()
  res.json(iniciativas)
}

export async function crear(req, res) {
  const iniciativa = await servicio.crear(req.body ?? {})
  res.status(201).json(iniciativa)
}

export async function agregarMiembro(req, res){
  const iniciativa = await servicio.agregarMiembro(req.params.id, req.body ?? {})
  res.json(iniciativa)
}

export async function eliminar(req, res) {
  await servicio.eliminar(req.params.id)
  res.status(204).end()
}

export async function buscar(req, res) {
  const iniciativa = await servicio.buscar(req.params.id)
  res.json(iniciativa)
}

export async function buscarPorMiembro(req, res) {
  const iniciativas = await servicio.buscarPorMiembro(req.params.usuarioId)
  res.json(iniciativas)
}

export async function actualizar(req, res) {
  const iniciativa = await servicio.actualizar(req.params.id, req.body ?? {})
  res.json(iniciativa)
}

export async function eliminarMiembro(req, res) {
  const { id, miembroId } = req.params
  const iniciativa = await servicio.eliminarMiembro(id, miembroId)
  res.json(iniciativa)
}

// iniciativas.controller.js

export async function listarSolicitudes(req, res) {
  const solicitudes = await servicio.listarSolicitudes(req.params.id)
  res.json(solicitudes)
}

export async function aceptarSolicitud(req, res) {
  const { id, solicitudId } = req.params
  const { usuarioId } = req.body ?? {}
  const iniciativaActualizada = await servicio.aceptarSolicitud(id, solicitudId, usuarioId)
  res.json(iniciativaActualizada)
}

export async function rechazarSolicitud(req, res) {
  const { id, solicitudId } = req.params
  await servicio.rechazarSolicitud(id, solicitudId)
  res.status(204).end()
}