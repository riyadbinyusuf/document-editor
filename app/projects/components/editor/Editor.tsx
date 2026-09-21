"use client";

import {
  DragOverlay,
  type DragEndEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import { findElement } from "@/lib/tree";
import type { ElementType } from "@/lib/types";
import PropertiesPanel from "./PropertiesPanel";
import { DragDropProvider } from "@dnd-kit/react";
import { selectActiveElements, useProjectStore } from "@/store/projectsStore";
import { ELEMENT_REGISTRY } from "@/lib/elementsRegistry";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Maximize2,
  SquareText,
} from "lucide-react";
import ComponentsPanel from "./ComponentsPanel";
import {
  CanvasItemData,
  DndData,
  DropzoneData,
} from "@/lib/dnd-constants";
import Canvas from "./Canvas";
import SaveTemplate from "./SaveTemplate";
import React from "react";

const canvasZoom = [
  { label: "100%", value: "100%" },
  { label: "85%", value: "85%" },
  { label: "75%", value: "75%" },
  { label: "50%", value: "50%" },
];

function Editor() {
  const addElement = useProjectStore((s) => s.actions.addElement);
  const moveElement = useProjectStore((s) => s.actions.moveElement);

  // detects whether to insert before or after target
  function getInsertionIndex(
    target: DragEndEvent["operation"]["target"],
    pointerPos?: { x: number; y: number } | null
  ): number | undefined {
    if (!isSortable(target) || target.index === undefined) return undefined;
    if (!pointerPos || !target.element) return target.index;

    const rect = target.element.getBoundingClientRect();
    // Use X for wide/horizontal items, Y for vertical column items
    const isHorizontal = rect.width > rect.height * 1.5;
    const isAfter = isHorizontal
      ? pointerPos.x > rect.left + rect.width / 2
      : pointerPos.y > rect.top + rect.height / 2;

    return isAfter ? target.index + 1 : target.index;
  }

  function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source || !target) return;

    const elements = selectActiveElements(useProjectStore.getState());
    const pointer = event.operation.position.current;

    // Reordering
    if (isSortable(source)) {
      // 1. Drop to root canvas or empty container dropzone
      if (!isSortable(target)) {
        const targetData = target.data as DropzoneData | undefined;
        if (targetData?.kind === "dropzone") {
          if (String(source.id) === targetData.parentId) return;
          moveElement(String(source.id), {
            parentId: targetData.parentId,
            index: undefined,
          });
          return;
        }
      }

      // 2. Drop to sortable target (element or container)
      if (isSortable(target)) {
        if (String(source.id) === String(target.id)) return;
        const targetElement = findElement(elements, String(target.id));
        const isTargetContainer = targetElement?.type === "container";

        // A. if dropping to empty container
        if (isTargetContainer && (!targetElement.children || targetElement.children.length === 0)) {
          moveElement(String(source.id), {
            parentId: targetElement.id,
            index: undefined,
          });
          return;
        }

        // B. if dropping to non-empty container
        if (isTargetContainer && target.element) {
          const rect = target.element.getBoundingClientRect();
          const pointerY = pointer?.y ?? rect.top;
          const edgeThreshold = Math.min(12, Math.max(4, rect.height * 0.15)); // 24px edge hitbox

          // Top -> move to sibling BEFORE
          if (pointerY < rect.top + edgeThreshold) {
            const targetData = target.data as CanvasItemData | undefined;
            moveElement(String(source.id), {
              parentId: targetData?.parentId ?? null,
              index: target.index,
            });
            return;
          }
          // Bottom -> move to sibling AFTER
          if (pointerY > rect.bottom - edgeThreshold) {
            const targetData = target.data as CanvasItemData | undefined;
            moveElement(String(source.id), {
              parentId: targetData?.parentId ?? null,
              index: target.index + 1,
            });
            return;
          }
          // Interior -> drop INSIDE container
          moveElement(String(source.id), {
            parentId: targetElement.id,
            index: undefined,
          });
          return;
        }

        // C. General element sorting (top 50% = before, bottom 50% = after)
        const targetData = target.data as CanvasItemData | undefined;
        const targetParentId = targetData?.parentId ?? null;
        if (String(source.id) === targetParentId) return;

        const insertIndex = getInsertionIndex(target, pointer);
        moveElement(String(source.id), {
          parentId: targetParentId,
          index: insertIndex,
        });
        return;
      }
    }

    // Add new element to the tree
    const sourceData = source.data as DndData | undefined;
    if (sourceData?.kind === "draggable-item") {
      const targetElement = isSortable(target) ? findElement(elements, String(target.id)) : null;
      const isTargetContainer = targetElement?.type === "container";

      // 1. if dropping to empty container
      if (isTargetContainer && (!targetElement.children || targetElement.children.length === 0)) {
        addElement(sourceData.elementType, { parentId: targetElement.id, index: undefined });
        return;
      }

      // 2. if dropping to non-empty container
      if (isTargetContainer && isSortable(target) && target.element) {
        const rect = target.element.getBoundingClientRect();
        const pointerY = pointer?.y ?? rect.top;
        const edgeThreshold = 24;

        // Top -> add BEFORE container
        if (pointerY < rect.top + edgeThreshold) {
          const targetData = target.data as CanvasItemData | undefined;
          addElement(sourceData.elementType, {
            parentId: targetData?.parentId ?? null,
            index: target.index,
          });
          return;
        }
        // Bottom  -> add AFTER container
        if (pointerY > rect.bottom - edgeThreshold) {
          const targetData = target.data as CanvasItemData | undefined;
          addElement(sourceData.elementType, {
            parentId: targetData?.parentId ?? null,
            index: target.index + 1,
          });
          return;
        }
        // Interior -> add INSIDE container
        addElement(sourceData.elementType, {
          parentId: targetElement.id,
          index: undefined,
        });
        return;
      }

      // 3. Dropping onto explicit dropzone or regular element
      const targetData = target.data as CanvasItemData | DropzoneData | undefined;
      const parentId = targetData?.parentId ?? null;
      const index = getInsertionIndex(target, pointer);

      addElement(sourceData.elementType, { parentId, index });
    }
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="main-editor-area flex items-start justify-between min-h-0 overflow-auto">
        {/* Components Panel */}
        <ComponentsPanel />
        {/* Canvas & Settings & Saved template */}
        <div className="editor-canvas-area flex flex-col min-h-0 flex-1 space-y-5 h-full">
          {/* Canvas and Settings */}
          <div className="flex flex-1 h-full justify-between space-x-4 min-h-0">
            <div className="px-4 flex flex-col min-h-0 flex-1">
              {/* Zoom, expand actions */}
              <div className="zoom-expand flex items-center justify-end space-x-3 pb-3">
                <div className="">
                  <Select items={canvasZoom} defaultValue="100%">
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Zoom</SelectLabel>
                        {canvasZoom.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Maximize2 />{" "}
                </Button>
              </div>
              {/* Canvas Pages */}
                <Canvas />
            </div>
            {/* Settings panel */}
            <div className="editor-right-panel w-[20%] h-full bg-white border border-gray-200 rounded p-3">
              <h2 className="font-bold text-base text-black flex items-center space-x-2">
                <span><SquareText /></span>
                <span>Properties &amp; Data</span>
              </h2>
              <PropertiesPanel />
            </div>
          </div>

          {/* Save templates */}
          <SaveTemplate />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {(source) => {
          const data = source.data as DndData | undefined;
          const elements = selectActiveElements(useProjectStore.getState());
          const sourceType: ElementType | undefined =
            data?.kind === "draggable-item"
              ? data.elementType
              : findElement(elements, String(source.id))?.type;
          const label = sourceType ? ELEMENT_REGISTRY[sourceType].label : "";
          return (
            <div className="flex items-center gap-2 rounded-md border border-accent-500 bg-white px-3 py-2 text-xs font-medium text-accent-600 shadow-md">
              {data?.kind === "draggable-item" ? `Add ${label}` : `Moving ${label}`}
            </div>
          );
        }}
      </DragOverlay>
    </DragDropProvider>
  );
}

export default React.memo(Editor);
