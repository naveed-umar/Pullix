"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Settings2 } from "lucide-react";
import { scanRepository } from "@/app/dashboard/actions/scan";

interface ScanControlsProps {
  repositoryId: string;
}

export function ScanControls({ repositoryId }: ScanControlsProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      await scanRepository(repositoryId);
    } catch (error: any) {
      console.error(error);
      alert("Scan failed: " + error.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline">
        <Settings2 className="mr-2 h-4 w-4" /> Configure
      </Button>
      <Button onClick={handleScan} disabled={isScanning}>
        {isScanning ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Play className="mr-2 h-4 w-4" />
        )}
        {isScanning ? "Scanning..." : "Run Scan"}
      </Button>
    </div>
  );
}
