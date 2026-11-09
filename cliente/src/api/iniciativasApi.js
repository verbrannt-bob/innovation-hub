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

export function crearSolicitud(datosSolicitud) {
    return pedir('/solicitudes', 'POST', datosSolicitud)
}

// export function crearIniciativa(datosIniciativa) {
//     return pedir('/iniciativas', 'POST', datosIniciativa)
// }

// iniciativasApi.js

export async function crearIniciativa(nuevaIniciativa) {
    const respuesta = await fetch(`${URL_API}/iniciativas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaIniciativa)
    })

    const cuerpo = await respuesta.json()

    if (!respuesta.ok) {
        // Muestra en la consola de la ventana del navegador exactamente qué falló
        console.error("Detalles del error 400 devueltos por el Backend:", cuerpo)
        
        // Si el backend responde con un objeto de errores por campo, los unimos en el mensaje
        const detalleErrores = cuerpo.error?.detalles 
            ? Object.values(cuerpo.error.detalles).join(' ')
            : (cuerpo.error?.mensaje || 'Error al crear la iniciativa')
            
        throw new Error(detalleErrores)
    }

    return cuerpo
}

export function registrarUsuario(datosUsuario) {
    return pedir('/usuarios', 'POST', datosUsuario)
}

export function eliminarIniciativa(id) {
    return pedir(`/iniciativas/${id}`, 'DELETE')
}

export function actualizarIniciativa(id, datos) {
    return pedir(`/iniciativas/${id}`, 'PUT', datos)
}

export function eliminarMiembroIniciativa(id, miembroId) {
    return pedir(`/iniciativas/${id}/miembro/${miembroId}`, 'DELETE')
}

export function obtenerSolicitudesIniciativa(iniciativaId) {
    return pedir(`/iniciativas/${iniciativaId}/solicitudes`, 'GET')
}

export function aceptarSolicitudApi(iniciativaId, solicitudId, usuarioId) {
    return pedir(`/iniciativas/${iniciativaId}/solicitudes/${solicitudId}/aceptar`, 'POST', { usuarioId })
}

export function rechazarSolicitudApi(iniciativaId, solicitudId) {
    return pedir(`/iniciativas/${iniciativaId}/solicitudes/${solicitudId}/rechazar`, 'DELETE')
}