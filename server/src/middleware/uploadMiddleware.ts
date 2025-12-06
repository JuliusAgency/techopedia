import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'image/svg+xml' || path.extname(file.originalname).toLowerCase() === '.svg') {
    cb(null, true);
  } else {
    cb(new Error('Only SVG files are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

