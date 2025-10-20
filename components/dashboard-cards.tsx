"use client";

import { Progress } from "@/components/ui/progress";

const projects = [
  { name: "Website Redesign", deadline: "3 days left", status: "On Track" },
  { name: "Mobile App", deadline: "1 day left", status: "Urgent" },
  { name: "Marketing Campaign", deadline: "5 days left", status: "Pending" },
];

const projectDetails = [
  { name: "Website Redesign", desc: "UI overhaul for main site", progress: 85 },
  { name: "Mobile App", desc: "Feature completion and bug fixes", progress: 60 },
  { name: "Marketing Campaign", desc: "Social media and outreach", progress: 40 },
  { name: "Internal Tools", desc: "Automation improvements", progress: 20 },
];

export function DashboardCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* === Top row === */}
      {[
        { label: "Personal Project", value: 12 },
        { label: "Organization Project", value: 8 },
        { label: "Total Organization", value: 4 },
        { label: "Total Collaborator", value: 20 },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-[var(--card-bg-top)] text-[var(--card-text)] p-4 rounded-md text-center flex flex-col items-center justify-center transition-colors"
        >
          <span className="text-3xl font-bold">{item.value}</span>
          <span>{item.label}</span>
        </div>
      ))}

      {/* === Middle Row === */}
      <div className="bg-[var(--card-bg-mid)] text-[var(--card-text)] p-5 rounded-md col-span-2 h-72 transition-colors">
        <h2 className="font-semibold mb-4 text-lg text-center">Project Deadlines</h2>
        <ul className="space-y-4 text-sm">
          {projects.map((p, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-[var(--card-bg-mid-alt)] rounded-md px-4 py-3 hover:brightness-110 transition"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs opacity-80">{p.deadline}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  p.status === "Urgent"
                    ? "bg-red-500 text-white"
                    : p.status === "On Track"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[var(--card-bg-mid)] text-[var(--card-text)] p-5 rounded-md col-span-2 h-72 overflow-y-auto transition-colors">
        <h2 className="font-semibold mb-4 text-lg text-center">Project Details</h2>
        <div className="space-y-4">
          {projectDetails.map((proj, idx) => (
            <div
              key={idx}
              className="bg-[var(--card-bg-mid-alt)] p-3 rounded-md hover:brightness-110 transition"
            >
              <p className="font-medium">{proj.name}</p>
              <p className="text-xs opacity-80 mb-2">{proj.desc}</p>
              <Progress value={proj.progress} className="h-2" />
              <p className="text-xs mt-1 text-right">{proj.progress}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* === Recent Activity === */}
      <div className="bg-gradient-to-br from-[var(--card-bg-gradient-1)] to-[var(--card-bg-gradient-2)] text-[var(--card-text)] p-5 rounded-md col-span-2 h-52 flex flex-col transition-colors">
        <h2 className="font-semibold mb-3 text-lg text-center">Recent Activity</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { icon: "✅", text: "Website Redesign completed 85% and on track" },
            { icon: "🚨", text: "Mobile App needs urgent review before deadline" },
            { icon: "📢", text: "Marketing Campaign scheduled for launch in 5 days" },
            { icon: "⚙️", text: "Internal Tools updated to latest automation module" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm rounded-md px-3 py-2 transition-all flex items-center gap-2"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* === List Organization === */}
      <div className="bg-gradient-to-br from-[var(--card-bg-gradient-1)] to-[var(--card-bg-gradient-2)] text-[var(--card-text)] p-5 rounded-md col-span-2 h-52 transition-colors">
        <h2 className="font-semibold mb-3 text-lg text-center">List Organization</h2>
        <ul className="grid grid-cols-2 gap-3 text-sm">
          {[
            { name: "🏢 Tech Innovators", active: "15 members" },
            { name: "🏢 Dev Community", active: "9 members" },
            { name: "🏢 Startup Hub", active: "12 members" },
            { name: "🏢 Open Source Lab", active: "7 members" },
          ].map((org, i) => (
            <li
              key={i}
              className="bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm rounded-md px-3 py-2 transition-all"
            >
              <p className="font-medium">{org.name}</p>
              <p className="text-xs opacity-80">{org.active}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
