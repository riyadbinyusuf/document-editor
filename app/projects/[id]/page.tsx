"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Plus, Save, X } from "lucide-react";
import Editor from "../components/editor/Editor";
import { useProjectStore } from "@/store/projectsStore";
import { cn } from "@/lib/utils";
import UndoRedoControls from "../components/editor/UndoRedoControl";
import { useTemplateStore } from "@/store/templateStore";
import { generateId } from "@/lib/id";

export default function ProjectPage() {
  const tabs = useProjectStore((s) => s.context.tabs);
  const selectedTabId = useProjectStore((s) => s.context.selectedTabId);
  const selectTab = useProjectStore((s) => s.actions.selectTab);
  const addTab = useProjectStore((s) => s.actions.addTab);
  const removeTab = useProjectStore((s) => s.actions.removeTab);
  const loadTemplate = useProjectStore((s) => s.actions.loadTemplate);

  const saveTemplate = useTemplateStore((state) => state.actions.saveTemplate);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const applySavedTemplate = () => {
      if (hasLoadedRef.current) return;
      const templates = useTemplateStore.getState().context.templates;
      if (templates && templates.length > 0) {
        const latestTemplate = templates[templates.length - 1];
        loadTemplate(latestTemplate);
        hasLoadedRef.current = true;
      }
    };

    if (useTemplateStore.persist.hasHydrated()) {
      applySavedTemplate();
    }

    const unsub = useTemplateStore.persist.onFinishHydration(() => {
      applySavedTemplate();
    });

    return () => unsub();
  }, [loadTemplate]);

  const handleSaveTemplate = () => {
    const currentTemplate = useProjectStore.getState().context;
    saveTemplate({
      ...currentTemplate,
      created_at: Date.now(),
      templateId: generateId("template"),
      templateName: "Template-1",
    });
  };

  return (
    <div className="px-8 py-5 grid min-h-dvh grid-rows-[auto_minmax(0,1fr)] bg-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between mb-2">
        <div className="project-info flex items-center space-x-5">
          <div className="logo flex items-center space-x-3">
            <FileText className="text-primary" />
            <h2 className="font-bold text-xl">Document Editor (PoC)</h2>
          </div>
          <div className="undo-redo-actions flex items-center space-x-3">
            <div className="project-name">Document Project V1</div>
            <UndoRedoControls />
          </div>
        </div>
        <div className="project-actions flex items-center space-x-3">
          <Button variant="outline">
            <span>
              <Eye />
            </span>
            <span>Preview</span>
          </Button>
          <Button variant="outline_primay" onClick={handleSaveTemplate}>
            <span>
              <Save />
            </span>
            <span>Save</span>
          </Button>
          <Button>
            <span>
              <Download />
            </span>
            <span>Download PDF</span>
          </Button>
        </div>
      </header>
      <main className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] space-y-3">
        {/* Tabs */}
        <div className="tabs flex items-center border-y">
          {tabs.map((tab, idx) => {
            return (
              <div
                key={tab.id}
                className={cn(
                  "flex items-center space-x-5 text-sm shadow px-3 py-1.5",
                  selectedTabId === tab.id
                    ? "bg-white font-medium"
                    : "font-normal",
                )}
              >
                <span
                  role="button"
                  onClick={() => selectTab(tab)}
                  className="text-primary"
                >
                  {tab.name}
                </span>
                {idx !== 0 && (
                  <span
                    role="button"
                    className="text-gray-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTab(tab.id);
                    }}
                  >
                    <X size={16} />
                  </span>
                )}
              </div>
            );
          })}
          <button onClick={addTab} className="pl-3">
            <Plus size={16} />
          </button>
        </div>
        {/* Editor */}
        {selectedTabId && (
          <>
            <Editor />
          </>
        )}
      </main>
    </div>
  );
}
