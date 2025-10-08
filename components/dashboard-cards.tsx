"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const pieData = [
  { name: "Completed", value: 60 },
  { name: "Ongoing", value: 25 },
  { name: "Overdue", value: 15 },
];

const COLORS = ["#22C55E", "#FFC973", "#EF4444"];

const barData = [
  { name: "Project A", progress: 80 },
  { name: "Project B", progress: 50 },
  { name: "Project C", progress: 30 },
  { name: "Project D", progress: 95 },
];

export function DashboardCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Top row with numbers */}
      <div className="bg-[#5B4B8A] text-white p-4 rounded-md text-center flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">12</span>
        <span>Personal Project</span>
      </div>
      <div className="bg-[#5B4B8A] text-white p-4 rounded-md text-center flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">8</span>
        <span>Organization Project</span>
      </div>
      <div className="bg-[#5B4B8A] text-white p-4 rounded-md text-center flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">4</span>
        <span>Total Organization</span>
      </div>
      <div className="bg-[#5B4B8A] text-white p-4 rounded-md text-center flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">20</span>
        <span>Total Collaborator</span>
      </div>

      {/* === Middle Row (Pie chart diperlebar) === */}
      <div className="bg-[#3B82F6] text-white p-4 rounded-md col-span-2 h-72 flex flex-col">
        <h2 className="font-semibold mb-3 text-center">Deadline by Project</h2>
        <div className="flex items-center justify-center gap-6 bg-[#3B82F6] rounded-md p-4 h-full">
          {/* Pie Chart Kiri */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={70}
                  label={({ name }) => name}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Info Kanan */}
          <div className="flex-1 text-left text-sm text-gray-700">
            <h3 className="font-semibold mb-3">Project Breakdown</h3>
            <ul className="space-y-2">
              {pieData.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-auto font-semibold text-gray-900">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#3B82F6] text-white p-4 rounded-md col-span-2 text-center h-72">
        <h2 className="font-semibold mb-2">Project Details</h2>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="progress" fill="#22C55E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="bg-[#3B82F6] text-white p-4 rounded-md col-span-2 h-48">
        <h2 className="font-semibold mb-3">Recent Activity</h2>
        <ul className="space-y-1 text-sm text-left">
          <li>✅ Project A completed</li>
          <li>🕒 Project B deadline in 3 days</li>
          <li>🚧 Project C 70% progress</li>
        </ul>
      </div>
      <div className="bg-[#3B82F6] text-white p-4 rounded-md col-span-2 h-48">
        <h2 className="font-semibold mb-3">List Organization</h2>
        <ul className="space-y-1 text-sm text-left">
          <li>🏢 Tech Innovators</li>
          <li>🏢 Dev Community</li>
          <li>🏢 Startup Hub</li>
        </ul>
      </div>
    </div>
  );
}
