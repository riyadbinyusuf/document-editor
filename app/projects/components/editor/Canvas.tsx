"use client";

import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import CanvasNode from "./CanvasNode";
import { useProjectStore } from "@/store/projectsStore";
import { DRAGGABLE_TYPE, DropzoneData, SIDEBAR_DRAGGABLE_TYPE } from "@/lib/dnd-constants";

export default function Canvas() {
  const elements = useProjectStore((s) => s.selectedPage.elements) ?? [];
  const selectElement = useProjectStore((s) => s.selectElement);

  const { ref, isDropTarget } = useDroppable({
    id: "root-dropzone",
    accept: [DRAGGABLE_TYPE, SIDEBAR_DRAGGABLE_TYPE],
    collisionPriority: CollisionPriority.Low,
    data: { kind: "dropzone", parentId: null } satisfies DropzoneData,
  });

  return (
    <div
      className="thin-scroll flex-1 overflow-y-auto shadow-sm bg-white rounded min-h-0"
      onClick={() => selectElement(null)}
    >
      <div
        className="h-full"
      >
        <div
          ref={ref}
          className={`min-h-full flex flex-col gap-6 p-10 transition-shadow ${
            isDropTarget ? "shadow-[inset_0_0_0_2px_#4C5BD4]" : ""
          }`}
        >
          {elements.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-200 text-center text-sm text-slate-400">
              <p className="font-medium text-slate-500">
                Drag an element here to start building
              </p>
              <p className="text-xs">
                Pick anything from the sidebar on the left
              </p>
            </div>
          ) : (
            elements.map((el, index) => (
              <CanvasNode
                key={el.id}
                element={el}
                parentId={null}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

