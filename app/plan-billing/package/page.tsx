"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Free / Demo",
    price: "$1xx / month",
    desc: "Suitable for individuals to demo and explore projects.",
    features: ["1 User", "3 Projects", "Basic Analytics", "Email Support", "Limited API Calls"],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$1xx / month",
    desc: "Suitable for professionals with small to mid projects.",
    features: ["10 Users", "10 Projects", "Full Analytics", "Priority Support", "API Access"],
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "$1xx / month",
    desc: "Best for growing companies needing scalability.",
    features: [
      "Unlimited Users",
      "Unlimited Projects",
      "Advanced Dashboard",
      "Dedicated Support",
      "Custom API Integrations",
    ],
    highlight: false,
  },
  {
    name: "White Label",
    price: "$1xx / month",
    desc: "Take full ownership of the CMS branding and system.",
    features: [
      "All Suite Features",
      "Custom Branding",
      "On-site Deployment",
      "Lifetime License",
    ],
    highlight: true,
  },
];

export default function ChoosePlanPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 py-10"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--primary)" }}>
        Choose Plan
      </h1>
      <p className="mb-8" style={{ color: "var(--muted-foreground)" }}>
        Choose a plan that suits your projects
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
        {plans.map((plan, i) => (
          <Card
            key={i}
            className="border-2 rounded-xl hover:shadow-lg transition"
            style={{
              borderColor: plan.highlight ? "var(--accent)" : "var(--primary)",
              backgroundColor: "var(--card-bg-inner)",
            }}
          >
            <CardHeader className="text-center">
              <CardTitle className="font-semibold text-lg">{plan.name}</CardTitle>
              <p className="text-xl font-bold mt-2" style={{ color: "var(--primary)" }}>
                {plan.price}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                {plan.desc}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mt-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center text-sm">
                    <CheckCircle2
                      className="w-4 h-4 mr-2"
                      style={{ color: "var(--primary)" }}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center mt-4">
              <Link href="/plan-billing/checkout">
                <Button
                  className="rounded-lg"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--button-text)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--primary)")
                  }
                >
                  Select Plan
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
