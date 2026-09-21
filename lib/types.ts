export type ElementType =
  | "text"
  | "image"
  | "shape"
  | "button"
  | "container"
  | "table";

export type SizeUnit = "px" | "%" | "auto";

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

export type FontWeight = "normal" | "medium" | "semibold" | "bold";
export type TextAlign = "left" | "center" | "right" | "justify";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export interface TypographyProps {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: TextAlign;
  textTransform?: TextTransform;
  color?: string;
}

export interface TextProps extends SelfLayoutProps, TypographyProps {
  content: string;
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

export interface ButtonProps extends SelfLayoutProps, TypographyProps {
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

export interface ContainerProps extends SelfLayoutProps, TypographyProps {
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
  minHeightUnit: SizeUnit;
  width?: number;
  widthUnit?: SizeUnit;
  height?: number;
  heightUnit?: SizeUnit;
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

export type ProjectTemplate = {
  id: string;
  name: string;
  tabs: ProjectTab[];
  selectedTabId?: string;
  selectedPageId?: string;
  selectedElmId?: string | null;
  created_at: string | number;
  templateId: string;
  templateName: string;
};

export type ProjectStoreContext = {
  id: string;
  name: string;
  tabs: ProjectTab[];
  selectedTabId: string;
  selectedPageId: string;
  selectedElmId: string | null;
};