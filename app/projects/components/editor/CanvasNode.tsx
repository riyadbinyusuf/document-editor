"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import type { Customizable, Plugins } from "@dnd-kit/abstract";
import {
  GripVertical,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CornerLeftUp,
  CornerDownRight,
} from "lucide-react";
import type {
  AlignSelf,
  ContainerProps,
  JustifySelf,
  PageElement,
} from "@/lib/types";
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
import React from "react";

const ACCEPT_TYPES = [DRAGGABLE_TYPE, SIDEBAR_DRAGGABLE_TYPE];
const SORTABLE_PLUGINS: Customizable<Plugins> = [];

const CanvasNode = ({
  element,
  parentId,
  index,
  layoutDirection = "column",
  isParentDragging = false,
  depth = 0,
}: {
  element: PageElement;
  parentId: string | null;
  index: number;
  layoutDirection?: "column" | "row";
  isParentDragging?: boolean;
  depth?: number;
}) => {
  const selectElement = useProjectStore((s) => s.actions.selectElement);
  const removeElementById = useProjectStore((s) => s.actions.removeElementById);
  const duplicateElementById = useProjectStore(
    (s) => s.actions.duplicateElementById,
  );
  const moveElementDirection = useProjectStore(
    (s) => s.actions.moveElementDirection,
  );

  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);
  const selected = useProjectStore((s) => s.context.selectedElmId === element.id);
  const def = ELEMENT_REGISTRY[element.type];
  const group = parentId ?? ROOT_GROUP;
  const isContainer = element.type === "container";

  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id: element.id,
    index,
    group,
    type: DRAGGABLE_TYPE,
    accept: ACCEPT_TYPES,
    collisionPriority: isContainer ? depth * 10 : 10 + (depth * 10) + 5,

    data: { kind: "canvas-item", parentId } satisfies CanvasItemData,
    plugins: SORTABLE_PLUGINS,
  });

  const { ref: dropRef, isDropTarget: isContainerDropTarget } = useDroppable({
    id: `dropzone-${element.id}`,
    accept: ACCEPT_TYPES,
    collisionPriority: 10 + depth * 10,
    data: { kind: "dropzone", parentId: element.id } satisfies DropzoneData,
    disabled: !isContainer || isDragging || isParentDragging,
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

  const containerProps = isContainer
    ? (element.props as unknown as ContainerProps)
    : null;
  const childLayoutDirection =
    containerProps?.layoutMode === "grid"
      ? "row"
      : (containerProps?.direction ?? "column");

  return (
    <div
      ref={ref}
      style={selfStyle}
      onPointerEnter={(e) => {
        e.stopPropagation();
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setIsHovered(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
          setIsHovered(false);
        }, 150);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      className={`group relative rounded-sm outline-none transition ${
        selected
          ? "ring-2 ring-accent-500 ring-offset-2 z-30"
          : isHovered
            ? "ring-1 ring-accent-400 ring-offset-1 z-30"
            : isContainer && isContainerDropTarget
              ? "ring-2 ring-accent-500 ring-offset-2 bg-accent-50/10"
              : "hover:ring-1 hover:ring-slate-300 hover:ring-offset-2"
      }`}
    >
      {/* Drop indicator for container hover badge */}
        {isContainer && isContainerDropTarget && !isDragging && (
        <div className="pointer-events-none absolute -top-3 right-3 z-30 rounded-full bg-accent-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-md animate-pulse">
          Drop inside container
        </div>
      )}

      {/* Drop indicator for directional Line --- */}
      {isDropTarget && !isDragging &&
        (layoutDirection === "row" ? (
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
        ))}

      {/* Action Toolbar on hover and click */}
      {(selected || isHovered) && !isDragging && (
        <div
          className={`absolute -top-9 left-0 z-30 flex items-center gap-0.5 rounded-md px-1 py-0.5 text-white shadow-md text-xs backdrop-blur-sm transition-all before:absolute before:-bottom-3 before:left-0 before:right-0 before:h-3.5 before:content-[''] ${
            selected ? "bg-primary" : "bg-slate-800/90 hover:bg-slate-900"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <Button
            type="button"
            variant="ghost"
            ref={handleRef}
            className="cursor-grab touch-none rounded p-1 hover:bg-white/20 active:cursor-grabbing text-white h-6 w-6"
            title="Drag to move"
          >
            <GripVertical size={13} />
          </Button>

          {/* Type label */}
          <span className="px-1 text-[10px] font-medium capitalize select-none text-white/90">
            {def.label}
          </span>

          <div className="mx-0.5 h-3.5 w-px bg-white/20" />

          {/* Directional Move Buttons: Up, Down, Left, Right */}
          <button
            type="button"
            className="rounded p-1 hover:bg-white/20 active:scale-95 transition-transform"
            title="Move Up"
            onClick={(e) => {
              e.stopPropagation();
              moveElementDirection(element.id, "up");
            }}
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-white/20 active:scale-95 transition-transform"
            title="Move Down"
            onClick={(e) => {
              e.stopPropagation();
              moveElementDirection(element.id, "down");
            }}
          >
            <ArrowDown size={12} />
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-white/20 active:scale-95 transition-transform"
            title="Move Left"
            onClick={(e) => {
              e.stopPropagation();
              moveElementDirection(element.id, "left");
            }}
          >
            <ArrowLeft size={12} />
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-white/20 active:scale-95 transition-transform"
            title="Move Right"
            onClick={(e) => {
              e.stopPropagation();
              moveElementDirection(element.id, "right");
            }}
          >
            <ArrowRight size={12} />
          </button>

          <div className="mx-0.5 h-3.5 w-px bg-white/20" />

          {/* Hierarchical Move: Out to Parent & In to Child */}
          <button
            type="button"
            className="rounded p-1 hover:bg-white/20 active:scale-95 transition-transform"
            title="Move to Parent (Out of container)"
            onClick={(e) => {
              e.stopPropagation();
              moveElementDirection(element.id, "parent");
            }}
          >
            <CornerLeftUp size={12} />
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-white/20 active:scale-95 transition-transform"
            title="Move into Child (Into adjacent container)"
            onClick={(e) => {
              e.stopPropagation();
              moveElementDirection(element.id, "child");
            }}
          >
            <CornerDownRight size={12} />
          </button>

          <div className="mx-0.5 h-3.5 w-px bg-white/20" />

          {/* Duplicate */}
          <button
            type="button"
            className="rounded p-1 hover:bg-white/20 active:scale-95 transition-transform"
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              duplicateElementById(element.id);
            }}
          >
            <Copy size={12} />
          </button>

          {/* Delete */}
          <button
            type="button"
            className="rounded p-1 hover:bg-red-500/80 active:scale-95 transition-transform"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              removeElementById(element.id);
            }}
          >
            <Trash2 size={12} />
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
          {!element.children || element.children.length === 0  ? (
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
                isParentDragging={isDragging || isParentDragging}
                depth={depth + 1}
              />
            ))
          )}
        </ElementRenderer>
      ) : (
        <ElementRenderer element={element} selected={selected} />
      )}
    </div>
  );
};

export default React.memo(CanvasNode);
