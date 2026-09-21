import { createElement } from "@/lib/elementsRegistry";
import { generateId } from "@/lib/id";
import {
  duplicateElement,
  insertElement,
  removeElement,
  updateElement,
  findElement,
  isSameOrDescendant,
  getListForParent,
  findContainingList,
  MoveDirection,
  getMovementTarget,
} from "@/lib/tree";
import {
  DropTarget,
  ElementType,
  PageElement,
  ProjectStoreContext,
  ProjectTab,
  ProjectTemplate,
  TabPage,
} from "@/lib/types";
import { create } from "zustand";
import { temporal } from "zundo";
import { defaultTemplate } from "@/lib/constants";

type ProjectStoreState = {
  context: ProjectStoreContext;
};

type ProjectStoreActions = {
  actions: {
    selectTab: (tab: ProjectTab | string) => void;
    addTab: () => void;
    removeTab: (tabId: string) => void;
    selectPage: (page: TabPage | string) => void;
    addPage: () => void;
    removePage: (pageId: string) => void;
    selectElement: (id: string | null) => void;
    addElement: (type: ElementType, target: DropTarget) => void;
    updateElementProps: (id: string, props: Record<string, unknown>) => void;
    removeElementById: (id: string) => void;
    duplicateElementById: (id: string) => void;
    moveElement: (activeId: string, target: DropTarget) => void;
    moveElementDirection: (id: string, direction: MoveDirection) => void;
    saveStore: () => void;
    loadStore: () => void;
    loadTemplate: (template: ProjectTemplate) => void;
  };
};

export type ProjectStore = ProjectStoreState & ProjectStoreActions;

export const selectActiveTab = (state: ProjectStore): ProjectTab => {
  const { tabs, selectedTabId } = state.context;
  return tabs.find((t) => t.id === selectedTabId) ?? tabs[0];
};

export const selectActivePage = (state: ProjectStore): TabPage => {
  const tab = selectActiveTab(state);
  return (
    tab?.pages.find((p) => p.id === state.context.selectedPageId) ??
    tab?.pages[0]
  );
};

export const selectActiveElements = (state: ProjectStore): PageElement[] => {
  return selectActivePage(state)?.elements ?? [];
};

const STORAGE_KEY = "project-store";

