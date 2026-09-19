"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Download,
  Eye,
  Plus,
  Redo,
  Save,
  Undo,
  X,
} from "lucide-react";
import Editor from "../components/editor/Editor";
import { useProjectStore } from "@/store/projectsStore";


export default function ProjectPage() {
  const tabs = useProjectStore((s) => s.tabs)
  // const setTabs = useProjectStore((s) => s.ad)
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  // const handleNewTab = () => {
  //   setTabs((prevState) => [
  //     ...prevState,
  //     {
  //       name: "Template",
  //       serial: prevState.length + 1,
  //       uuid: generateId(),
  //       pages: [],
  //     },
  //   ]);
  // };
  // const handleSeletedButon = (item: (typeof tabs)[0]) => {
  //   setSelectedTab(item);
  // };
  // const handleRemoveTab = (item: (typeof tabs)[0]) => {
  //   const copiedTabs = [...tabs];
  //   const updatedTabs = copiedTabs.filter((tab) => tab.uuid !== item.uuid);
  //   setTabs(updatedTabs);
  // };
  return (
    <div className="px-8 py-5 grid min-h-dvh grid-rows-[auto_minmax(0,1fr)] bg-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="project-info flex items-center space-x-2">
          <div className="logo">
            <h2>Document Editor (PoC)</h2>
          </div>
          <div className="project-name">Document Project V1</div>
          <div className="undo-redo-actions flex items-center space-x-3">
            <Button variant="ghost">
              <Undo />
            </Button>
            <Button variant="ghost">
              <Redo />
            </Button>
          </div>
        </div>
        <div className="project-actions flex items-center space-x-3">
          <Button variant="outline">
            <span>
              <Eye />
            </span>
            <span>Preview</span>
          </Button>
          <Button variant="outline_primay">
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
        <div className="tabs flex items-center space-x-1">
          {tabs.map((tab, idx) => {
            return (
              <div
                key={tab.id}
                className="flex items-center space-x-5 text-sm shadow px-2 py-1"
              >
                <span
                  role="button"
                  // onClick={() => handleSeletedButon(tab)}
                  className="text-primary"
                >
                  {tab.name} {idx + 1}
                </span>
                {idx !== 0 && (
                  <span
                    role="button"
                    className="text-gray-400"
                    // onClick={() => handleRemoveTab(tab)}
                  >
                    <X size={16} />
                  </span>
                )}
              </div>
            );
          })}
          <button 
          // onClick={handleNewTab}
          >
            <Plus />
          </button>
        </div>
        {/* Editor */}
        {selectedTab.id && (
          <>
            <Editor />
          </>
        )}
      </main>
    </div>
  );
}
