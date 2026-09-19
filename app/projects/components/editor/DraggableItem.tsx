import { ELEMENT_REGISTRY } from "@/lib/elementsRegistry";
import { ElementType } from "@/lib/types";
import { useDraggable } from "@dnd-kit/react"

export default function DraggableItem({ type }: { type: ElementType }) {
  const def = ELEMENT_REGISTRY[type];
  const Icon = def.icon;
  const draggable = useDraggable({
    id: `sidebar-${type}`,
    data: { source: "sidebar", elementType: type },
  });

  return (
    <button
      ref={draggable.ref}
      type="button"
      className={`flex items-center gap-2 rounded-lg text-white px-3 py-1 transition hover:border-accent-500 hover:text-accent-600 hover:shadow-sm active:cursor-grabbing ${
        draggable.isDragging ? "opacity-40" : "cursor-grab"
      }`}
      title={`Drag to add ${def.label}`}
    >
      <Icon size={20} strokeWidth={1.75} />
      <span className="text-[11px] font-medium">{def.label}</span>
    </button>
  );
}