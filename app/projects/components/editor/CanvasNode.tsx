"use client";

import type { CSSProperties } from "react";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { GripVertical, Copy, Trash2 } from "lucide-react";
import type { AlignSelf, JustifySelf, PageElement } from "@/lib/types";
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

export default function CanvasNode({
  element,
  parentId,
  index,
}: {
  element: PageElement;
  parentId: string | null;
  index: number;
}) {
  const selectedId = useProjectStore((s) => s.selectedElmId);
  const selectElement = useProjectStore((s) => s.selectElement);
  const removeElementById = useProjectStore((s) => s.removeElementById);
  const duplicateElementById = useProjectStore((s) => s.duplicateElementById);

  const selected = selectedId === element.id;
  const def = ELEMENT_REGISTRY[element.type];
  const group = parentId ?? ROOT_GROUP;

  const { ref, handleRef, isDragging } = useSortable({
    id: element.id,
    index,
    group,
    type: DRAGGABLE_TYPE,
    accept: [DRAGGABLE_TYPE, SIDEBAR_DRAGGABLE_TYPE],
    data: { kind: "canvas-item", parentId } satisfies CanvasItemData,
  });

  const childIds = (element.children ?? []).map((c) => c.id);
  const { ref: dropRef, isDropTarget } = useDroppable({
    id: `dropzone-${element.id}`,
    accept: [DRAGGABLE_TYPE, SIDEBAR_DRAGGABLE_TYPE],
    collisionPriority: CollisionPriority.Low,
    data: { kind: "dropzone", parentId: element.id } satisfies DropzoneData,
    disabled: element.type !== "container",
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
    width: element.type === "image" ? `${props.width ?? 100}%` : undefined,
    minWidth: 0,
  };

  return (
    <div
      ref={ref}
      style={selfStyle}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      className={`group relative rounded-sm outline-none transition ${
        selected
          ? "ring-2 ring-accent-500 ring-offset-2"
          : "hover:ring-1 hover:ring-slate-300 hover:ring-offset-2"
      }`}
    >
      {selected && (
        <div
          className="absolute -top-7 left-0 z-10 flex items-center gap-1 rounded-md bg-accent-500 px-1.5 py-1 text-white shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            ref={handleRef}
            className="cursor-grab touch-none rounded p-0.5 hover:bg-white/20 active:cursor-grabbing"
            title="Drag to move"
          >
            <GripVertical size={13} />
          </button>
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
          isOver={isDropTarget}
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
