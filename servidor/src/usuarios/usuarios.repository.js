import { ObjectId } from 'mongodb'
import { obtenerDb } from '../config/db.js'

const coleccion = () => obtenerDb().collection('usuarios')

const CON_DETALLES = [
  // 1. Buscar las competencias correspondientes a los IDs
  {
    $lookup: {
      from: 'competencias', // Nombre exacto de tu colección de competencias
      localField: 'competencias',
      foreignField: '_id',
      as: 'competenciasDetalle'
    }
  },
  // 2. Sobrescribir únicamente el campo 'competencias' manteniendo todos los demás atributos intactos
  {
    $addFields: {
      competencias: {
        $map: {
          input: '$competenciasDetalle',
          as: 'competencia',
          in: {
            _id: '$$competencia._id',
            nombre: '$$competencia.nombre'
          }
        }
      }
    }
  },
  // 3. (Opcional) Eliminar el campo temporal creado por el $lookup
  {
    $project: {
      competenciasDetalle: 0
    }
  }
];

export async function listar() {
  return coleccion()
    .aggregate(CON_DETALLES)
    .sort({ nombre: 1 })
    .toArray()
}

export async function buscarPorId(id) {
  const objectId = typeof id === 'string' ? new ObjectId(id) : id
  const [usuario] = await coleccion()
    .aggregate([{ $match: { _id: objectId } }, ...CON_DETALLES])
    .toArray()

  return usuario ?? null
}

export async function crear(usuario) {
  const resultado = await coleccion().insertOne(usuario)
  return resultado.insertedId
}