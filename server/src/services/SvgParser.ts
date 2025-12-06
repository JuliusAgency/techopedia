import { XMLParser } from 'fast-xml-parser';
import fs from 'fs/promises';

export interface ParsedSvgData {
  width: number;
  height: number;
  rects: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
  }>;
}

export class SvgParser {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseAttributeValue: false,
      trimValues: true,
      removeNSPrefix: false,
      parseTagValue: false
    });
  }

  async parseFile(filePath: string): Promise<ParsedSvgData> {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const parsed = this.parser.parse(fileContent);
    
    let rootSvg = parsed.svg;
    
    if (!rootSvg) {
      rootSvg = this.findSvgElement(parsed);
    }
    
    if (!rootSvg) {
      throw new Error('No SVG element found in file');
    }

    let width = this.parseDimension(rootSvg['@_width'] || rootSvg['@_WIDTH'] || '0');
    let height = this.parseDimension(rootSvg['@_height'] || rootSvg['@_HEIGHT'] || '0');

    if (width === 0 || height === 0) {
      const viewBox = rootSvg['@_viewBox'] || rootSvg['@_viewbox'] || rootSvg['@_VIEWBOX'];
      if (viewBox && typeof viewBox === 'string') {
        const viewBoxParts = viewBox.split(/[\s,]+/).filter(p => p);
        if (viewBoxParts.length >= 4) {
          width = this.parseDimension(viewBoxParts[2]);
          height = this.parseDimension(viewBoxParts[3]);
        }
      }
    }

    if (width === 0 || height === 0) {
      throw new Error('Could not determine SVG dimensions');
    }
    
    const rects = this.extractRects(rootSvg);

    return { width, height, rects };
  }

  private findSvgElement(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return null;
    }

    if (obj['@_width'] || obj['@_height'] || obj['@_viewBox'] || obj['@_viewbox'] || obj['@_VIEWBOX']) {
      return obj;
    }

    if (obj.svg) {
      return obj.svg;
    }

    for (const key in obj) {
      if (key.toLowerCase() === 'svg') {
        return obj[key];
      }
      const result = this.findSvgElement(obj[key]);
      if (result) return result;
    }

    return null;
  }

  private extractRects(svgElement: any): Array<{ x: number; y: number; width: number; height: number; fill: string }> {
    const rects: Array<{ x: number; y: number; width: number; height: number; fill: string }> = [];
    
    const parseRect = (rect: any): void => {
      if (!rect || typeof rect !== 'object') return;
      
      const x = this.parseDimension(rect['@_x'] || rect['@_X'] || '0');
      const y = this.parseDimension(rect['@_y'] || rect['@_Y'] || '0');
      const width = this.parseDimension(rect['@_width'] || rect['@_WIDTH'] || '0');
      const height = this.parseDimension(rect['@_height'] || rect['@_HEIGHT'] || '0');
      
      if (width > 0 && height > 0) {
        let fill = rect['@_fill'] || rect['@_FILL'] || 'none';
        
        if ((!fill || fill === 'none') && rect['@_style']) {
          const styleStr = typeof rect['@_style'] === 'string' ? rect['@_style'] : '';
          const fillMatch = styleStr.match(/fill:\s*([^;]+)/i);
          if (fillMatch) {
            fill = fillMatch[1].trim();
          }
        }
        
        if (!fill) {
          fill = 'none';
        }
        
        rects.push({
          x,
          y,
          width,
          height,
          fill
        });
      }
    };
    
    const traverse = (node: any): void => {
      if (!node || typeof node !== 'object') return;
      
      if (node.rect) {
        const rectArray = Array.isArray(node.rect) ? node.rect : [node.rect];
        rectArray.forEach(parseRect);
      }
      
      if (node.g || node.G) {
        const groupArray = Array.isArray(node.g || node.G) ? (node.g || node.G) : [node.g || node.G];
        groupArray.forEach((group: any) => traverse(group));
      }
      
      for (const key in node) {
        if (key !== 'rect' && key !== 'g' && key !== 'G' && key !== '@_width' && key !== '@_height' && key !== '@_viewBox' && typeof node[key] === 'object') {
          traverse(node[key]);
        }
      }
    };

    traverse(svgElement);
    return rects;
  }

  private parseDimension(value: string | number): number {
    if (typeof value === 'number') {
      return isNaN(value) ? 0 : value;
    }
    
    if (!value || typeof value !== 'string') {
      return 0;
    }
    
    const cleaned = value.trim().replace(/px|em|rem|pt|cm|mm|in|pc|ex|ch|vw|vh|vmin|vmax|%|,/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  private detectElementTypes(svgElement: any): string[] {
    const types: string[] = [];
    
    const traverse = (node: any): void => {
      if (!node || typeof node !== 'object') return;
      
      for (const key in node) {
        if (key !== '@_width' && key !== '@_height' && key !== '@_viewBox' && key !== '@_viewbox' && key !== '@_VIEWBOX') {
          if (['rect', 'path', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'g', 'text'].includes(key.toLowerCase())) {
            if (!types.includes(key.toLowerCase())) {
              types.push(key.toLowerCase());
            }
          }
          if (typeof node[key] === 'object') {
            traverse(node[key]);
          }
        }
      }
    };

    traverse(svgElement);
    return types;
  }
}
