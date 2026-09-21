"use client";

import { useEffect, useRef } from "react";
import type { PageElement, TextProps } from "@/lib/types";
import { useProjectStore } from "@/store/projectsStore";
import { useContainerTypography } from "./ContainerTypographyContext";

export default function TextElement({
  element,
  selected,
}: {
  element: PageElement;
  selected: boolean;
}) {
  const { isInsideContainer, typography: containerProps } = useContainerTypography();

  const props = element.props as unknown as TextProps;
  const updateElementProps = useProjectStore((s) => s.actions.updateElementProps);
  const ref = useRef<HTMLDivElement>(null);
  const isEditingRef = useRef(false);

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
        : (isInsideContainer ? undefined : 16);

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
        : (isInsideContainer ? undefined : "#1e293b");

  useEffect(() => {
    if (ref.current && !isEditingRef.current) {
      if (ref.current.textContent !== (props.content ?? "")) {
        ref.current.textContent = props.content ?? "";
      }
    }
  }, [props.content]);

  return (
    <div
      ref={ref}
      contentEditable={selected}
      onPointerDown={(e) => {
        if (selected) e.stopPropagation();
      }}
      onFocus={() => { isEditingRef.current = true; }}
      onBlur={(e) => {
        isEditingRef.current = false;
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
    />
    //   {props.content}
    // </div>
  );
}
