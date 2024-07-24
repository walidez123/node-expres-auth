import express from 'express';
import { Register,Login, GetAllUsers, assignRolesToUser, DeleteUserById } from '../controllers/authControllers.js';
import { CheckRole } from "../middleware/checkRole.js";

const router = express.Router();

router.get('',CheckRole(),GetAllUsers)
router.post('/register',Register)
router.post('/login',Login)
router.put('/:id',CheckRole(),assignRolesToUser)
router.delete('/:id',DeleteUserById)






export default router