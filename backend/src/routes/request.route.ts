import express from 'express'
import { getUserRequests, createRequest, actionRequest, getAllRequests } from '~/controllers/request.controllers.ts'
import { isAdmin } from '~/middlewares/is-admin.ts'
import { is_auth } from '~/middlewares/is-auth.ts'

const router = express.Router()

router.post('/create', is_auth, createRequest)

// Get user's requests
router.get('/my-requests', is_auth, getUserRequests)

// Admin routes below
router.get('/all', is_auth, isAdmin, getAllRequests)

router.put('/approve/:requestId', is_auth, isAdmin, actionRequest)
router.put('/reject/:requestId', is_auth, isAdmin, actionRequest)



export default router
