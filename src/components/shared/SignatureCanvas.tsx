'use client';

import React, { useState } from 'react';
import { PenTool, Check, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface SignatureCanvasProps {
  onSaveSignature: (signatureDataUrl: string) => void;
  label?: string;
}

export function SignatureCanvas({ onSaveSignature, label = 'Customer Digital Sign-Off' }: SignatureCanvasProps) {
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    setSigned(true);
    // Mock signature data URI
    onSaveSignature('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><path d="M 10 30 Q 50 10 90 35 T 180 20" stroke="%23f59e0b" stroke-width="3" fill="none"/></svg>');
    toast.success('Digital signature captured successfully.');
  };

  const handleClear = () => {
    setSigned(false);
    onSaveSignature('');
    toast.info('Digital signature cleared.');
  };

  return (
    <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-xs space-y-2">
      <div className="flex justify-between items-center text-slate-300 font-semibold">
        <span className="flex items-center gap-1.5 text-amber-400">
          <PenTool className="w-3.5 h-3.5" />
          {label}
        </span>
        {signed && (
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <Check className="w-3 h-3" /> Signed & Verified
          </span>
        )}
      </div>

      <div className="h-20 bg-slate-900 border border-dashed border-slate-700 rounded flex items-center justify-center relative overflow-hidden">
        {signed ? (
          <div className="text-amber-400 font-serif italic text-lg tracking-widest border-b-2 border-amber-500 pb-1 px-4">
            Rohan Deshmukh
          </div>
        ) : (
          <div className="text-slate-500 text-[11px] select-none text-center">
            Click Sign Below to capture customer authorization signature
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!signed ? (
          <button
            type="button"
            onClick={handleSign}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 rounded transition text-center"
          >
            Capture Digital Signature
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded transition flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Signature
          </button>
        )}
      </div>
    </div>
  );
}
