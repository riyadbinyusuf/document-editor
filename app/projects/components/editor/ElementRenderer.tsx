"use client";

import type { ReactNode } from "react";
import type { PageElement } from "@/lib/types";
import TextElement from "@/app/projects/components/elements/TextElement";
import ImageElement from "@/app/projects/components/elements/ImageElement";
import ButtonElement from "@/app/projects/components/elements/ButtonElement";
import ContainerElement from "@/app/projects/components/elements/ContainerElement";


export default function ElementRenderer({
  element,
  selected,
  children,
  containerRef,
  isOver,
}: {
  element: PageElement;
  selected: boolean;
  children?: ReactNode;
  containerRef?: (node: HTMLDivElement | null) => void;
  isOver?: boolean;
}) {
  switch (element.type) {
    case "text":
      return <TextElement element={element} selected={selected} />;
    case "image":
      return <ImageElement element={element} selected={selected} />;
    case "button":
      return <ButtonElement element={element} selected={selected} />;
    case "container":
      return (
        <ContainerElement element={element} ref={containerRef} isOver={isOver}>
          {children}
        </ContainerElement>
      );
    default:
      return null;
  }
}
