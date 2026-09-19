"use client";

import type { ButtonProps, PageElement } from "@/lib/types";
import { useProjectStore } from "@/store/projectsStore";


export default function ButtonElement({
  element,
  selected,
}: {
  element: PageElement;
  selected: boolean;
}) {
  const props = element.props as unknown as ButtonProps;
  const updateElementProps = useProjectStore((s) => s.updateElementProps);

  return (
    <span
      contentEditable={selected}
      suppressContentEditableWarning
      onPointerDown={(e) => {
        if (selected) e.stopPropagation();
      }}
      onBlur={(e) => {
        const label = e.currentTarget.textContent ?? "";
        if (label !== props.label) {
          updateElementProps(element.id, { label });
        }
      }}
      className="inline-block select-none"
      style={{
        backgroundColor: props.backgroundColor,
        color: props.textColor,
        fontSize: props.fontSize,
        borderRadius: props.borderRadius,
        padding: `${props.paddingY}px ${props.paddingX}px`,
      }}
    >
      {props.label}
    </span>
  );
}
