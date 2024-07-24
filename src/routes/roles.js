import express from "express";
import { CreateRole, DeleteRole, GetAllRoles } from "../controllers/rolesController.js";
import { CheckRole } from "../middleware/checkRole.js";
const router = express.Router();

router.get('/', CheckRole(), GetAllRoles)
router.post('/', CheckRole(),CreateRole)
router.delete('/:id', CheckRole(),DeleteRole)

export default router