export const useProjectStore = create<ProjectStore>()(
  temporal(
    (set, get) => ({
      context: defaultTemplate,

      actions: {
        selectTab: (tabOrId) => {
          const tabId = typeof tabOrId === "string" ? tabOrId : tabOrId.id;
          const { tabs } = get().context;
          const targetTab = tabs.find((t) => t.id === tabId) ?? tabs[0];
          set((state) => ({
            context: {
              ...state.context,
              selectedTabId: targetTab.id,
              selectedPageId: targetTab.pages[0]?.id ?? "",
              selectedElmId: null,
            },
          }));
        },

        addTab: () => {
          const { tabs, id } = get().context;
          const newTabId = generateId();
          const newPageId = generateId();
          const newTab: ProjectTab = {
            id: newTabId,
            name: `Template-${tabs.length + 1}`,
            projectId: id,
            pages: [
              { name: "Page", id: newPageId, tabId: newTabId, elements: [] },
            ],
          };
          set((state) => ({
            context: {
              ...state.context,
              tabs: [...tabs, newTab],
              selectedTabId: newTabId,
              selectedPageId: newPageId,
              selectedElmId: null,
            },
          }));
        },

        removeTab: (tabId) => {
          const { tabs, selectedTabId } = get().context;
          if (tabs.length <= 1) return;
          const remainingTabs = tabs.filter((t) => t.id !== tabId);
          const nextSelected =
            selectedTabId === tabId
              ? remainingTabs[0]
              : tabs.find((t) => t.id === selectedTabId) ?? remainingTabs[0];
          set((state) => ({
            context: {
              ...state.context,
              tabs: remainingTabs,
              selectedTabId: nextSelected.id,
              selectedPageId: nextSelected.pages[0]?.id ?? "",
              selectedElmId: null,
            },
          }));
        },

        selectPage: (pageOrId) => {
          const pageId = typeof pageOrId === "string" ? pageOrId : pageOrId.id;
          set((state) => ({
            context: {
              ...state.context,
              selectedPageId: pageId,
              selectedElmId: null,
            },
          }));
        },

        addPage: () => {
          const { tabs, selectedTabId } = get().context;
          const newPageId = generateId();
          const updatedTabs = tabs.map((tab) => {
            if (tab.id !== selectedTabId) return tab;
            const newPage: TabPage = {
              name: `Page ${tab.pages.length + 1}`,
              id: newPageId,
              tabId: tab.id,
              elements: [],
            };
            return {
              ...tab,
              pages: [...tab.pages, newPage],
            };
          });
          set((state) => ({
            context: {
              ...state.context,
              tabs: updatedTabs,
              selectedPageId: newPageId,
            },
          }));
        },

        removePage: (pageId) => {
          const { tabs, selectedTabId, selectedPageId } = get().context;
          const currentTab = tabs.find((t) => t.id === selectedTabId);
          if (!currentTab || currentTab.pages.length <= 1) return;
          const remainingPages = currentTab.pages.filter((p) => p.id !== pageId);
          const nextSelectedPageId =
            selectedPageId === pageId ? remainingPages[0].id : selectedPageId;
          const updatedTabs = tabs.map((t) =>
            t.id === selectedTabId ? { ...t, pages: remainingPages } : t,
          );
          set((state) => ({
            context: {
              ...state.context,
              tabs: updatedTabs,
              selectedPageId: nextSelectedPageId,
              selectedElmId: null,
            },
          }));
        },

        selectElement: (id) =>
          set((state) => ({
            context: {
              ...state.context,
              selectedElmId: id,
            },
          })),

        addElement: (type, target) => {
          const { tabs, selectedTabId, selectedPageId } = get().context;
          const activeElements = selectActiveElements(get());
          const newElement = createElement(type);
          const insertIndex =
            target.index !== undefined ? target.index : activeElements.length;
          const updatedTabs = updateActivePageElements(
            tabs,
            selectedTabId,
            selectedPageId,
            (elements) =>
              insertElement(elements, target.parentId, insertIndex, newElement),
          );
          set((state) => ({
            context: {
              ...state.context,
              tabs: updatedTabs,
              selectedElmId: newElement.id,
            },
          }));
        },

        moveElement: (activeId, target) => {
          if (activeId === target.parentId) return;
          const { tabs, selectedTabId, selectedPageId } = get().context;
          const activeElements = selectActiveElements(get());

          if (target.parentId !== null) {
            const activeEl = findElement(activeElements, activeId);
            if (activeEl && isSameOrDescendant(activeEl, target.parentId)) {
              return;
            }
          }

          const sourceInfo = findContainingList(activeElements, activeId);
          const oldParentId = sourceInfo?.parentId ?? null;
          const oldIndex = sourceInfo?.index ?? -1;

          const { tree: treeWithoutActive, removed } = removeElement(
            activeElements,
            activeId,
          );
          if (!removed) return;
          const targetList =
            getListForParent(treeWithoutActive, target.parentId) ?? [];
          let insertIndex =
            target.index !== undefined ? target.index : targetList.length;
          if (
            oldParentId === target.parentId &&
            oldIndex !== -1 &&
            oldIndex < insertIndex
          ) {
            insertIndex = insertIndex - 1;
          }
          const updatedTabs = updateActivePageElements(
            tabs,
            selectedTabId,
            selectedPageId,
            () =>
              insertElement(
                treeWithoutActive,
                target.parentId,
                insertIndex,
                removed,
              ),
          );
          set((state) => ({
            context: {
              ...state.context,
              tabs: updatedTabs,
            },
          }));
        },

        moveElementDirection: (id, direction) => {
          const activeElements = selectActiveElements(get());
          const target = getMovementTarget(activeElements, id, direction);
          if (!target) return;
          get().actions.moveElement(id, target);
        },

        updateElementProps: (id, patch) => {
          const { tabs, selectedTabId, selectedPageId } = get().context;
          const updatedTabs = updateActivePageElements(
            tabs,
            selectedTabId,
            selectedPageId,
            (elements) => updateElement(elements, id, patch),
          );
          set((state) => ({
            context: {
              ...state.context,
              tabs: updatedTabs,
            },
          }));
        },

        removeElementById: (id) => {
          const { tabs, selectedTabId, selectedPageId, selectedElmId } =
            get().context;
          const updatedTabs = updateActivePageElements(
            tabs,
            selectedTabId,
            selectedPageId,
            (elements) => removeElement(elements, id).tree,
          );
          set((state) => ({
            context: {
              ...state.context,
              tabs: updatedTabs,
              selectedElmId: selectedElmId === id ? null : selectedElmId,
            },
          }));
        },

        duplicateElementById: (id) => {
          const { tabs, selectedTabId, selectedPageId } = get().context;
          let duplicatedId: string | null = null;
          const updatedTabs = updateActivePageElements(
            tabs,
            selectedTabId,
            selectedPageId,
            (elements) => {
              const { tree, newId } = duplicateElement(elements, id);
              duplicatedId = newId;
              return tree;
            },
          );
          set((state) => ({
            context: {
              ...state.context,
              tabs: updatedTabs,
              selectedElmId: duplicatedId,
            },
          }));
        },

        saveStore: () => {
          if (typeof window === "undefined") return;
          try {
            const { context } = get();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
          } catch (error) {
            console.error("Failed to save store to localStorage:", error);
          }
        },

        loadStore: () => {
          if (typeof window === "undefined") return;
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const loadedContext =
              parsed?.state?.context ?? parsed?.context ?? parsed;
            if (
              loadedContext &&
              Array.isArray(loadedContext.tabs) &&
              loadedContext.tabs.length > 0
            ) {
              const firstTab = loadedContext.tabs[0];
              const selectedTabId =
                loadedContext.selectedTabId ??
                loadedContext.selectedTab?.id ??
                firstTab.id;
              const targetTab =
                loadedContext.tabs.find(
                  (t: ProjectTab) => t.id === selectedTabId,
                ) ?? firstTab;
              const selectedPageId =
                loadedContext.selectedPageId ??
                loadedContext.selectedPage?.id ??
                targetTab.pages[0]?.id ??
                "";

              set((state) => ({
                context: {
                  ...state.context,
                  id: loadedContext.id ?? state.context.id,
                  name: loadedContext.name ?? state.context.name,
                  tabs: loadedContext.tabs,
                  selectedTabId,
                  selectedPageId,
                  selectedElmId: null,
                },
              }));
            }
          } catch (error) {
            console.error("Failed to load store from localStorage:", error);
          }
        },

        loadTemplate: (template) => {
          if (!template || !template.tabs || template.tabs.length === 0) return;

          const firstTab = template.tabs[0];
          const selectedTabId = template.selectedTabId ?? firstTab.id;
          const targetTab =
            template.tabs.find((t) => t.id === selectedTabId) ?? firstTab;
          const selectedPageId =
            template.selectedPageId ?? targetTab.pages[0]?.id ?? "";

          set((state) => ({
            context: {
              ...state.context,
              id: template.id ?? state.context.id,
              name: template.name ?? state.context.name,
              tabs: template.tabs,
              selectedTabId,
              selectedPageId,
              selectedElmId: null,
            },
          }));

          useProjectStore.temporal.getState().clear();
        },
      },
    }),
    {
      limit: 50,
      partialize: (state) => ({
        context: {
          id: state.context.id,
          name: state.context.name,
          tabs: state.context.tabs,
        },
      }),
    },
  ),
);

function updateActivePageElements(
  tabs: ProjectTab[],
  selectedTabId: string,
  selectedPageId: string,
  updater: (elements: PageElement[]) => PageElement[],
): ProjectTab[] {
  return tabs.map((tab) => {
    if (tab.id !== selectedTabId) return tab;
    return {
      ...tab,
      pages: tab.pages.map((p) => {
        if (p.id !== selectedPageId) return p;
        return {
          ...p,
          elements: updater(p.elements ?? []),
        };
      }),
    };
  });
}
