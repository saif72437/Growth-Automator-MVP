"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, Zap, Crown, Users } from "lucide-react"

export function PlanManagementPage() {
  const [currentPlan] = useState("free") // free, pro, enterprise

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      icon: <Users className="w-6 h-6" />,
      features: ["5 email templates", "100 emails/month", "Basic analytics", "Email support"],
      limits: {
        templates: { used: 3, total: 5 },
        emails: { used: 45, total: 100 },
        analytics: "Basic",
      },
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For growing businesses",
      icon: <Zap className="w-6 h-6" />,
      popular: true,
      features: [
        "Unlimited templates",
        "10,000 emails/month",
        "Advanced analytics",
        "A/B testing",
        "Priority support",
        "Custom branding",
      ],
      limits: {
        templates: { used: 0, total: "Unlimited" },
        emails: { used: 0, total: 10000 },
        analytics: "Advanced",
      },
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large organizations",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Everything in Pro",
        "100,000 emails/month",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
      ],
      limits: {
        templates: { used: 0, total: "Unlimited" },
        emails: { used: 0, total: 100000 },
        analytics: "Enterprise",
      },
    },
  ]

  const currentPlanData = plans.find((plan) => plan.id === currentPlan)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Plan & Billing</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and view usage</p>
        </div>

        {/* Current Plan Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentPlanData?.icon}
              Current Plan: {currentPlanData?.name}
              {currentPlan === "free" && <Badge variant="secondary">Free</Badge>}
              {currentPlan === "pro" && <Badge className="bg-blue-600">Pro</Badge>}
              {currentPlan === "enterprise" && <Badge className="bg-purple-600">Enterprise</Badge>}
            </CardTitle>
            <CardDescription>Your current usage and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Templates</span>
                  <span className="text-sm text-gray-500">
                    {currentPlanData?.limits.templates.used}/{currentPlanData?.limits.templates.total}
                  </span>
                </div>
                {typeof currentPlanData?.limits.templates.total === "number" && (
                  <Progress
                    value={(currentPlanData.limits.templates.used / currentPlanData.limits.templates.total) * 100}
                    className="h-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monthly Emails</span>
                  <span className="text-sm text-gray-500">
                    {currentPlanData?.limits.emails.used}/{currentPlanData?.limits.emails.total.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={
                    ((currentPlanData?.limits.emails.used || 0) / (currentPlanData?.limits.emails.total || 1)) * 100
                  }
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analytics</span>
                  <Badge variant="outline">{currentPlanData?.limits.analytics}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? "ring-2 ring-blue-600" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div
                    className={`p-3 rounded-lg ${
                      plan.id === "free" ? "bg-gray-100" : plan.id === "pro" ? "bg-blue-100" : "bg-purple-100"
                    }`}
                  >
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-500">/{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {currentPlan === plan.id ? (
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Current Plan
                  </Button>
                ) : currentPlan === "free" && plan.id !== "free" ? (
                  <Button className="w-full">Upgrade to {plan.name}</Button>
                ) : currentPlan === "pro" && plan.id === "enterprise" ? (
                  <Button className="w-full">Upgrade to {plan.name}</Button>
                ) : currentPlan === "pro" && plan.id === "free" ? (
                  <Button variant="outline" className="w-full bg-transparent">
                    Downgrade to {plan.name}
                  </Button>
                ) : currentPlan === "enterprise" && plan.id !== "enterprise" ? (
                  <Button variant="outline" className="w-full bg-transparent">
                    Downgrade to {plan.name}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Sales
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Billing Information */}
        {currentPlan !== "free" && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your payment method and billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">••••</span>
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <span>Next billing date:</span>
                <span className="font-medium">January 15, 2024</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Download Invoice</Button>
                <Button variant="outline">Billing History</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
