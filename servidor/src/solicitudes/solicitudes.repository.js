import { ObjectId } from 'mongodb'
import { obtenerDb } from '../config/db.js'

const coleccion = () => obtenerDb().collection('solicitudes')

export async function crear(solicitud) {
  const resultado = await coleccion().insertOne(solicitud)
  return resultado.insertedId
}

export async function buscarPorId(id) {
  const objectId = typeof id === 'string' ? new ObjectId(id) : id
  return coleccion().findOne({ _id: objectId })
}

export async function listarPorIniciativa(iniciativaId) {
  const objectId = typeof iniciativaId === 'string' ? new ObjectId(iniciativaId) : iniciativaId
  return coleccion().find({ iniciativaId: objectId }).toArray()
}