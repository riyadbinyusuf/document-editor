import type { ElementType } from "@/lib/types";

export const ROOT_GROUP = "root";

export const DRAGGABLE_TYPE = "element";
export const SIDEBAR_DRAGGABLE_TYPE = "draggable-item";

export interface CanvasItemData {
  kind: "canvas-item";
  parentId: string | null;
}

export interface DropzoneData {
  kind: "dropzone";
  parentId: string | null;
}

export interface DraggableItemData {
  kind: "draggable-item";
  elementType: ElementType;
}

export type DndData = CanvasItemData | DropzoneData | DraggableItemData;

export function groupToParentId(group: unknown): string | null {
  if (group === ROOT_GROUP || group == null) return null;
  return String(group);
}
