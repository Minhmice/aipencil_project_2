"use client";

import React, { FC, useState } from "react";

export interface EmbedDashboardProps {
  /** URL để nhúng iframe */
  iframeSrc: string;
}

const EmbedDashboard: FC<EmbedDashboardProps> = ({ iframeSrc }) => {
  const [loading, setLoading] = useState(true);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="relative flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Embedded iframe */}
      <iframe
        src={iframeSrc}
        className="flex-1 w-full border-0"
        onLoad={handleIframeLoad}
      />
    </div>
  );
};

export default EmbedDashboard;
