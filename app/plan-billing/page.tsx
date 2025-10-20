"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

export default function PlanBillingPage() {
  const [autoRenew, setAutoRenew] = useState(true);
const [showAdd, setShowAdd] = useState(false);
const [showEdit, setShowEdit] = useState(false);

  const [mockPlan] = useState({
    name: "Professional",
    renewalDate: "12 Dec 2025",
    price: "$100",
  });

  const usageData = [
    { name: "Used", value: 60 },
    { name: "Remaining", value: 40 },
  ];
  const COLORS = ["#3B82F6", "#E5E7EB"];

  return (
    <div className="p-6 space-y-6 text-[var(--foreground)]">
      <h1 className="text-2xl font-bold">Plan And Billing</h1>

      {/* Information Package & System Usage Overview */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Information Package */}
        <Card className="bg-[var(--card-bg-mid)] border-[var(--dropdown-border)]">
          <CardHeader>
            <CardTitle>Information Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{mockPlan.name}</p>
                <p className="text-sm text-gray-400">
                  Subscription End Date:{" "}
                  <span className="text-green-400 font-semibold">
                    {mockPlan.renewalDate}
                  </span>
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-400">
                {mockPlan.price}
              </p>
            </div>

            {/* Auto Renewal Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                id="auto-renew"
                checked={autoRenew}
                onCheckedChange={setAutoRenew}
              />
              <Label htmlFor="auto-renew" className="text-sm">
                Auto Renewal
              </Label>
            </div>

            <p className="text-xs text-gray-400">
              Enable auto-renewal to keep your subscription active without
              interruptions using your saved payment method.
            </p>

            <div className="flex gap-2 pt-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/plan-billing/package">Pay Package</Link>
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Link href="/plan-billing/package">Upgrade Package</Link>
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Cancel Package
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Usage Overview */}
        <Card className="bg-[var(--card-bg-mid)] border-[var(--dropdown-border)]">
          <CardHeader>
            <CardTitle>System Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={usageData}
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {usageData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-sm">
                <p>Status: <span className="text-green-400 font-medium">Active</span></p>
                <p>Bandwidth: 870 / 1000 GB</p>
                <p>API Calls: 500k / 600k</p>
                <p>Media Assets: 1350 / 1500 files</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Address */}
      <Card className="bg-[var(--card-bg-mid)] border-[var(--dropdown-border)]">
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid md:grid-cols-2 gap-4">
            {[
              "Full Name",
              "Billing Email",
              "Country",
              "City",
              "State / Province",
              "Zip",
              "Company (Optional)",
              "Address",
            ].map((label, i) => (
              <div key={i}>
                <Label>{label}</Label>
                <Input
                  placeholder={label}
                  className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
                />
              </div>
            ))}
          </form>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
            Update Information
          </Button>
        </CardContent>
      </Card>

     {/* Payment Information */}
<Card className="bg-[var(--card-bg-mid)] border-[var(--dropdown-border)]">
  <CardHeader>
    <CardTitle>Payment Information</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Payment Form Preview */}
    <form className="grid md:grid-cols-2 gap-4">
      <div>
        <Label>Card Holder Name</Label>
        <Input
          placeholder="John Doe"
          className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
          disabled
        />
      </div>
      <div>
        <Label>Card Number</Label>
        <Input
          placeholder="1234 5678 9012 3456"
          className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
          disabled
        />
      </div>
      <div>
        <Label>Expiration Date</Label>
        <Input
          placeholder="MM/YY"
          className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
          disabled
        />
      </div>
      <div>
        <Label>CVV</Label>
        <Input
          placeholder="123"
          className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
          disabled
        />
      </div>
    </form>

    {/* Buttons */}
    <div className="flex justify-end gap-2">
      <Button className="bg-red-600 hover:bg-red-700 text-white">
        Delete
      </Button>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => setShowEdit(true)}
        type="button"
      >
        Change Payment Info
      </Button>
      <Button
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={() => setShowAdd(true)}
        type="button"
      >
        Add Payment Method
      </Button>
    </div>

    {/* Modal for Add/Edit Payment */}
    {showAdd || showEdit ? (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-[var(--card-bg-mid)] border border-[var(--dropdown-border)] rounded-xl p-6 w-full max-w-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4">
            {showAdd ? "Add New Payment Method" : "Edit Payment Information"}
          </h2>
          <form className="space-y-3">
            <div>
              <Label>Card Holder Name</Label>
              <Input
                placeholder="John Doe"
                className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
              />
            </div>
            <div>
              <Label>Card Number</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Expiration Date</Label>
                <Input
                  placeholder="MM/YY"
                  className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
                />
              </div>
              <div>
                <Label>CVV</Label>
                <Input
                  placeholder="123"
                  className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
                />
              </div>
            </div>
            <div>
              <Label>E-Wallet ID (Optional)</Label>
              <Input
                placeholder="e.g., Dana / GoPay ID"
                className="mt-1 bg-[var(--background)] border-[var(--dropdown-border)]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAdd(false);
                  setShowEdit(false);
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                type="button"
                onClick={() => {
                  alert("Payment info saved (mock)");
                  setShowAdd(false);
                  setShowEdit(false);
                }}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    ) : null}
  </CardContent>
</Card>


      {/* Billing History */}
      <Card className="bg-[var(--card-bg-mid)] border-[var(--dropdown-border)]">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Date Paid</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Professional</TableCell>
                <TableCell>12 Dec 2025</TableCell>
                <TableCell>$100</TableCell>
                <TableCell>
                  <span className="text-yellow-400">Active</span>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="link">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Professional</TableCell>
                <TableCell>12 Nov 2025</TableCell>
                <TableCell>$100</TableCell>
                <TableCell>
                  <span className="text-green-400">Complete</span>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="link">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project Usage Detail */}
      <Card className="bg-[var(--card-bg-mid)] border-[var(--dropdown-border)]">
        <CardHeader>
          <CardTitle>Project Usage Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2 mb-3">
            <p>
              Projects: <span className="font-semibold">3 active</span>
            </p>
            <p>
              Included in the plan: <span className="font-semibold">3/3</span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roles</TableHead>
                  <TableHead>Collaborators</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Webhooks</TableHead>
                  <TableHead>Models</TableHead>
                  <TableHead>Locales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>3/project included</TableCell>
                  <TableCell>1/project included</TableCell>
                  <TableCell>157/300</TableCell>
                  <TableCell>5/project included</TableCell>
                  <TableCell>60/environment included</TableCell>
                  <TableCell>10/environment included</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
