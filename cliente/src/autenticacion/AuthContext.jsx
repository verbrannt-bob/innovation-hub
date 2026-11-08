import { createContext, useContext, useState, useEffect } from 'react'
import { loginApi } from '../api/iniciativasApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        // Cargar sesión persistente al iniciar la app
        const usuarioGuardado = localStorage.getItem('usuario_activo')
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado))
        }
        setCargando(false)
    }, [])

    const login = async (email, password) => {
        const usuarioLogueado = await loginApi({ email, password })
        setUsuario(usuarioLogueado)
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioLogueado))
        return usuarioLogueado
    }

    const logout = () => {
        setUsuario(null)
        localStorage.removeItem('usuario_activo')
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {!cargando && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)