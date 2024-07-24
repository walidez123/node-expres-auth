import express from 'express';
import { createPermission, deletePermissionById, getAllPermissions } from '../controllers/permissionsController.js';
import { CheckRole } from "../middleware/checkRole.js";

const router = express.Router();
router.get('/', CheckRole(),getAllPermissions)
router.post('/',CheckRole(),createPermission)
router.delete('/:id',CheckRole(),deletePermissionById)

export default router;