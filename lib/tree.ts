import type { PageElement } from "./types";
import { generateId } from "./id";


export function findElement(
  tree: PageElement[],
  id: string,
): PageElement | null {
  for (const el of tree) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElement(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function findContainingList(
  tree: PageElement[],
  id: string,
): { list: PageElement[]; index: number; parentId: string | null } | null {
  const rootIndex = tree.findIndex((el) => el.id === id);
  if (rootIndex !== -1) {
    return { list: tree, index: rootIndex, parentId: null };
  }
  for (const el of tree) {
    if (el.children) {
      const childIndex = el.children.findIndex((c) => c.id === id);
      if (childIndex !== -1) {
        return { list: el.children, index: childIndex, parentId: el.id };
      }
      const nested = findContainingList(el.children, id);
      if (nested) return nested;
    }
  }
  return null;
}

export function findParentContainer(
  tree: PageElement[],
  id: string,
): PageElement | null {
  const info = findContainingList(tree, id);
  if (!info || !info.parentId) return null;
  const parent = findElement(tree, info.parentId);
  if (!parent) return null;
  if (parent.type === "container") return parent;
  return findParentContainer(tree, parent.id);
}


export function getListForParent(
  tree: PageElement[],
  parentId: string | null,
): PageElement[] | null {
  if (parentId === null) return tree;
  const parent = findElement(tree, parentId);
  if (!parent) return null;
  return parent.children ?? [];
}


export function resolveInsertIndex(
  list: PageElement[],
  beforeId?: string | null,
): number {
  if (!beforeId) return list.length;
  const idx = list.findIndex((el) => el.id === beforeId);
  return idx === -1 ? list.length : idx;
}

export function removeElement(
  tree: PageElement[],
  id: string,
): { tree: PageElement[]; removed: PageElement | null } {
  let removed: PageElement | null = null;

  function recurse(list: PageElement[]): PageElement[] {
    const next: PageElement[] = [];
    for (const el of list) {
      if (el.id === id) {
        removed = el;
        continue;
      }
      if (el.children) {
        next.push({ ...el, children: recurse(el.children) });
      } else {
        next.push(el);
      }
    }
    return next;
  }

  const nextTree = recurse(tree);
  return { tree: nextTree, removed };
}

export function insertElement(
  tree: PageElement[],
  parentId: string | null,
  index: number | undefined | null,
  element: PageElement,
): PageElement[] {
  if (parentId === null) {
    const next = [...tree];
    const targetIdx = index != null && !Number.isNaN(index) ? index : next.length;
    next.splice(clamp(targetIdx, 0, next.length), 0, element);
    return next;
  }
  function recurse(list: PageElement[]): PageElement[] {
    return list.map((el) => {
      if (el.id === parentId) {
        const children = el.children ? [...el.children] : [];
        const targetIdx = index != null && !Number.isNaN(index) ? index : children.length;
        children.splice(clamp(targetIdx, 0, children.length), 0, element);
        return { ...el, children };
      }
      if (el.children) {
        return { ...el, children: recurse(el.children) };
      }
      return el;
    });
  }
  return recurse(tree);
}

export function updateElement(
  tree: PageElement[],
  id: string,
  props: Record<string, unknown>,
): PageElement[] {
  function recurse(list: PageElement[]): PageElement[] {
    return list.map((el) => {
      if (el.id === id) {
        return { ...el, props: { ...el.props, ...props } };
      }
      if (el.children) {
        return { ...el, children: recurse(el.children) };
      }
      return el;
    });
  }
  return recurse(tree);
}

function cloneWithNewIds(element: PageElement): PageElement {
  return {
    ...element,
    id: generateId(element.type),
    props: { ...element.props },
    children: element.children
      ? element.children.map(cloneWithNewIds)
      : undefined,
  };
}

export function duplicateElement(
  tree: PageElement[],
  id: string,
): { tree: PageElement[]; newId: string | null } {
  const location = findContainingList(tree, id);
  if (!location) return { tree, newId: null };

  const original = location.list[location.index];
  const clone = cloneWithNewIds(original);

  const nextTree = insertElement(
    tree,
    location.parentId,
    location.index + 1,
    clone,
  );

  return { tree: nextTree, newId: clone.id };
}

export function isSameOrDescendant(
  root: PageElement,
  targetId: string,
): boolean {
  if (root.id === targetId) return true;
  if (!root.children) return false;
  return root.children.some((c) => isSameOrDescendant(c, targetId));
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
