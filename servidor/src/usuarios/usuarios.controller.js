import * as servicio from './usuarios.service.js'
 
export async function listar(req, res) {
  const usuarios = await servicio.listar()
  res.json(usuarios)
}

export async function crear(req, res) {
  const usuario = await servicio.crear(req.body ?? {})
  res.status(201).json(usuario)
}

export async function  buscar(req, res) {
  const usuario = await servicio.buscar(req.params.id)
  res.json(usuario)
}

export async function login(req, res) {
  const { email, password } = req.body ?? {}
  const usuario = await servicio.login(email, password)
  res.json(usuario)
}

export async function agregarCompetencia(req, res) {
  const { id } = req.params
  const { competenciaId, nombre, nivel } = req.body ?? {}
  
  const usuarioActualizado = await servicio.agregarCompetencia(id, competenciaId, nombre, nivel)
  res.json(usuarioActualizado)
}