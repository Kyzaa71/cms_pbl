"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const orderMock = {
  plan: "Professional Plan",
  price: "$1xx / month",
  subtotal: "$100",
  total: "$120xx",
};

export default function CheckoutPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 py-10"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--primary)" }}>
        Checkout
      </h1>
      <p className="mb-8" style={{ color: "var(--muted-foreground)" }}>
        Complete your Checkout to activate your plan
      </p>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* Billing Form */}
        <Card
          className="flex-1"
          style={{
            borderColor: "var(--primary)",
            backgroundColor: "var(--card-bg-inner)",
          }}
        >
          <CardHeader>
            <h2 className="text-lg font-semibold">Billing Address</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="John Doe" style={{ backgroundColor: "var(--input-bg)" }} />
            </div>
            <div>
              <Label>Billing Email</Label>
              <Input placeholder="john@email.com" style={{ backgroundColor: "var(--input-bg)" }} />
            </div>
            <div>
              <Label>Country</Label>
              <Input placeholder="Indonesia" style={{ backgroundColor: "var(--input-bg)" }} />
            </div>
            <div>
              <Label>City</Label>
              <Input placeholder="Jakarta" style={{ backgroundColor: "var(--input-bg)" }} />
            </div>
            <div>
              <Label>State / Province</Label>
              <Input placeholder="DKI Jakarta" style={{ backgroundColor: "var(--input-bg)" }} />
            </div>
            <div>
              <Label>Zip</Label>
              <Input placeholder="12345" style={{ backgroundColor: "var(--input-bg)" }} />
            </div>
            <div className="sm:col-span-2">
              <Label>Address</Label>
              <Input placeholder="Jl. Example No. 123" style={{ backgroundColor: "var(--input-bg)" }} />
            </div>
            <div className="sm:col-span-2">
              <Label>Company (Optional)</Label>
              <Input placeholder="Company Name" style={{ backgroundColor: "var(--input-bg)" }} />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card
          className="w-full lg:w-1/3"
          style={{
            borderColor: "var(--primary)",
            backgroundColor: "var(--card-bg-inner)",
          }}
        >
          <CardHeader>
            <h2 className="text-lg font-semibold">Order Summary</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{orderMock.plan}</span>
                <span>{orderMock.price}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{orderMock.subtotal}</span>
              </div>
              <div
                className="flex justify-between font-semibold"
                style={{ color: "var(--primary)" }}
              >
                <span>Total</span>
                <span>{orderMock.total}</span>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto"
                  className="rounded"
                  style={{ accentColor: "var(--primary)" }}
                />
                <Label htmlFor="auto">Auto renew on next billing cycle</Label>
              </div>
              <Button
                className="w-full mt-4 rounded-lg"
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
                Pay Package
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Section */}
      <Card
        className="mt-8 w-full max-w-6xl"
        style={{
          borderColor: "var(--primary)",
          backgroundColor: "var(--card-bg-inner)",
        }}
      >
        <CardHeader>
          <h2 className="text-lg font-semibold">Payment Method</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Credit Card", "Virtual Account", "E-Wallet", "Retail", "PayLater", "QRIS"].map(
            (method) => (
              <Button
                key={method}
                variant="outline"
                className="border rounded-lg"
                style={{
                  borderColor: "var(--primary)",
                  color: "var(--primary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {method}
              </Button>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
