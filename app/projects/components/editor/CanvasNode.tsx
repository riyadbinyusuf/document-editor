"use client";

import type { CSSProperties } from "react";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { GripVertical, Copy, Trash2 } from "lucide-react";
import type { AlignSelf, ContainerProps, JustifySelf, PageElement } from "@/lib/types";
import ElementRenderer from "./ElementRenderer";
import { useProjectStore } from "@/store/projectsStore";
import { ELEMENT_REGISTRY } from "@/lib/elementsRegistry";
import {
  CanvasItemData,
  DRAGGABLE_TYPE,
  DropzoneData,
  ROOT_GROUP,
  SIDEBAR_DRAGGABLE_TYPE,
} from "@/lib/dnd-constants";
import { Button } from "@/components/ui/button";

export default function CanvasNode({
  element,
  parentId,
  index,
  layoutDirection = "column"
}: {
  element: PageElement;
  parentId: string | null;
  index: number;
  layoutDirection?: "column" | "row"
}) {
  const selectedId = useProjectStore((s) => s.selectedElmId);
  const selectElement = useProjectStore((s) => s.selectElement);
  const removeElementById = useProjectStore((s) => s.removeElementById);
  const duplicateElementById = useProjectStore((s) => s.duplicateElementById);

  const selected = selectedId === element.id;
  const def = ELEMENT_REGISTRY[element.type];
  const group = parentId ?? ROOT_GROUP;
  const isContainer = element.type === 'container';

  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id: element.id,
    index,
    group,
    type: DRAGGABLE_TYPE,
    accept: isContainer ? [DRAGGABLE_TYPE] : [DRAGGABLE_TYPE, SIDEBAR_DRAGGABLE_TYPE],
    collisionPriority: isContainer ? CollisionPriority.Low : CollisionPriority.Normal,
    data: { kind: "canvas-item", parentId } satisfies CanvasItemData,
    plugins: []
  });

  const childIds = (element.children ?? []).map((c) => c.id);
  const { ref: dropRef, isDropTarget: isContainerDropTarget } = useDroppable({
    id: `dropzone-${element.id}`,
    accept: [DRAGGABLE_TYPE, SIDEBAR_DRAGGABLE_TYPE],
    collisionPriority: CollisionPriority.Low,
    data: { kind: "dropzone", parentId: element.id } satisfies DropzoneData,
    disabled: !isContainer || isDragging,
  });

  const props = element.props as {
    alignSelf?: AlignSelf;
    justifySelf?: JustifySelf;
    width?: number;
  };

  const selfStyle: CSSProperties = {
    opacity: isDragging ? 0.4 : 1,
    alignSelf: props.alignSelf ?? "auto",
    justifySelf: props.justifySelf ?? "auto",
    minWidth: 0,
  };

  const containerProps = isContainer ? (element.props as unknown as ContainerProps) : null;
  const childLayoutDirection = containerProps?.layoutMode === "grid" ? "column" : (containerProps?.direction ?? "column")

  return (
    <div
      ref={ref}
      style={selfStyle}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      className={`group relative rounded-sm outline-none transition ${
        selected
          ? "ring-2 ring-accent-500 ring-offset-2"
          : isContainer && isContainerDropTarget ? "ring-2 ring-accent-500 ring-offset-2 bg-accent-50/10" : "hover:ring-1 hover:ring-slate-300 hover:ring-offset-2"
      }`}
    >
      {/* Drop indicator for container hover badge */}
      {isContainer && (isContainerDropTarget || isDropTarget) && !isDragging && (
        <div className="pointer-events-none absolute -top-3 right-3 z-30 rounded-full bg-accent-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-md animate-pulse">
          Drop inside container
        </div>
      )}

      {/* Drop indicator for directional Line --- */}
      {isDropTarget && !isContainer && !isDragging && (
        layoutDirection === "row" ? (
          /* Vertical insertion line for horizontal row layouts */
          <div className="pointer-events-none absolute -left-1.5 top-0 bottom-0 z-30 flex flex-col items-center justify-between">
            <div className="h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white shadow-sm" />
            <div className="h-full w-1 bg-accent-500 shadow-sm" />
            <div className="h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white shadow-sm" />
          </div>
        ) : (
          /* Horizontal insertion line for vertical column layouts */
          <div className="pointer-events-none absolute -top-1.5 left-0 right-0 z-30 flex items-center justify-between">
            <div className="h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white shadow-sm" />
            <div className="h-1 w-full bg-accent-500 shadow-sm" />
            <div className="h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white shadow-sm" />
          </div>
        )
      )}

      {/* Drag handle, Duplicate, Delete element action button groups */}
      {selected && (
        <div
          className="absolute -top-10 left-0 z-10 flex items-center gap-1 rounded-md bg-primary px-1.5 text-white shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            variant="ghost"
            ref={handleRef}
            className="cursor-grab touch-none rounded p-0.5 hover:bg-white/20 active:cursor-grabbing"
            title="Drag to move"
          >
            <GripVertical size={13} />
          </Button>
          <span className="px-1 text-[10px] font-medium capitalize">
            {def.label}
          </span>
          <button
            type="button"
            className="rounded p-0.5 hover:bg-white/20"
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              duplicateElementById(element.id);
            }}
          >
            <Copy size={13} />
          </button>
          <button
            type="button"
            className="rounded p-0.5 hover:bg-white/20"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              removeElementById(element.id);
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {element.type === "container" ? (
        <ElementRenderer
          element={element}
          selected={selected}
          containerRef={dropRef}
          isOver={isContainerDropTarget}
        >
          {childIds.length === 0 ? (
            <div className="w-full rounded-md border border-dashed border-slate-300 py-6 text-center text-xs text-slate-400">
              Drop elements here
            </div>
          ) : (
            (element.children ?? []).map((child, childIndex) => (
              <CanvasNode
                key={child.id}
                element={child}
                parentId={element.id}
                index={childIndex}
                layoutDirection={childLayoutDirection}
              />
            ))
          )}
        </ElementRenderer>
      ) : (
        <ElementRenderer element={element} selected={selected} />
      )}
    </div>
  );
}
