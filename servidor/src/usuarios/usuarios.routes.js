import { Router } from 'express'
import * as controlador from './usuarios.controller.js'

export const usuariosRouter = Router()

usuariosRouter.get('/', controlador.listar)
usuariosRouter.get('/:id', controlador.buscar)
usuariosRouter.post('/', controlador.crear)
usuariosRouter.post('/login', controlador.login)