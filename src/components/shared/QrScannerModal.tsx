'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { QrCode, Search, X, ShieldAlert, CheckCircle2, BatteryCharging, Wrench } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEquipment?: (eqId: string) => void;
}

export function QrScannerModal({ isOpen, onClose, onSelectEquipment }: QrScannerModalProps) {
  const { equipment } = useCrmStore();
  const [scannedSerial, setScannedSerial] = useState('');
  const [foundEquipment, setFoundEquipment] = useState<any>(null);

  if (!isOpen) return null;

  const handleSearch = () => {
    const matched = equipment.find(
      (e) => e.serialNumber.toLowerCase() === scannedSerial.trim().toLowerCase()
    );
    setFoundEquipment(matched || null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden font-mono text-slate-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <QrCode className="w-4 h-4" />
            <span>Equipment QR Code Instant Lookup</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-xs text-slate-400">
            Scan or enter the physical Equipment Serial Number printed on the ESSMA UPS QR label for instant lifecycle diagnosis.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={scannedSerial}
              onChange={(e) => setScannedSerial(e.target.value)}
              placeholder="e.g. ESSMA-UPS-120KVA-88912"
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSearch}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded text-xs transition"
            >
              Verify Asset
            </button>
          </div>

          {/* Quick Select Buttons from Existing Equipment */}
          <div>
            <div className="text-[10px] text-slate-500 mb-1">Click to test instant lookup:</div>
            <div className="flex flex-wrap gap-1.5">
              {equipment.slice(0, 3).map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => {
                    setScannedSerial(eq.serialNumber);
                    setFoundEquipment(eq);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-[10px] px-2 py-1 rounded text-slate-300 border border-slate-700"
                >
                  {eq.serialNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Result Inspection Box */}
          {foundEquipment && (
            <div className="bg-slate-950 border border-amber-500/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-amber-400">{foundEquipment.modelName}</div>
                  <div className="text-[11px] text-slate-400">SN: {foundEquipment.serialNumber}</div>
                  <div className="text-[11px] text-slate-400">{foundEquipment.customerName}</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <QRCodeSVG value={foundEquipment.serialNumber} size={64} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500">Health Index:</span>
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {foundEquipment.healthScore}% Operational
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500">AMC Status:</span>
                  <div className="font-bold text-amber-400">{foundEquipment.amcStatus}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <div>• Capacity: <span className="text-slate-200">{foundEquipment.capacityKva} kVA ({foundEquipment.phase})</span></div>
                <div>• Installed Battery: <span className="text-slate-200">{foundEquipment.batteryType} ({foundEquipment.batteryQuantity} Nos)</span></div>
                <div>• Next PM Due: <span className="text-amber-400">{foundEquipment.nextMaintenanceDueDate}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
