"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Type, ImageIcon, MousePointer, Minus, Space, Columns, Square, Circle } from "lucide-react"

const elements = [
  { id: "text", name: "Text", icon: Type, description: "Add text content" },
  { id: "image", name: "Image", icon: ImageIcon, description: "Insert an image" },
  { id: "button", name: "Button", icon: MousePointer, description: "Call-to-action button" },
  { id: "divider", name: "Divider", icon: Minus, description: "Horizontal line" },
  { id: "spacer", name: "Spacer", icon: Space, description: "Add vertical space" },
  { id: "columns", name: "Columns", icon: Columns, description: "Multi-column layout" },
]

const layouts = [
  { id: "container", name: "Container", icon: Square, description: "Content wrapper" },
  { id: "section", name: "Section", icon: Circle, description: "Content section" },
]

export function LeftSidebar() {
  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData("text/plain", elementType)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Elements</h2>
        <p className="text-sm text-gray-500 mt-1">Drag elements to the canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Content</h3>
          <div className="space-y-2">
            {elements.map((element) => (
              <Card
                key={element.id}
                className="p-3 cursor-grab hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => handleDragStart(e, element.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <element.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{element.name}</p>
                    <p className="text-xs text-gray-500 truncate">{element.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Layout</h3>
          <div className="space-y-2">
            {layouts.map((layout) => (
              <Card
                key={layout.id}
                className="p-3 cursor-grab hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => handleDragStart(e, layout.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <layout.icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{layout.name}</p>
                    <p className="text-xs text-gray-500 truncate">{layout.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
