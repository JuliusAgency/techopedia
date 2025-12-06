export interface DesignItem {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  hasIssue: boolean;
}

export interface Design {
  id: string;
  filename: string;
  status: 'pending' | 'processed' | 'error';
  svgWidth: number;
  svgHeight: number;
  itemsCount: number;
  coverageRatio: number;
  createdAt: string;
  items: DesignItem[];
  issues: string[];
}

export interface DesignListItem {
  id: string;
  filename: string;
  status: 'pending' | 'processed' | 'error';
  itemsCount: number;
  createdAt: string;
}

