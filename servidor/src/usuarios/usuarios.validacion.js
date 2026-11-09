// usuarios.validacion.js
import { ObjectId } from 'mongodb'

export const TIPOS = ['Estudiante', 'Docente', 'Administrativo']

export function validarUsuario(datos) {
    const errores = {}

    if (typeof datos.nombre !== 'string' || datos.nombre.trim().length < 2) {
        errores.nombre = 'Escriba un nombre de al menos 2 caracteres.'
    }

    if (typeof datos.apellido1 !== 'string' || datos.apellido1.trim().length < 2) {
        errores.apellido1 = 'Escriba un primer apellido de al menos 2 caracteres.'
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (typeof datos.email !== 'string' || !regexEmail.test(datos.email)) {
        errores.email = 'Escriba un email válido.'
    }

    if (typeof datos.password !== 'string' || datos.password.trim().length < 4) {
        errores.password = 'La contraseña debe tener al menos 4 caracteres.'
    }

    if (datos.password !== datos.confirmarPassword) {
        errores.confirmarPassword = 'Las contraseñas no coinciden.'
    }

    if (!TIPOS.includes(datos.tipo)) {
        errores.tipo = 'Elija un tipo de miembro válido.'
    }

    if (typeof datos.carrera !== 'string' || datos.carrera.trim().length < 2) {
        errores.carrera = 'Escriba una carrera o área profesional de al menos 2 caracteres.'
    }

    if (!datos.aceptaTerminos) {
        errores.aceptaTerminos = 'Debe aceptar los términos de utilización.'
    }

    return errores
}