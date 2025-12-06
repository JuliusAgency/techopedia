import { IItem } from '../models/Item.js';
import { ParsedSvgData } from './SvgParser.js';

export class DesignAnalyzer {
  analyze(parsedData: ParsedSvgData): {
    items: IItem[];
    coverageRatio: number;
    issues: string[];
  } {
    const { width, height, rects } = parsedData;
    
    if (rects.length === 0) {
      return {
        items: [],
        coverageRatio: 0,
        issues: ['EMPTY']
      };
    }

    const totalArea = width * height;
    let totalRectArea = 0;
    const items: IItem[] = [];
    const issues: string[] = [];

    rects.forEach(rect => {
      const rectArea = rect.width * rect.height;
      totalRectArea += rectArea;

      let hasIssue = false;
      
      const rectRight = rect.x + rect.width;
      const rectBottom = rect.y + rect.height;
      
      if (rect.x < 0 || rect.y < 0 || rectRight > width || rectBottom > height) {
        hasIssue = true;
        if (!issues.includes('OUT_OF_BOUNDS')) {
          issues.push('OUT_OF_BOUNDS');
        }
      }

      items.push({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        fill: rect.fill,
        hasIssue
      });
    });

    const coverageRatio = totalArea > 0 ? totalRectArea / totalArea : 0;

    return {
      items,
      coverageRatio,
      issues
    };
  }
}

