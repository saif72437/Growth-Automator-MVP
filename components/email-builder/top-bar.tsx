"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Undo, Redo, Save, Download, Eye, Monitor, Smartphone, Layers, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { EmailElement } from "./email-builder"

interface TopBarProps {
  onSave: () => void
  onPreview: () => void
  onToggleLayers: () => void
  showLayers: boolean
  previewMode: "desktop" | "mobile"
  onPreviewModeChange: (mode: "desktop" | "mobile") => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  elements: EmailElement[]
}

export function TopBar({
  onSave,
  onPreview,
  onToggleLayers,
  showLayers,
  previewMode,
  onPreviewModeChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  elements,
}: TopBarProps) {
  const exportAsHTML = () => {
    const html = generateHTML(elements)
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email-template.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsMJML = () => {
    const mjml = generateMJML(elements)
    const blob = new Blob([mjml], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email-template.mjml"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">GA</span>
          </div>
          <span className="font-semibold text-gray-900">Growth Automator</span>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo}>
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onToggleLayers}>
          <Layers className="w-4 h-4 mr-2" />
          Layers
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={previewMode === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => onPreviewModeChange("desktop")}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={previewMode === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => onPreviewModeChange("mobile")}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={onPreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportAsHTML}>Export as HTML</DropdownMenuItem>
            <DropdownMenuItem onClick={exportAsMJML}>Export as MJML</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  )
}

function generateHTML(elements: EmailElement[]): string {
  const elementsHTML = elements
    .map((element) => {
      const styles = Object.entries(element.styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`)
        .join("; ")

      const position = `position: absolute; left: ${element.position.x}px; top: ${element.position.y}px;`

      switch (element.type) {
        case "text":
          return `<div style="${styles}; ${position}">${element.content}</div>`
        case "button":
          return `<button style="${styles}; ${position}">${element.content}</button>`
        case "image":
          return `<img src="/placeholder.svg?height=150&width=200" alt="${element.content}" style="${styles}; ${position}" />`
        case "divider":
          return `<hr style="${styles}; ${position}" />`
        case "spacer":
          return `<div style="${styles}; ${position}"></div>`
        default:
          return `<div style="${styles}; ${position}">${element.content}</div>`
      }
    })
    .join("\n")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif;">
  <div style="position: relative; width: 600px; margin: 0 auto; background: white;">
    ${elementsHTML}
  </div>
</body>
</html>`
}

function generateMJML(elements: EmailElement[]): string {
  const elementsXML = elements
    .map((element) => {
      switch (element.type) {
        case "text":
          return `<mj-text fontSize="${element.styles.fontSize}" color="${element.styles.color}">${element.content}</mj-text>`
        case "button":
          return `<mj-button background-color="${element.styles.backgroundColor}" color="${element.styles.color}">${element.content}</mj-button>`
        case "image":
          return `<mj-image src="/placeholder.svg?height=150&width=200" alt="${element.content}" />`
        case "divider":
          return `<mj-divider border-color="${element.styles.backgroundColor}" />`
        case "spacer":
          return `<mj-spacer height="${element.styles.height}" />`
        default:
          return `<mj-text>${element.content}</mj-text>`
      }
    })
    .join("\n      ")

  return `
<mjml>
  <mj-head>
    <mj-title>Email Template</mj-title>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        ${elementsXML}
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`
}
