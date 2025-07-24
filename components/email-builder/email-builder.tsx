"use client"

import { useState, useCallback } from "react"
import { TopBar } from "./top-bar"
import { LeftSidebar } from "./left-sidebar"
import { Canvas } from "./canvas"
import { RightSidebar } from "./right-sidebar"
import { LayersPanel } from "./layers-panel"
import { SaveTemplateModal } from "./save-template-modal"
import { PreviewModal } from "./preview-modal"

export interface EmailElement {
  id: string
  type: string
  content: string
  styles: Record<string, any>
  position: { x: number; y: number }
}

export interface EmailBuilderState {
  elements: EmailElement[]
  selectedElement: string | null
  history: EmailElement[][]
  historyIndex: number
}

export function EmailBuilder() {
  const [state, setState] = useState<EmailBuilderState>({
    elements: [
      {
        id: "1",
        type: "text",
        content: "Welcome to our newsletter!",
        styles: { fontSize: "24px", fontWeight: "bold", color: "#1f2937" },
        position: { x: 50, y: 50 },
      },
      {
        id: "2",
        type: "text",
        content: "This is a sample email template. Click on any element to edit its properties.",
        styles: { fontSize: "16px", color: "#6b7280" },
        position: { x: 50, y: 120 },
      },
      {
        id: "3",
        type: "button",
        content: "Get Started",
        styles: {
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "12px 24px",
          borderRadius: "6px",
          border: "none",
        },
        position: { x: 50, y: 200 },
      },
    ],
    selectedElement: null,
    history: [],
    historyIndex: -1,
  })

  const [showLayers, setShowLayers] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const saveToHistory = useCallback(() => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1)
      newHistory.push([...prev.elements])
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    })
  }, [])

  const addElement = useCallback(
    (elementType: string, position: { x: number; y: number }) => {
      const newElement: EmailElement = {
        id: Date.now().toString(),
        type: elementType,
        content: getDefaultContent(elementType),
        styles: getDefaultStyles(elementType),
        position,
      }

      setState((prev) => ({
        ...prev,
        elements: [...prev.elements, newElement],
        selectedElement: newElement.id,
      }))
      saveToHistory()
    },
    [saveToHistory],
  )

  const updateElement = useCallback((id: string, updates: Partial<EmailElement>) => {
    setState((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    }))
  }, [])

  const deleteElement = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        elements: prev.elements.filter((el) => el.id !== id),
        selectedElement: prev.selectedElement === id ? null : prev.selectedElement,
      }))
      saveToHistory()
    },
    [saveToHistory],
  )

  const selectElement = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedElement: id }))
  }, [])

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex > 0) {
        return {
          ...prev,
          elements: [...prev.history[prev.historyIndex - 1]],
          historyIndex: prev.historyIndex - 1,
        }
      }
      return prev
    })
  }, [])

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex < prev.history.length - 1) {
        return {
          ...prev,
          elements: [...prev.history[prev.historyIndex + 1]],
          historyIndex: prev.historyIndex + 1,
        }
      }
      return prev
    })
  }, [])

  const canUndo = state.historyIndex > 0
  const canRedo = state.historyIndex < state.history.length - 1

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar
        onSave={() => setShowSaveModal(true)}
        onPreview={() => setShowPreviewModal(true)}
        onToggleLayers={() => setShowLayers(!showLayers)}
        showLayers={showLayers}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        elements={state.elements}
      />

      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />

        <div className="flex-1 flex">
          <Canvas
            elements={state.elements}
            selectedElement={state.selectedElement}
            onSelectElement={selectElement}
            onAddElement={addElement}
            onUpdateElement={updateElement}
            previewMode={previewMode}
          />

          {showLayers && (
            <LayersPanel
              elements={state.elements}
              selectedElement={state.selectedElement}
              onSelectElement={selectElement}
              onDeleteElement={deleteElement}
            />
          )}
        </div>

        <RightSidebar
          selectedElement={state.selectedElement}
          elements={state.elements}
          onUpdateElement={updateElement}
        />
      </div>

      <SaveTemplateModal open={showSaveModal} onOpenChange={setShowSaveModal} />

      <PreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        mode={previewMode}
        elements={state.elements}
      />
    </div>
  )
}

function getDefaultContent(type: string): string {
  switch (type) {
    case "text":
      return "New text element"
    case "button":
      return "Click me"
    case "image":
      return "Image placeholder"
    case "divider":
      return ""
    case "spacer":
      return ""
    default:
      return "New element"
  }
}

function getDefaultStyles(type: string): Record<string, any> {
  switch (type) {
    case "text":
      return { fontSize: "16px", color: "#1f2937", fontWeight: "normal", textAlign: "left" }
    case "button":
      return {
        backgroundColor: "#3b82f6",
        color: "white",
        padding: "12px 24px",
        borderRadius: "6px",
        border: "none",
        fontSize: "16px",
        fontWeight: "normal",
      }
    case "image":
      return { width: "200px", height: "150px" }
    case "divider":
      return { height: "1px", backgroundColor: "#e5e7eb", width: "100%" }
    case "spacer":
      return { height: "20px" }
    default:
      return {}
  }
}
