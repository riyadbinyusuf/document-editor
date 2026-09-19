"use client";

import { useState } from "react";
import {
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
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
} from "lucide-react";
import ComponentsPanel from "./ComponentsPanel";
import {
  CanvasItemData,
  DndData,
  DropzoneData,
  groupToParentId,
} from "@/lib/dnd-constants";
import Canvas from "./Canvas";

type ActiveDrag =
  | { kind: "draggableItem"; elementType: ElementType }
  | { kind: "canvas"; elementType: ElementType; label: string };

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
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);

  function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source) return;

    // Existing canvas element: reordered within a list, or moved to a
    // different one. dnd-kit's optimistic sorting has already resolved
    // the final group/index by the time drop happens — we just persist it.
    if (isSortable(source)) {
      const { initialIndex, index, initialGroup, group } = source;
      if (initialIndex === index && initialGroup === group) return;
      moveElement(String(source.id), {
        parentId: groupToParentId(group),
        index,
      });
      return;
    }

    // A brand-new element dragged in from the sidebar.
    const sourceData = source.data as DndData | undefined;
    if (sourceData?.kind === "draggable-item" && target) {
      const targetData = target.data as
        | CanvasItemData
        | DropzoneData
        | undefined;
      const parentId = targetData?.parentId ?? null;
      // If we're hovering a specific existing element, insert right
      // before it; otherwise (empty container / root canvas) append.
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
          <div className="flex flex-1 h-full items- justify-between space-x-4 min-h-0">
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
              <div className="canvas-frame shadow-sm bg-white rounded flex-1">
                <Canvas />
              </div>
            </div>
            {/* Settings panel */}
            <div className="editor-right-panel w-[20%] h-full bg-white border border-gray-200 rounded p-3">
              <h2 className="font-bold text-lg text-black">
                Properties & Data
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
    </DragDropProvider>
  );
}
