// usuarios.service.js
import { ObjectId } from 'mongodb'
import * as repositorio from './usuarios.repository.js'
import { validarUsuario } from './usuarios.validacion.js'
import { HttpError } from '../utils/HttpError.js'
import { revisarId } from "../utils/revisarId.js"
 
export async function listar() {
  return repositorio.listar()
}

export async function existe(id) {
  const usuario = await repositorio.buscarPorId(id)
  return usuario !== null
}

export async function crear(datos) {
  const errores = validarUsuario(datos)
  if (Object.keys(errores).length > 0) {
    throw new HttpError(400, 'DATOS_INVALIDOS', 'Revise los datos enviados.', errores)
  }

  // Verificar unicidad de correo
  const usuarioExistente = await repositorio.buscarPorEmail(datos.email.trim())
  if (usuarioExistente) {
    throw new HttpError(400, 'EMAIL_DUPLICADO', 'El correo electrónico ya se encuentra registrado.', {
      email: 'El correo electrónico ya está en uso.'
    })
  }

  const hoy = new Date()

  const id = await repositorio.crear({
    nombre: datos.nombre.trim(),
    apellido1: datos.apellido1.trim(),
    apellido2: datos.apellido2 ? datos.apellido2.trim() : null,
    email: datos.email.trim().toLowerCase(),
    password: datos.password,
    tipo: datos.tipo, 
    carrera: datos.carrera.trim(), 
    fechaRegistro: hoy,
    estado: "Activa",
    disponibilidad: "",
    competencias: [],
    descripcion: datos.descripcion ? datos.descripcion.trim() : "",
    intereses: Array.isArray(datos.intereses) ? datos.intereses : []
  })

  return repositorio.buscarPorId(id)
}

export async function buscar(id) {
  revisarId(id)
  const usuario = await repositorio.buscarPorId(id)
  if(!usuario) {
    throw new HttpError(404, 'NO_ENCONTRADA', 'El usuario no existe.')
  }
  return usuario
}

export async function login(email, password) {
  if (!email || !password) {
    throw new HttpError(400, 'DATOS_INCOMPLETOS', 'Ingrese correo y contraseña.')
  }

  const usuario = await repositorio.buscarPorEmail(email.trim().toLowerCase())
  
  if (!usuario || usuario.password !== password) {
    throw new HttpError(401, 'CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos.')
  }

  const { password: _, ...usuarioSinPassword } = usuario
  return usuarioSinPassword
}

export async function agregarCompetencia(usuarioId, competenciaId, nombre, nivel) {
  revisarId(usuarioId)
  revisarId(competenciaId)

  if (!nombre || !nivel) {
    throw new HttpError(400, 'DATOS_INVALIDOS', 'El nombre y nivel de la competencia son requeridos.')
  }

  const actualizado = await repositorio.agregarCompetencia(usuarioId, competenciaId, nombre, nivel)
  if (!actualizado) {
    throw new HttpError(404, 'NO_ENCONTRADA', 'El usuario no existe.')
  }

  return repositorio.buscarPorId(usuarioId)
}