export type ElementType =
  | "text"
  | "image"
  | "shape"
  | "button"
  | "container"
  | "table";

export type AlignSelf =
  | "auto"
  | "flex-start"
  | "center"
  | "flex-end"
  | "stretch";
export type JustifySelf = "auto" | "start" | "center" | "end" | "stretch";

export interface SelfLayoutProps {
  alignSelf: AlignSelf;
  justifySelf: JustifySelf;
}

export interface TextProps extends SelfLayoutProps {
  content: string;
  fontSize: number;
  fontWeight: "normal" | "medium" | "semibold" | "bold";
  textAlign: "left" | "center" | "right" | "justify";
  color: string;
  [key: string]: unknown;
}

export interface ImageProps extends SelfLayoutProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectFit: "cover" | "contain" | "fill" | "none";
  borderRadius: number;
  [key: string]: unknown;
}

export interface ShapeProps extends SelfLayoutProps {
  shape: "rectangle" | "ellipse";
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  [key: string]: unknown;
}

export interface ButtonProps extends SelfLayoutProps {
  label: string;
  href: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  [key: string]: unknown;
}

export interface ContainerProps extends SelfLayoutProps {
  layoutMode: "flex" | "grid";
  /** Flex only. */
  direction: "row" | "column";
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between";
  /** Grid only: number of equal-width columns. */
  gridColumns: number;
  /** Grid only: horizontal alignment of each item within its own cell. */
  justifyItems: "start" | "center" | "end" | "stretch";
  /** Both modes: vertical alignment of items (row cross-axis / grid cell). */
  alignItems: "flex-start" | "center" | "flex-end" | "stretch";
  gap: number;
  padding: number;
  backgroundColor: string;
  minHeight: number;
  [key: string]: unknown;
}

export type PropsForType<T extends ElementType> = T extends "text"
  ? TextProps
  : T extends "image"
    ? ImageProps
    : T extends "shape"
      ? ShapeProps
      : T extends "button"
        ? ButtonProps
        : T extends "container"
          ? ContainerProps
          : never;

export interface PageElement {
  id: string;
  type: ElementType;
  props: Record<string, unknown>;
  /** Only containers use this; every other type omits it. */
  children?: PageElement[];
}

/** Where in the tree an element (or a drop) lives: root, or inside a container. */
export interface TreeLocation {
  parentId: string | null;
  index: number;
}

export type ProjectBaseEntity = {
  id: string;
  name: string;
};

export type TabPage = ProjectBaseEntity & {
  tabId: string;
  elements: PageElement[] | null;
};

export type ProjectTab = ProjectBaseEntity & {
  projectId: string;
  pages: TabPage[];
};

export interface DropTarget {
  parentId: string | null;
  index?: number;
}
