import { ProjectTemplate } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TemplateStoreState = {
  context: {
    templates: ProjectTemplate[];
  };
};

type TempalteStoreActions = {
  actions: {
    saveTemplate: (template: ProjectTemplate) => void;
    removeTemplate: (templateId: string) => void;
  };
};

type TemplateStore = TemplateStoreState & TempalteStoreActions;

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      context: {
        templates: [],
      },
      actions: {
        saveTemplate: (template) => {
          set((state) => ({
            context: {
              ...state.context,
              templates: [...state.context.templates, template],
            },
          }));
        },
        removeTemplate: (id) => {
          const copiedTemplates = [...get().context.templates];
          const updatedTemplates = copiedTemplates.filter(
            (template) => template.templateId !== id,
          );
          set((state) => ({
            context: {
              ...state.context,
              templates: updatedTemplates,
            },
          }));
        },
      },
    }),
    { name: "Template Store", partialize: (state) => ({context: state.context}) },
  ),
);
