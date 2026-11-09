// solicitudes.routes.js
import { Router } from 'express'
import * as controlador from './solicitudes.controller.js'

export const solicitudesRouter = Router()

solicitudesRouter.post('/', controlador.crear)