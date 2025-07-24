"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { AlignLeft, AlignCenter, AlignRight, Settings, Trash2 } from "lucide-react"
import type { EmailElement } from "./email-builder"

interface RightSidebarProps {
  selectedElement: string | null
  elements: EmailElement[]
  onUpdateElement: (id: string, updates: Partial<EmailElement>) => void
}

export function RightSidebar({ selectedElement, elements, onUpdateElement }: RightSidebarProps) {
  const [localStyles, setLocalStyles] = useState<Record<string, any>>({})
  const [localContent, setLocalContent] = useState("")

  const currentElement = selectedElement ? elements.find((el) => el.id === selectedElement) : null

  useEffect(() => {
    if (currentElement) {
      setLocalStyles(currentElement.styles)
      setLocalContent(currentElement.content)
    }
  }, [currentElement])

  const updateStyle = (key: string, value: any) => {
    const newStyles = { ...localStyles, [key]: value }
    setLocalStyles(newStyles)
    if (selectedElement) {
      onUpdateElement(selectedElement, { styles: newStyles })
    }
  }

  const updateContent = (content: string) => {
    setLocalContent(content)
    if (selectedElement) {
      onUpdateElement(selectedElement, { content })
    }
  }

  if (!selectedElement || !currentElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-500 mt-1">Select an element to edit</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No element selected</p>
            <p className="text-sm">Click on an element in the canvas to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Properties</h2>
            <p className="text-sm text-gray-500 mt-1 capitalize">{currentElement.type} Element</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              // This would trigger delete - you'd need to pass this function down
              console.log("Delete element:", selectedElement)
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-4 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentElement.type === "text" && (
                  <div className="space-y-2">
                    <Label>Text Content</Label>
                    <Textarea
                      value={localContent}
                      onChange={(e) => updateContent(e.target.value)}
                      placeholder="Enter your text content..."
                      rows={4}
                    />
                  </div>
                )}

                {currentElement.type === "button" && (
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      value={localContent}
                      onChange={(e) => updateContent(e.target.value)}
                      placeholder="Button text"
                    />
                  </div>
                )}

                {currentElement.type === "image" && (
                  <>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input placeholder="https://example.com/image.jpg" />
                    </div>
                    <div className="space-y-2">
                      <Label>Alt Text</Label>
                      <Input
                        value={localContent}
                        onChange={(e) => updateContent(e.target.value)}
                        placeholder="Alternative text for accessibility"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input placeholder="https://example.com" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-6">
            {/* Typography */}
            {(currentElement.type === "text" || currentElement.type === "button") && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[Number.parseInt(localStyles.fontSize) || 16]}
                        onValueChange={(value) => updateStyle("fontSize", `${value[0]}px`)}
                        max={48}
                        min={8}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500 w-12">
                        {Number.parseInt(localStyles.fontSize) || 16}px
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Weight</Label>
                    <Select
                      value={localStyles.fontWeight || "normal"}
                      onValueChange={(value) => updateStyle("fontWeight", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="lighter">Light</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {currentElement.type === "text" && (
                    <div className="space-y-2">
                      <Label>Text Alignment</Label>
                      <div className="flex gap-1">
                        <Button
                          variant={localStyles.textAlign === "left" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateStyle("textAlign", "left")}
                        >
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={localStyles.textAlign === "center" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateStyle("textAlign", "center")}
                        >
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={localStyles.textAlign === "right" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateStyle("textAlign", "right")}
                        >
                          <AlignRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Colors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localStyles.color || "#000000"}
                      onChange={(e) => updateStyle("color", e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      value={localStyles.color || "#000000"}
                      onChange={(e) => updateStyle("color", e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localStyles.backgroundColor || "#ffffff"}
                      onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      value={localStyles.backgroundColor || "#ffffff"}
                      onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions */}
            {currentElement.type === "image" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Dimensions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Width</Label>
                    <Input
                      value={localStyles.width || "200px"}
                      onChange={(e) => updateStyle("width", e.target.value)}
                      placeholder="200px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height</Label>
                    <Input
                      value={localStyles.height || "150px"}
                      onChange={(e) => updateStyle("height", e.target.value)}
                      placeholder="150px"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Spacing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Spacing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Padding</Label>
                  <Input
                    value={localStyles.padding || "12px"}
                    onChange={(e) => updateStyle("padding", e.target.value)}
                    placeholder="12px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Margin</Label>
                  <Input
                    value={localStyles.margin || "8px"}
                    onChange={(e) => updateStyle("margin", e.target.value)}
                    placeholder="8px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[Number.parseInt(localStyles.borderRadius) || 0]}
                      onValueChange={(value) => updateStyle("borderRadius", `${value[0]}px`)}
                      max={20}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-12">
                      {Number.parseInt(localStyles.borderRadius) || 0}px
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
