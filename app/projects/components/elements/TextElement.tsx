"use client";

import { useRef } from "react";
import type { PageElement, TextProps, TypographyProps } from "@/lib/types";
import { useProjectStore } from "@/store/projectsStore";
import { findParentContainer } from "@/lib/tree";

export default function TextElement({
  element,
  selected,
}: {
  element: PageElement;
  selected: boolean;
}) {
  const elements = useProjectStore((s) => s.selectedPage.elements) ?? [];
  const parentContainer = findParentContainer(elements, element.id);
  const containerProps = parentContainer?.props as TypographyProps | undefined;

  const props = element.props as unknown as TextProps;
  const updateElementProps = useProjectStore((s) => s.updateElementProps);
  const ref = useRef<HTMLDivElement>(null);

  const resolvedFontFamily =
    props.fontFamily && props.fontFamily !== "inherit"
      ? props.fontFamily
      : containerProps?.fontFamily && containerProps.fontFamily !== "inherit"
        ? containerProps.fontFamily
        : undefined;

  const resolvedFontSize =
    props.fontSize != null
      ? props.fontSize
      : containerProps?.fontSize != null
        ? containerProps.fontSize
        : (parentContainer ? undefined : 16);

  const resolvedFontWeight =
    props.fontWeight
      ? props.fontWeight
      : containerProps?.fontWeight
        ? containerProps.fontWeight
        : undefined;

  const resolvedLineHeight =
    props.lineHeight != null
      ? props.lineHeight
      : containerProps?.lineHeight != null
        ? containerProps.lineHeight
        : undefined;

  const resolvedLetterSpacing =
    props.letterSpacing != null
      ? props.letterSpacing
      : containerProps?.letterSpacing != null
        ? containerProps.letterSpacing
        : undefined;

  const resolvedTextAlign =
    props.textAlign
      ? props.textAlign
      : containerProps?.textAlign
        ? containerProps.textAlign
        : undefined;

  const resolvedTextTransform =
    props.textTransform && props.textTransform !== "none"
      ? props.textTransform
      : containerProps?.textTransform && containerProps.textTransform !== "none"
        ? containerProps.textTransform
        : undefined;

  const resolvedColor =
    props.color
      ? props.color
      : containerProps?.color
        ? containerProps.color
        : (parentContainer ? undefined : "#1e293b");

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
        fontFamily: resolvedFontFamily,
        fontSize: resolvedFontSize != null ? `${resolvedFontSize}px` : undefined,
        fontWeight:
          resolvedFontWeight === "normal"
            ? 400
            : resolvedFontWeight === "medium"
              ? 500
              : resolvedFontWeight === "semibold"
                ? 600
                : resolvedFontWeight === "bold"
                  ? 700
                  : undefined,
        lineHeight: resolvedLineHeight ?? undefined,
        letterSpacing: resolvedLetterSpacing != null ? `${resolvedLetterSpacing}px` : undefined,
        textAlign: resolvedTextAlign,
        textTransform: resolvedTextTransform,
        color: resolvedColor,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {props.content}
    </div>
  );
}
