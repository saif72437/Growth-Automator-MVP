"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { EmailElement } from "./email-builder"

interface CanvasProps {
  elements: EmailElement[]
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onAddElement: (type: string, position: { x: number; y: number }) => void
  onUpdateElement: (id: string, updates: Partial<EmailElement>) => void
  previewMode: "desktop" | "mobile"
}

export function Canvas({
  elements,
  selectedElement,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  previewMode,
}: CanvasProps) {
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const elementType = e.dataTransfer.getData("text/plain")

    if (!elementType || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 20 // Offset for better positioning
    const y = e.clientY - rect.top - 20

    onAddElement(elementType, { x, y })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation()
    onSelectElement(elementId)

    const element = elements.find((el) => el.id === elementId)
    if (!element) return

    setDraggedElement(elementId)
    setDragOffset({
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y

    // Constrain to canvas bounds
    const constrainedX = Math.max(0, Math.min(x, rect.width - 100))
    const constrainedY = Math.max(0, Math.min(y, rect.height - 50))

    onUpdateElement(draggedElement, {
      position: { x: constrainedX, y: constrainedY },
    })
  }

  const handleMouseUp = () => {
    setDraggedElement(null)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleContentEdit = (elementId: string, newContent: string) => {
    onUpdateElement(elementId, { content: newContent })
  }

 const renderElement = (element: EmailElement) => {
  const isSelected = selectedElement === element.id
  const isDragging = draggedElement === element.id

  const commonProps = {
    className: cn(
      "absolute cursor-pointer border-2 transition-all duration-200",
      isSelected ? "border-blue-500 shadow-lg" : "border-transparent hover:border-gray-300",
      isDragging ? "z-50 shadow-2xl" : "z-10",
    ),
    style: {
      left: element.position.x,
      top: element.position.y,
      ...element.styles,
    },
    onMouseDown: (e: React.MouseEvent) => handleElementMouseDown(e, element.id),
  }

  switch (element.type) {
    case "text":
      return (
        <div
          key={element.id}
          {...commonProps}
          className={cn(commonProps.className, "p-2 rounded min-w-[100px] min-h-[30px]")}
          contentEditable={isSelected}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleContentEdit(element.id, e.currentTarget.textContent || "")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.blur()
            }
          }}
        >
          {element.content}
        </div>
      )

    case "button":
      return (
        <Button
          key={element.id}
          {...commonProps}
          className={cn(commonProps.className, "select-none")}
          style={{
            ...commonProps.style,
            pointerEvents: isSelected ? "none" : "auto",
          }}
        >
          {isSelected ? (
            <input
              type="text"
              value={element.content}
              onChange={(e) => handleContentEdit(element.id, e.target.value)}
              className="bg-transparent border-none outline-none text-center w-full"
              style={{ color: element.styles.color }}
              autoFocus
            />
          ) : (
            element.content
          )}
        </Button>
      )

    case "image":
      return (
        <div
          key={element.id}
          {...commonProps}
          className={cn(
            commonProps.className,
            "bg-gray-100 flex items-center justify-center rounded overflow-hidden",
          )}
        >
          <img
            src="/placeholder.svg?height=150&width=200&text=Image"
            alt={element.content}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {isSelected && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <span className="text-blue-700 font-medium">Click to edit</span>
            </div>
          )}
        </div>
      )

    case "divider":
      return (
        <div
          key={element.id}
          {...commonProps}
          className={cn(commonProps.className, "min-w-[200px]")}
        />
      )

    case "spacer":
      return (
        <div
          key={element.id}
          {...commonProps}
          className={cn(
            commonProps.className,
            "min-w-[100px] bg-gray-100 bg-opacity-50 flex items-center justify-center",
          )}
        >
          {isSelected && <span className="text-gray-500 text-xs">Spacer</span>}
        </div>
      )

    default:
      return null
  }
}


  const canvasWidth = previewMode === "desktop" ? "600px" : "320px"

  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-auto">
      <div className="flex justify-center">
        <Card
          ref={canvasRef}
          className="relative bg-white shadow-lg transition-all duration-300 overflow-hidden"
          style={{
            width: canvasWidth,
            minHeight: "800px",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => onSelectElement(null)}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Drop zone indicator */}
          {elements.length === 0 && (
            <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">Drop elements here</p>
                <p className="text-sm">Drag components from the sidebar to build your email</p>
              </div>
            </div>
          )}

          {/* Rendered elements */}
          {elements.map(renderElement)}

          {/* Selection indicator */}
          {selectedElement && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none">
              Selected: {elements.find((el) => el.id === selectedElement)?.type}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
