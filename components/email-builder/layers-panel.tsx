"use client"

import { Button } from "@/components/ui/button"
import { Eye, Type, ImageIcon, MousePointer, Trash2, Minus, Space } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EmailElement } from "./email-builder"

interface LayersPanelProps {
  elements: EmailElement[]
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onDeleteElement: (id: string) => void
}

export function LayersPanel({ elements, selectedElement, onSelectElement, onDeleteElement }: LayersPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "button":
        return <MousePointer className="w-4 h-4" />
      case "divider":
        return <Minus className="w-4 h-4" />
      case "spacer":
        return <Space className="w-4 h-4" />
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded" />
    }
  }

  const getElementName = (element: EmailElement) => {
    switch (element.type) {
      case "text":
        return element.content.length > 20 ? `${element.content.substring(0, 20)}...` : element.content
      case "button":
        return `Button: ${element.content}`
      case "image":
        return "Image"
      case "divider":
        return "Divider"
      case "spacer":
        return "Spacer"
      default:
        return element.type
    }
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Layers</h2>
        <p className="text-sm text-gray-500 mt-1">{elements.length} elements</p>
      </div>

      <div className="p-2 space-y-1">
        {elements.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No elements yet</p>
            <p className="text-xs">Add elements from the sidebar</p>
          </div>
        ) : (
          elements.map((element) => (
            <div
              key={element.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 group",
                selectedElement === element.id && "bg-blue-50 border border-blue-200",
              )}
              onClick={() => onSelectElement(element.id)}
            >
              <div className="text-gray-400">{getIcon(element.type)}</div>

              <span className="flex-1 text-sm font-medium text-gray-900 truncate">{getElementName(element)}</span>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Eye className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteElement(element.id)
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
