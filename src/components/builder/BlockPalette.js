"use client";

import { BLOCK_TYPES, PALETTE_ORDER } from "@/lib/blockTypes";

export default function BlockPalette({ onAddBlock }) {
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("application/x-rsnet-block-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="card p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal-600">
        Blocks
      </h2>
      <div className="space-y-2">
        {PALETTE_ORDER.map((type) => {
          const def = BLOCK_TYPES[type];
          return (
            <button
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onClick={() => onAddBlock(type)}
              className="flex w-full cursor-grab items-center gap-3 rounded-xl border border-charcoal-700 bg-charcoal-800 px-3 py-2.5 text-left text-sm transition hover:border-gold-500 active:cursor-grabbing"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-charcoal-700 font-display text-sm text-gold-500">
                {def.icon}
              </span>
              {def.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-charcoal-600">
        Drag a block onto the page, or tap it to add to the end.
      </p>
    </div>
  );
}
