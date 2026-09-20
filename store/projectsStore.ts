import { createElement } from "@/lib/elementsRegistry";
import { generateId } from "@/lib/id";
import {
  duplicateElement,
  insertElement,
  removeElement,
  updateElement,
  findElement,
  isSameOrDescendant,
} from "@/lib/tree";
import {
  DropTarget,
  ElementType,
  PageElement,
  ProjectTab,
  TabPage,
} from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProjectStoreState = {
  id: string;
  name: string;
  tabs: ProjectTab[];
  selectedTab: ProjectTab;
  selectedPage: TabPage;
  selectedElmId: string | null;
};

type ProjectStoreActions = {
  selectTab: (tab: ProjectTab) => void;
  addTab: () => void;
  removeTab: (tabId: string) => void;
  selectPage: (page: TabPage) => void;
  addPage: () => void;
  removePage: (pageId: string) => void;
  selectElement: (id: string | null) => void;
  addElement: (type: ElementType, target: DropTarget) => void;
  updateElementProps: (id: string, props: Record<string, unknown>) => void;
  removeElementById: (id: string) => void;
  duplicateElementById: (id: string) => void;
  moveElement: (activeId: string, target: DropTarget) => void;
};

type ProjectStore = ProjectStoreState & ProjectStoreActions;

const initialProjectId = generateId("project");
const initialTabId = generateId("template-1");
const initialPageId = generateId("page-1");
const initialTabs = [
  {
    id: initialTabId,
    name: "New Template",
    projectId: initialProjectId,
    pages: [
      { name: "page", id: initialPageId, tabId: initialTabId, elements: [] },
    ],
  },
];

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      id: initialProjectId,
      name: "Document Project V1",
      tabs: initialTabs,
      selectedTab: initialTabs[0],
      selectedPage: initialTabs[0].pages[0],
      selectedElmId: null,

      selectTab: (tab) =>
        set({
          selectedTab: tab,
          selectedPage: tab.pages[0],
          selectedElmId: null,
        }),
      addTab: () => {
        const { tabs, id } = get();
        const newTabId = generateId();
        const newPageId = generateId();
        const newTab: ProjectTab = {
          id: newTabId,
          name: `Template ${tabs.length + 1}`,
          projectId: id,
          pages: [
            { name: "page", id: newPageId, tabId: newTabId, elements: [] },
          ],
        };
        set({
          tabs: [...tabs, newTab],
          selectedTab: newTab,
          selectedPage: newTab.pages[0],
          selectedElmId: null,
        });
      },
      removeTab: (tabId) => {
        const { tabs, selectedTab } = get();
        if (tabs.length <= 1) return;
        const remainingTabs = tabs.filter((t) => t.id !== tabId);
        const nextSelected =
          selectedTab.id === tabId ? remainingTabs[0] : selectedTab;
        set({
          tabs: remainingTabs,
          selectedTab: nextSelected,
          selectedPage: nextSelected.pages[0],
          selectedElmId: null,
        });
      },
      selectPage: (page) => set({ selectedPage: page, selectedElmId: null }),
      addPage: () => {
        const { tabs, selectedTab } = get();
        const newPageId = generateId();
        const newPage: TabPage = {
          name: `Page ${selectedTab.pages.length + 1}`,
          id: newPageId,
          tabId: selectedTab.id,
          elements: [],
        };
        const updatedTab = {
          ...selectedTab,
          pages: [...selectedTab.pages, newPage],
        };
        const updatedTabs = tabs.map((t) =>
          t.id === selectedTab.id ? updatedTab : t,
        );
        set({
          tabs: updatedTabs,
          selectedTab: updatedTab,
          selectedPage: newPage,
        });
      },
      removePage: (pageId) => {
        const { tabs, selectedTab } = get();
        if (selectedTab.pages.length <= 1) return;
        const remainingPages = selectedTab.pages.filter((p) => p.id !== pageId);
        const updatedTab = { ...selectedTab, pages: remainingPages };
        const updatedTabs = tabs.map((t) =>
          t.id === selectedTab.id ? updatedTab : t,
        );
        set({
          tabs: updatedTabs,
          selectedTab: updatedTab,
          selectedPage: remainingPages[0],
          selectedElmId: null,
        });
      },
      selectElement: (id) => set({ selectedElmId: id }),
      addElement: (type, target) => {
        const { tabs, selectedPage } = get();
        const currentElements = selectedPage.elements ?? [];
        const newElement = createElement(type);
        const insertIndex =
          target.index !== undefined ? target.index : currentElements.length;
        const newElements = insertElement(
          currentElements,
          target.parentId,
          insertIndex,
          newElement,
        );
        const { updatedTabs, updatedPage } = updatePageElements(
          tabs,
          selectedPage,
          newElements,
        );
        set({
          tabs: updatedTabs,
          selectedPage: updatedPage,
          selectedElmId: newElement.id,
        });
      },
      moveElement: (activeId, target) => {
        if (activeId === target.parentId) return;
        const { tabs, selectedPage } = get();
        const currentElements = selectedPage.elements ?? [];

        if (target.parentId !== null) {
          const activeEl = findElement(currentElements, activeId);
          if (activeEl && isSameOrDescendant(activeEl, target.parentId)) {
            return;
          }
        }

        const { tree: treeWithoutActive, removed } = removeElement(
          currentElements,
          activeId,
        );
        if (!removed) return;
        const insertIndex = target.index !== undefined ? target.index : 0;
        const newElements = insertElement(
          treeWithoutActive,
          target.parentId,
          insertIndex,
          removed,
        );
        const { updatedTabs, updatedPage } = updatePageElements(
          tabs,
          selectedPage,
          newElements,
        );
        set({
          tabs: updatedTabs,
          selectedPage: updatedPage,
        });
      },
      updateElementProps: (id, patch) => {
        const { tabs, selectedPage } = get();
        const currentElements = selectedPage.elements ?? [];
        const newElements = updateElement(currentElements, id, patch);
        const { updatedTabs, updatedPage } = updatePageElements(
          tabs,
          selectedPage,
          newElements,
        );
        set({
          tabs: updatedTabs,
          selectedPage: updatedPage,
        });
      },
      removeElementById: (id) => {
        const { tabs, selectedPage, selectedElmId } = get();
        const currentElements = selectedPage.elements ?? [];
        const { tree: newElements } = removeElement(currentElements, id);
        const { updatedTabs, updatedPage } = updatePageElements(
          tabs,
          selectedPage,
          newElements,
        );
        set({
          tabs: updatedTabs,
          selectedPage: updatedPage,
          selectedElmId: selectedElmId === id ? null : selectedElmId,
        });
      },
      duplicateElementById: (id) => {
        const { tabs, selectedPage } = get();
        const currentElements = selectedPage.elements ?? [];
        const { tree: newElements, newId } = duplicateElement(
          currentElements,
          id,
        );
        const { updatedTabs, updatedPage } = updatePageElements(
          tabs,
          selectedPage,
          newElements,
        );
        set({
          tabs: updatedTabs,
          selectedPage: updatedPage,
          selectedElmId: newId,
        });
      },
    }),
    { name: "project-store" },
  ),
);

function updatePageElements(
  tabs: ProjectTab[],
  selectedPage: TabPage,
  newElements: PageElement[],
) {
  const updatedPage = { ...selectedPage, elements: newElements };
  const updatedTabs = tabs.map((tab) => {
    if (tab.id !== selectedPage.tabId) return tab;
    return {
      ...tab,
      pages: tab.pages.map((p) => (p.id === selectedPage.id ? updatedPage : p)),
    };
  });
  return { updatedTabs, updatedPage };
}
