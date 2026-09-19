import {
  Type,
  Image as ImageIcon,
  Square,
  MousePointerClick,
  LayoutTemplate,
  type LucideIcon,
  Table,
} from "lucide-react";
import type { ElementType, PageElement } from "./types";
import { generateId } from "./id";

export interface ElementDefinition {
  type: ElementType;
  label: string;
  icon: LucideIcon;
  acceptsChildren: boolean;
  defaultProps: () => Record<string, unknown>;
}

export const ELEMENT_REGISTRY: Record<ElementType, ElementDefinition> = {
  text: {
    type: "text",
    label: "Text",
    icon: Type,
    acceptsChildren: false,
    defaultProps: () => ({
      content: "Add your text here",
      fontSize: 16,
      fontWeight: "normal",
      textAlign: "left",
      color: "#1e293b",
      alignSelf: "auto",
      justifySelf: "auto",
    }),
  },
  image: {
    type: "image",
    label: "Image",
    icon: ImageIcon,
    acceptsChildren: false,
    defaultProps: () => ({
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      alt: "Placeholder image",
      width: 100,
      height: 240,
      objectFit: "cover",
      borderRadius: 8,
      alignSelf: "auto",
      justifySelf: "auto",
    }),
  },
  shape: {
    type: "shape",
    label: "Shape",
    icon: Square,
    acceptsChildren: false,
    defaultProps: () => ({
      shape: "rectangle",
      width: 160,
      height: 100,
      backgroundColor: "#4C5BD4",
      borderColor: "#1e293b",
      borderWidth: 0,
      borderRadius: 8,
      alignSelf: "auto",
      justifySelf: "auto",
    }),
  },
  button: {
    type: "button",
    label: "Button",
    icon: MousePointerClick,
    acceptsChildren: false,
    defaultProps: () => ({
      label: "Click me",
      href: "#",
      backgroundColor: "#4C5BD4",
      textColor: "#ffffff",
      fontSize: 14,
      borderRadius: 6,
      paddingX: 18,
      paddingY: 10,
      alignSelf: "auto",
      justifySelf: "auto",
    }),
  },
  container: {
    type: "container",
    label: "Container",
    icon: LayoutTemplate,
    acceptsChildren: true,
    defaultProps: () => ({
      layoutMode: "flex",
      direction: "column",
      gap: 12,
      padding: 16,
      backgroundColor: "transparent",
      justifyContent: "flex-start",
      // "stretch" is what makes children fill the section by default (a
      // paragraph spans the width, a row of buttons shares full height);
      // any single child can still opt out via its own Align self control.
      alignItems: "stretch",
      gridColumns: 3,
      justifyItems: "stretch",
      minHeight: 80,
      alignSelf: "auto",
      justifySelf: "auto",
    }),
  },
  table: {
    type: "table",
    label: "Table",
    icon: Table,
    acceptsChildren: true,
    defaultProps: () => ({})
  }
};

export const DRAGGABLE_ELEMENT_TYPES: ElementType[] = [
  "text",
  "image",
  "shape",
  "button",
  "container",
  "table"
];

export function createElement(type: ElementType): PageElement {
  const def = ELEMENT_REGISTRY[type];
  return {
    id: generateId(type),
    type,
    props: def.defaultProps(),
    children: def.acceptsChildren ? [] : undefined,
  };
}
