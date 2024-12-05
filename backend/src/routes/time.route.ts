import express from 'express'
import { getTimer, updateTimer } from '~/controllers/time.controllers.ts'
import { is_auth } from '~/middlewares/is-auth.ts'

const router = express.Router()


router.get('/', is_auth ,getTimer)


router.put('/update', is_auth ,updateTimer)







export default router
