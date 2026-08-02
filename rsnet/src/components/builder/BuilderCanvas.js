"use client";

import { useState } from "react";
import BlockRenderer from "./BlockRenderer";

const NEW_BLOCK_MIME = "application/x-rsnet-block-type";
const REORDER_MIME = "application/x-rsnet-block-id";

export default function BuilderCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDropNewBlock,
  onReorderBlock,
  onMoveBlock,
  onDeleteBlock,
}) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const handleDragOverSlot = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggingId ? "move" : "copy";
    setDragOverIndex(index);
  };

  const handleDropAtSlot = (e, index) => {
    e.preventDefault();
    const newType = e.dataTransfer.getData(NEW_BLOCK_MIME);
    const reorderId = e.dataTransfer.getData(REORDER_MIME);

    if (newType) {
      onDropNewBlock(newType, index);
    } else if (reorderId) {
      onReorderBlock(reorderId, index);
    }
    setDragOverIndex(null);
    setDraggingId(null);
  };

  const Slot = ({ index }) => (
    <div
      onDragOver={(e) => handleDragOverSlot(e, index)}
      onDragLeave={() => setDragOverIndex((cur) => (cur === index ? null : cur))}
      onDrop={(e) => handleDropAtSlot(e, index)}
      className="relative h-2"
    >
      {dragOverIndex === index && (
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded bg-gold-500" />
      )}
    </div>
  );

  if (blocks.length === 0) {
    return (
      <div
        onDragOver={(e) => handleDragOverSlot(e, 0)}
        onDrop={(e) => handleDropAtSlot(e, 0)}
        className="card flex min-h-[400px] items-center justify-center border-dashed p-10 text-center text-sm text-charcoal-600"
      >
        Drag a block here from the left, or tap one to add it.
      </div>
    );
  }

  return (
    <div className="card min-h-[400px] p-6 sm:p-10">
      <Slot index={0} />
      {blocks.map((block, i) => (
        <div key={block.id}>
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(REORDER_MIME, block.id);
              e.dataTransfer.effectAllowed = "move";
              setDraggingId(block.id);
            }}
            onDragEnd={() => {
              setDraggingId(null);
              setDragOverIndex(null);
            }}
            onClick={() => onSelectBlock(block.id)}
            className={`group relative cursor-pointer rounded-xl border p-3 transition ${
              selectedBlockId === block.id
                ? "border-gold-500 bg-charcoal-800"
                : "border-transparent hover:border-charcoal-700 hover:bg-charcoal-800/60"
            } ${draggingId === block.id ? "opacity-40" : ""}`}
          >
            <div className="pointer-events-none absolute -left-2 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-full bg-charcoal-600 group-hover:block" />
            <BlockRenderer block={block} />

            <div className="absolute right-2 top-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveBlock(block.id, "up");
                }}
                disabled={i === 0}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal-900 text-xs text-charcoal-600 hover:text-gold-500 disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveBlock(block.id, "down");
                }}
                disabled={i === blocks.length - 1}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal-900 text-xs text-charcoal-600 hover:text-gold-500 disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBlock(block.id);
                }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal-900 text-xs text-charcoal-600 hover:text-red-400"
                title="Remove block"
              >
                ✕
              </button>
            </div>
          </div>
          <Slot index={i + 1} />
        </div>
      ))}
    </div>
  );
}
