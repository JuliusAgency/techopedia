import { SvgParser } from './SvgParser.js';
import { DesignAnalyzer } from './DesignAnalyzer.js';
import { Design } from '../models/Design.js';

export class DesignProcessor {
  private parser: SvgParser;
  private analyzer: DesignAnalyzer;

  constructor() {
    this.parser = new SvgParser();
    this.analyzer = new DesignAnalyzer();
  }

  async processDesign(designId: string, filePath: string): Promise<void> {
    try {
      const design = await Design.findById(designId);
      if (!design) {
        throw new Error('Design not found');
      }

      const parsedData = await this.parser.parseFile(filePath);
      
      if (parsedData.width === 0 || parsedData.height === 0) {
        throw new Error(`Invalid SVG dimensions: ${parsedData.width}x${parsedData.height}`);
      }

      if (parsedData.rects.length === 0) {
        design.svgWidth = parsedData.width;
        design.svgHeight = parsedData.height;
        design.items = [];
        design.itemsCount = 0;
        design.coverageRatio = 0;
        design.issues = ['EMPTY - SVG contains no rectangle elements. Only <rect> elements are supported.'];
        design.status = 'processed';
        await design.save();
        return;
      }

      const analysis = this.analyzer.analyze(parsedData);

      design.svgWidth = parsedData.width;
      design.svgHeight = parsedData.height;
      design.items = analysis.items;
      design.itemsCount = analysis.items.length;
      design.coverageRatio = analysis.coverageRatio;
      design.issues = analysis.issues;
      design.status = 'processed';

      await design.save();
    } catch (error) {
      console.error(`[DesignProcessor] Error processing design ${designId}:`, error);
      const design = await Design.findById(designId);
      if (design) {
        design.status = 'error';
        if (error instanceof Error) {
          design.issues = [error.message];
        } else {
          design.issues = ['Unknown error occurred'];
        }
        await design.save();
      }
    }
  }
}
