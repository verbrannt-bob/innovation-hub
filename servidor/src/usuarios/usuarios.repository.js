import { ObjectId } from 'mongodb'
import { obtenerDb } from '../config/db.js'

const coleccion = () => obtenerDb().collection('usuarios')

export async function listar() {
  return coleccion()
    .aggregate()
    .sort({ nombre: 1 })
    .toArray()
}

export async function buscarPorId(id) {
  const objectId = typeof id === 'string' ? new ObjectId(id) : id
  return coleccion().findOne({ _id: objectId })
}

export async function crear(usuario) {
  const resultado = await coleccion().insertOne(usuario)
  return resultado.insertedId
}

export async function buscarPorEmail(email) {
  return coleccion().findOne({ email })
}

// usuarios.repository.js
export async function agregarCompetencia(usuarioId, competenciaId, nombre, nivel) {
  const objectIdUsuario = new ObjectId(usuarioId)
  const objectIdCompetencia = new ObjectId(competenciaId)

  // 1. Eliminar si la competencia ya existía previa para evitar duplicados
  await coleccion().updateOne(
    { _id: objectIdUsuario },
    { $pull: { competencias: { _id: objectIdCompetencia } } }
  )

  // 2. Insertar el objeto completo desnormalizado con _id, nombre y nivel
  const resultado = await coleccion().updateOne(
    { _id: objectIdUsuario },
    { 
      $push: { 
        competencias: { 
          _id: objectIdCompetencia,
          nombre: nombre,
          nivel: nivel 
        } 
      } 
    }
  )

  return resultado.matchedCount === 1
}