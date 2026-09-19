import { generateId } from "@/lib/id";
import { DropTarget, ElementType, PageElement, ProjectTab, TabPage } from "@/lib/types";
import { create } from "zustand";

interface ProjectState {
  id: string;
  name: string;
  tabs: ProjectTab[];
  selectedTab: ProjectTab;
  selectedPage: TabPage;
  selectedElmId: string | null;

  selectTab: (tab: ProjectTab) => void;
  addTab: () => void;
  removeTab: () => void;
  selectPage: (page: TabPage) => void;
  addPage: () => void;
  removePage: () => void;
  selectElement: (id: string | null) => void;
  addElement: (type: ElementType, target: DropTarget) => void;
  updateElementProps: (id: string, props: Record<string, unknown>) => void;
  removeElementById: (id: string) => void;
  duplicateElementById: (id: string) => void;
  moveElement: (activeId: string, target: DropTarget) => void;
}

const initialProjectId = generateId();
const initialTabId = generateId();
const initialPageId = generateId();
const initialTabs = [{
      id: initialTabId,
      name: "New Template",
      projectId: initialProjectId,
      pages: [
        { name: "page", id: initialPageId, tabId: initialTabId, elements: [] },
      ],
    }];

export const useProjectStore = create<ProjectState>((set) => ({
  id: initialProjectId,
  name: "Document Project V1",
  tabs: initialTabs,
  selectedTab: initialTabs[0],
  selectedPage: initialTabs[0].pages[0],
  selectedElmId: null,

  selectTab: (tab) => {},
  addTab: () => {},
  removeTab: () => {},
  selectPage: (page) => {},
  addPage: () => {},
  removePage: () => {},
  selectElement: (id) => {},
  addElement: (type, target) => {},
  updateElementProps: (id, props) => {},
  removeElementById: (id) => {},
  moveElement: (activeId, target) => {},
  duplicateElementById: (id) => {}
}))