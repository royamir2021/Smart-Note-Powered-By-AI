import React, { useEffect, useRef, useState } from 'react';
import { uploadChemStructure } from '../../../lib/api';

declare global {
  interface Window {
    ChemDoodle: any;
    sketcher: any;
  }
}

export default function ChemButton({ onInsert }: { onInsert: (svg: string) => void }) {
  const [showSketcher, setShowSketcher] = useState(false);
  const sketcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSketcher && window.ChemDoodle && sketcherRef.current) {
      setTimeout(() => {
        const sketcher = new window.ChemDoodle.SketcherCanvas('sketcherDiv', 500, 300);
        sketcher.styles.atoms_displayTerminalCarbonLabels = true;
        sketcher.repaint();
        window.sketcher = sketcher;
        console.log("✅ Sketcher loaded:", sketcher);
      }, 100);
    }
  }, [showSketcher]);

  const handleInsert = async () => {
    const sketcher = window.sketcher;
    const svg = sketcher.getSVG();
    const mol = sketcher.getMolecule();
    const molData = window.ChemDoodle.writeMOL(mol);

    const session = sessionStorage.getItem('note_session');
    const { note_id, student_id } = session ? JSON.parse(session) : {};

    if (!note_id || !student_id) return alert('Session info missing');

    try {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const file = new File([blob], `chem_note_${note_id}.svg`, { type: 'image/svg+xml' });

      const response = await uploadChemStructure(file, note_id, student_id);
      onInsert(`<img src="${response.url}" alt="chemical structure" />`);
    } catch (e) {
      console.error('❌ Upload error', e);
    }

    setShowSketcher(false);
  };
  useEffect(() => {
    if (window.ChemDoodle) {
      console.log("✅ ChemDoodle loaded");
    } else {
      console.log("❌ ChemDoodle NOT loaded");
    }
  }, []);
  return (
    <>
      <button onClick={() => setShowSketcher(true)} className="toolbar-btn text-sm">
        🧪 Chem
      </button>

      {showSketcher && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <div ref={sketcherRef} id="sketcherDiv" style={{ width: 500, height: 300 }} />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={handleInsert} className="bg-blue-600 text-white px-4 py-2 rounded">
                ✅ Insert
              </button>
              <button onClick={() => setShowSketcher(false)} className="bg-gray-300 px-4 py-2 rounded">
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
