import { useState } from 'react'

function FormularioLogin({ onLoginSubmit, error }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (onLoginSubmit) {
            onLoginSubmit(email, password)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
            <h6 className="fw-bold m-0 text-center">Iniciar Sesión</h6>
            {error && <small className="text-danger text-center">{error}</small>}
            <div>
                <input 
                    type="email" 
                    className="form-control form-control-sm" 
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
            </div>
            <div>
                <input 
                    type="password" 
                    className="form-control form-control-sm" 
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>
            <button type="submit" className="btn btn-primary btn-sm w-100 mt-1">
                Ingresar
            </button>
        </form>
    )
}

export default FormularioLogin