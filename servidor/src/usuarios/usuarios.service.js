import { ObjectId } from 'mongodb'
import * as repositorio from './usuarios.repository.js'
import { validarUsuario } from './usuarios.validacion.js'
import { HttpError } from '../utils/HttpError.js'
import { revisarId } from "../utils/revisarId.js"
 
export async function listar() {
  return repositorio.listar()
}

export async function existe(id) {
  const usuario = await repositorio.buscarPorId(id, true)
  return usuario !== null
}

export async function crear(datos) {
  const errores =  validarUsuario(datos)
  if (Object.keys(errores).length > 0) {
    throw new HttpError(400, 'DATOS_INVALIDOS',
      'Revise los datos enviados.', errores)
  }

  const id = await repositorio.crear({
    nombre: datos.nombre,
    apellido1: datos.apellido1,
    apellido2: datos.apellido2 ?? null,
    email: datos.email,
    password: datos.password,
    tipo:  datos.tipo, 
    carrera: datos.carrera, 
    fechaRegistro: new Date(),
    estado: "Activa",
    disponibilidad: "",
    competencias: [],
    descripcion: datos.descripcion,
    intereses: datos.intereses
  })

  return repositorio.buscarPorId(id)
}

export async function buscar(id) {
  revisarId(id)
  const existe = await repositorio.buscarPorId(id)
    if(!existe) {
      throw new HttpError(404, 'NO_ENCONTRADA', 'El usuario no existe.')
    }
  
    return repositorio.buscarPorId(id)
}



export async function login(email, password) {
  if (!email || !password) {
    throw new HttpError(400, 'DATOS_INCOMPLETOS', 'Ingrese correo y contraseña.')
  }

  const usuario = await repositorio.buscarPorEmail(email)
  
  // Validar si existe el usuario y coincide la contraseña
  if (!usuario || usuario.password !== password) {
    throw new HttpError(401, 'CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos.')
  }

  // No enviar la contraseña al cliente por seguridad
  const { password: _, ...usuarioSinPassword } = usuario
  return usuarioSinPassword
}


// usuarios.service.js
export async function agregarCompetencia(usuarioId, competenciaId, nombre, nivel) {
  revisarId(usuarioId)
  revisarId(competenciaId)

  if (!nombre || typeof nombre !== 'string') {
    throw new HttpError(400, 'DATOS_INVALIDOS', 'Se requiere el nombre de la competencia.')
  }

  if (!nivel || typeof nivel !== 'string') {
    throw new HttpError(400, 'DATOS_INVALIDOS', 'Debe seleccionar un nivel válido.')
  }

  const ok = await repositorio.agregarCompetencia(usuarioId, competenciaId, nombre, nivel)
  if (!ok) {
    throw new HttpError(404, 'NO_ENCONTRADA', 'El usuario no existe.')
  }
  
  return repositorio.buscarPorId(usuarioId)
}