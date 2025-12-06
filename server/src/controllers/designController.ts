import { Request, Response } from 'express';
import { Design } from '../models/Design.js';
import { DesignProcessor } from '../services/DesignProcessor.js';

export const uploadDesign = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const filename = req.file.originalname;
    const filePath = req.file.path;

    const design = new Design({
      filename,
      status: 'pending'
    });

    await design.save();

    const processor = new DesignProcessor();
    processor.processDesign(design._id.toString(), filePath).catch((error) => {
      console.error('[UploadController] Processing error:', error);
    });

    res.status(201).json({
      id: design._id,
      filename: design.filename,
      status: design.status
    });
  } catch (error) {
    console.error('[UploadController] Upload error:', error);
    res.status(500).json({ error: 'Failed to upload design' });
  }
};

export const getDesigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const designs = await Design.find({})
      .select('_id filename status itemsCount createdAt')
      .sort({ createdAt: -1 });

    const designsList = designs.map(design => ({
      id: design._id,
      filename: design.filename,
      status: design.status,
      itemsCount: design.itemsCount,
      createdAt: design.createdAt
    }));

    res.json(designsList);
  } catch (error) {
    console.error('[GetDesigns] Error:', error);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
};

export const getDesignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const design = await Design.findById(id);

    if (!design) {
      res.status(404).json({ error: 'Design not found' });
      return;
    }

    res.json({
      id: design._id,
      filename: design.filename,
      status: design.status,
      svgWidth: design.svgWidth,
      svgHeight: design.svgHeight,
      itemsCount: design.itemsCount,
      coverageRatio: design.coverageRatio,
      createdAt: design.createdAt,
      items: design.items,
      issues: design.issues
    });
  } catch (error) {
    console.error('[GetDesignById] Error:', error);
    res.status(500).json({ error: 'Failed to fetch design' });
  }
};
