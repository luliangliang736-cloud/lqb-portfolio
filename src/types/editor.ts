export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type ElementType = 'rectangle' | 'ellipse' | 'text' | 'image';

export type ToolType = 'select' | 'hand' | 'rectangle' | 'ellipse' | 'text' | 'image';

export interface DesignElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  borderRadius: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  imageSrc?: string;
  locked: boolean;
  visible: boolean;
  name: string;
}

export interface CanvasState {
  zoom: number;
  offset: Position;
}

export interface EditorState {
  elements: DesignElement[];
  selectedIds: string[];
  activeTool: ToolType;
  canvas: CanvasState;
}
