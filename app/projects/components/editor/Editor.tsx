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
import { useProjectStore } from "@/store/projectsStore";
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
  EllipsisVertical,
  File,
  FolderOpen,
  Maximize2,
  Plus,
  Save,
  SquareText,
} from "lucide-react";
import ComponentsPanel from "./ComponentsPanel";
import {
  CanvasItemData,
  DndData,
  DropzoneData,
} from "@/lib/dnd-constants";
import Canvas from "./Canvas";

const canvasZoom = [
  { label: "100%", value: "100%" },
  { label: "85%", value: "85%" },
  { label: "75%", value: "75%" },
  { label: "50%", value: "50%" },
];

export default function Editor() {
  const elements = useProjectStore((s) => s.selectedPage.elements) ?? [];
  const addElement = useProjectStore((s) => s.addElement);
  const moveElement = useProjectStore((s) => s.moveElement);

  function handleDragEnd(event: DragEndEvent) {
    console.log({event})
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source) return;

    // Existing canvas element: reordered within a list, or moved to a
    // different one. dnd-kit's optimistic sorting has already resolved
    // the final group/index by the time drop happens — we just persist it.
    if (isSortable(source)) {
      if (target && !isSortable(target)) {
        const targetData = target.data as DropzoneData | undefined;
        if (targetData?.kind === 'dropzone') {
          if (String(source.id) === targetData.parentId) return;
          moveElement(String(source.id), {
            parentId: targetData.parentId,
            index: undefined
          });
          return;
        }
      }

      if (target && isSortable(target)) {
        if (String(source.id) === String(target.id)) return;
        const targetElement = findElement(elements, String(target.id));
        const isTargetContainer = targetElement?.type === "container";
        const sourceElement = findElement(elements, String(source.id));
        const isSourceContainer = sourceElement?.type === "container";
        // placing elemented inside container
        if (isTargetContainer && !isSourceContainer) {
          moveElement(String(source.id), {
            parentId: String(target.id),
            index: undefined,
          });
          return;
        }
        const targetData = target.data as CanvasItemData | undefined;
        const targetParentId = targetData?.parentId ?? null;
        if (String(source.id) === targetParentId) return;
        moveElement(String(source.id), {
          parentId: targetParentId,
          index: target.index,
        });
        return;
      }

    }

    const sourceData = source.data as DndData | undefined;
    if (sourceData?.kind === "draggable-item" && target) {
      const targetData = target.data as
        | CanvasItemData
        | DropzoneData
        | undefined;
      const parentId = targetData?.parentId ?? null;

      const index = isSortable(target) ? target.index : undefined;
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
          <div className="ml-4 p-4 border rounded min-h-0 overflow-auto space-y-3">
            <div className="heading flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="">
                  {" "}
                  <FolderOpen className="text-primary" />{" "}
                </div>
                <div className="">
                  <h2 className="text-base font-medium">Save Templates</h2>
                  <p className="text-sm font-light text-gray-500">
                    Access and manage your saved templates
                  </p>
                </div>
              </div>
              <Button variant="outline_primay">
                {" "}
                <Plus /> Save current as Template{" "}
              </Button>
            </div>
            <div className="save-template-list space-y-2">
              <div className="st-card bg-white rounded px-3 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="">
                    {" "}
                    <Save className="text-primary" />{" "}
                  </div>
                  <div className="">
                    <h3 className="text-sm">Template 1</h3>
                    <p className="text-xs font-light text-gray-500">
                      Saved on 2026-09-14 | 10:32 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline_primay">
                    {" "}
                    <File /> Open
                  </Button>
                  <Button variant="outline">
                    <EllipsisVertical />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {(source) => {
          const data = source.data as DndData | undefined;
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
