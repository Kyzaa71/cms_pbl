"use client";

import { Card } from "@/components/ui/card";
import { MediaStats, formatFileSize } from "./types";
import { FileText, Image as ImageIcon, Video, Database, Upload } from "lucide-react";

interface MediaStatsProps {
  stats: MediaStats;
}

export function MediaStatsCards({ stats }: MediaStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Files */}
      <Card className="p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--button-text)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Total Files</p>
            <p className="text-2xl font-bold mt-1">{stats.total_files}</p>
          </div>
          <FileText className="w-8 h-8 opacity-80" />
        </div>
      </Card>

      {/* Total Size */}
      <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Total Size</p>
            <p className="text-2xl font-bold mt-1">
              {formatFileSize(stats.total_size_bytes)}
            </p>
          </div>
          <Database className="w-8 h-8 opacity-80" />
        </div>
      </Card>

      {/* Images Count */}
      <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Images</p>
            <p className="text-2xl font-bold mt-1">{stats.by_type.image || 0}</p>
          </div>
          <ImageIcon className="w-8 h-8 opacity-80" />
        </div>
      </Card>

      {/* Videos Count */}
      <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Videos</p>
            <p className="text-2xl font-bold mt-1">{stats.by_type.video || 0}</p>
          </div>
          <Video className="w-8 h-8 opacity-80" />
        </div>
      </Card>

      {/* Recent Uploads */}
      <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Last 24h</p>
            <p className="text-2xl font-bold mt-1">{stats.recent_uploads_24h}</p>
          </div>
          <Upload className="w-8 h-8 opacity-80" />
        </div>
      </Card>
    </div>
  );
}

