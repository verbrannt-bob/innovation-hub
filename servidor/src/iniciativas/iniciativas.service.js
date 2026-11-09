import { ObjectId } from 'mongodb'
import * as repositorio from './iniciativas.repository.js'
import * as usuarios from '../usuarios/usuarios.service.js'
import { validarIniciativa } from './iniciativas.validacion.js'
import { HttpError } from '../utils/HttpError.js'
import { revisarId } from "../utils/revisarId.js"



export async function listar() {
  return repositorio.listar()
}

export async function crear(datos) {
  const errores = validarIniciativa(datos)
  if (Object.keys(errores).length > 0) {
    throw new HttpError(400, 'Datos_INVALIDOS', 'Revise los datos enviados.', errores)
  }

  if (!(await usuarios.existe(datos.propietarioId))) {
    throw new HttpError(400, 'Datos_INVALIDOS', 'Revise los datos enviados.', { propietarioId: 'Este usuario no existe' })
  }

  const hoy = new Date()

  const id = await repositorio.crear({
    titulo: datos.titulo.trim(),
    tipo: datos.tipo,
    resumen: datos.resumen.trim(),
    descripcion: datos.descripcion.trim(),
    problema: datos.problema.trim() || 'No especificado',
    beneficiados: datos.beneficiados.trim() || 'General',
    categoria: datos.categoria,
    competencias: (datos.competencias || []).map(id => new ObjectId(id)),
    cantidadIntegrantes: Number(datos.cantidadIntegrantes),
    visibilidad: datos.visibilidad,
    etiquetas: datos.etiquetas || [],
    estado: datos.estado,
    propietarioId: new ObjectId(datos.propietarioId),
    miembros: [new ObjectId(datos.propietarioId)],
    fechaCreacion: hoy,
    fechaUltimaModificacion: hoy,
    solicitudesIds: []
  })

  return repositorio.buscarPorId(id)
}
export async function buscar(id) {
  revisarId(id)
  const existe = await repositorio.buscarPorId(id)
  if (!existe) {
    throw new HttpError(404, 'NO_ENCONTRADA', 'La iniciativa no existe.')
  }

  return repositorio.buscarPorId(id)
}

export async function agregarMiembro(id, datos) {
  revisarId(id)
  revisarId(datos.id)
  const existe = await repositorio.agregarMiembro(id, datos.id)
  if (!existe) {
    throw new HttpError(404, 'NO_ENCONTRADA', 'La iniciativa no existe.')
  }
  return repositorio.buscarPorId(id)
}

export async function eliminar(id) {
  revisarId(id)
  const existia = await repositorio.eliminar(id)

  if (!existia) {
    throw new HttpError(404, 'NO_ENCONTRADA', 'La iniciativa no existe')
  }
}

export async function buscarPorMiembro(usuarioId) {
  revisarId(usuarioId)
  return repositorio.buscarPorMiembro(usuarioId)
}

export async function actualizar(id, datos) {
  revisarId(id)

  const errores = validarIniciativa(datos)
  if (Object.keys(errores).length > 0) {
    throw new HttpError(400, 'Datos_INVALIDOS', 'Revise los datos enviados.', errores)
  }

  const hoy = new Date()

  // Se actualizan los campos permitidos manteniendo el propietario intacto
  const actualizacion = {
    titulo: datos.titulo.trim(),
    tipo: datos.tipo,
    resumen: datos.resumen.trim(),
    descripcion: datos.descripcion.trim(),
    problema: datos.problema.trim() || 'No especificado',
    beneficiados: datos.beneficiados.trim() || 'General',
    categoria: datos.categoria,
    competencias: (datos.competencias || []).map(cId => new ObjectId(cId)),
    cantidadIntegrantes: Number(datos.cantidadIntegrantes),
    visibilidad: datos.visibilidad,
    etiquetas: datos.etiquetas || [],
    estado: datos.estado,
    fechaUltimaModificacion: hoy
  }

  const actualizado = await repositorio.actualizar(id, actualizacion)
  if (!actualizado) {
    throw new HttpError(404, 'NO_ENCONTRADA', 'La iniciativa no existe.')
  }

  return repositorio.buscarPorId(id)
}

export async function eliminarMiembro(id, miembroId) {
  revisarId(id)
  revisarId(miembroId)

  const modificado = await repositorio.eliminarMiembro(id, miembroId)
  if (!modificado) {
    throw new HttpError(404, 'NO_ENCONTRADA', 'No se pudo eliminar el miembro de la iniciativa.')
  }

  return repositorio.buscarPorId(id)
}

// iniciativas.service.js

export async function listarSolicitudes(iniciativaId) {
  revisarId(iniciativaId)
  return repositorio.obtenerSolicitudesPorIniciativa(iniciativaId)
}

export async function aceptarSolicitud(iniciativaId, solicitudId, usuarioId) {
  revisarId(iniciativaId)
  revisarId(solicitudId)
  revisarId(usuarioId)

  // 1. Agregar el usuario a la lista de miembros de la iniciativa
  await repositorio.agregarMiembro(iniciativaId, usuarioId)

  // 2. Eliminar la solicitud
  await repositorio.eliminarSolicitud(solicitudId, iniciativaId)

  return repositorio.buscarPorId(iniciativaId)
}

export async function rechazarSolicitud(iniciativaId, solicitudId) {
  revisarId(iniciativaId)
  revisarId(solicitudId)

  // Simplemente eliminar la solicitud
  await repositorio.eliminarSolicitud(solicitudId, iniciativaId)
  return true
}