"use client";

import { useRef } from "react";
import type { PageElement, TextProps } from "@/lib/types";
import { useProjectStore } from "@/store/projectsStore";

export default function TextElement({
  element,
  selected,
}: {
  element: PageElement;
  selected: boolean;
}) {
  const props = element.props as unknown as TextProps;
  const updateElementProps = useProjectStore((s) => s.updateElementProps);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      contentEditable={selected}
      suppressContentEditableWarning
      onPointerDown={(e) => {
        if (selected) e.stopPropagation();
      }}
      onBlur={(e) => {
        const content = e.currentTarget.textContent ?? "";
        if (content !== props.content) {
          updateElementProps(element.id, { content });
        }
      }}
      style={{
        fontSize: props.fontSize,
        fontWeight:
          props.fontWeight === "normal"
            ? 400
            : props.fontWeight === "medium"
              ? 500
              : props.fontWeight === "semibold"
                ? 600
                : 700,
        textAlign: props.textAlign,
        color: props.color,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {props.content}
    </div>
  );
}
