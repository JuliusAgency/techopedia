import { Router } from 'express';
import { uploadDesign, getDesigns, getDesignById } from '../controllers/designController.js';
import { upload } from '../middleware/uploadMiddleware.js';

export const designRoutes = Router();

designRoutes.post('/upload', upload.single('file'), uploadDesign);
designRoutes.get('/designs', getDesigns);
designRoutes.get('/designs/:id', getDesignById);

