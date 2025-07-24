"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Monitor, Smartphone, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EmailElement } from "./email-builder"

interface PreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "desktop" | "mobile"
  elements: EmailElement[]
}

export function PreviewModal({ open, onOpenChange, mode, elements }: PreviewModalProps) {
  const renderPreviewElement = (element: EmailElement) => {
    const styles = {
      ...element.styles,
      position: "static" as const,
      margin: "8px 0",
    }

    switch (element.type) {
      case "text":
        return (
          <div key={element.id} style={styles}>
            {element.content}
          </div>
        )
      case "button":
        return (
          <Button key={element.id} style={styles} className="inline-block">
            {element.content}
          </Button>
        )
      case "image":
        return (
          <img
            key={element.id}
            src="/placeholder.svg?height=150&width=200&text=Preview Image"
            alt={element.content}
            style={styles}
            className="block"
          />
        )
      case "divider":
        return <hr key={element.id} style={styles} />
      case "spacer":
        return <div key={element.id} style={styles} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {mode === "desktop" ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
              Email Preview - {mode === "desktop" ? "Desktop" : "Mobile"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-0">
          <div className="h-full bg-gray-100 rounded-lg p-4 overflow-auto">
            <div
              className={cn(
                "mx-auto bg-white shadow-lg rounded-lg overflow-hidden",
                mode === "desktop" ? "max-w-2xl" : "max-w-sm",
              )}
            >
              {/* Email Header */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>From: Growth Automator &lt;hello@growthautomator.com&gt;</span>
                  <span>Today, 2:30 PM</span>
                </div>
                <h2 className="font-semibold text-gray-900 mt-1">Your Email Template</h2>
              </div>

              {/* Email Content */}
              <div className="p-8">
                {elements.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No content to preview</p>
                    <p className="text-sm">Add elements to see the preview</p>
                  </div>
                ) : (
                  elements.map(renderPreviewElement)
                )}

                {/* Footer */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    You received this email because you subscribed to our newsletter.
                  </p>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    <a href="#" className="text-blue-600 hover:underline">
                      Unsubscribe
                    </a>{" "}
                    |{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Update preferences
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
