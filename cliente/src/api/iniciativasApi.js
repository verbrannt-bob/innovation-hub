const URL_API = import.meta.env.VITE_API_URL


async function pedir(ruta, metodo = 'GET', datos) {
    const opciones = { method: metodo }
    if (datos !== undefined) {
        opciones.headers = { 'Content-Type': 'application/json' }
        opciones.body = JSON.stringify(datos)
    }

    let respuesta
    try {
        respuesta = await fetch(URL_API + ruta, opciones)
    } catch {
        throw new Error('No se pudo conectar con el API. ¿Está encendido el servidor?')
    }

    if (respuesta.status === 204) {
        return null
    }


    const cuerpo = await respuesta.json()
    if (!respuesta.ok) {
        const error = new Error(cuerpo.error.mensaje)
        error.detalles = cuerpo.error.detalles
        throw error
    }
    return cuerpo
}


export function obtenerIniciativas() {
    return pedir('/iniciativas')
}

export function obtenerIniciativaId(id) {
    return pedir('/iniciativas/' + id)
}

export function obtenerUsuarios() {
    return pedir('/usuarios')
}

export function obtenerUsuarioId(id) {
    return pedir('/usuarios/' + id)
}

export function loginApi(credenciales) {
    return pedir('/usuarios/login', 'POST', credenciales)
}

export function obtenerIniciativasPorMiembro(usuarioId) {
    return pedir('/iniciativas/miembro/' + usuarioId)
}

export function obtenerCompetencias() {
    return pedir('/competencias')
}

export function agregarCompetenciaAUsuario(usuarioId, competenciaId, nombre, nivel) {
    return pedir(`/usuarios/${usuarioId}/competencia`, 'PATCH', { competenciaId, nombre, nivel })
}