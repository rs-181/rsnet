"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageSidebar from "@/components/builder/PageSidebar";
import BlockPalette from "@/components/builder/BlockPalette";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import PropertiesPanel from "@/components/builder/PropertiesPanel";
import FooterEditorModal from "@/components/builder/FooterEditorModal";
import { createBlock, slugify } from "@/lib/blockTypes";

function BuilderContent() {
  const { siteId } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [site, setSite] = useState(null);
  const [pages, setPages] = useState([]);
  const [footer, setFooter] = useState({ socialLinks: [] });
  const [activePageId, setActivePageId] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | forbidden
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFooterModal, setShowFooterModal] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const ref = doc(db, "sites", siteId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setStatus("notfound");
        return;
      }
      const data = snap.data();
      if (data.ownerId !== user.uid) {
        setStatus("forbidden");
        return;
      }
      setSite({ id: snap.id, ...data });
      setPages(data.pages && data.pages.length ? data.pages : [{ id: "home", name: "Home", slug: "home", blocks: [] }]);
      setFooter(data.footer || { socialLinks: [] });
      setActivePageId((data.pages && data.pages[0]?.id) || "home");
      setStatus("ready");
    }
    if (user) load();
  }, [siteId, user]);

  const activePage = pages.find((p) => p.id === activePageId);

  const updateActivePageBlocks = useCallback(
    (updater) => {
      setPages((prev) =>
        prev.map((p) => (p.id === activePageId ? { ...p, blocks: updater(p.blocks) } : p))
      );
      setDirty(true);
    },
    [activePageId]
  );

  const handleAddBlock = (type) => {
    updateActivePageBlocks((blocks) => [...blocks, createBlock(type)]);
  };

  const handleDropNewBlock = (type, index) => {
    updateActivePageBlocks((blocks) => {
      const next = [...blocks];
      next.splice(index, 0, createBlock(type));
      return next;
    });
  };

  const handleReorderBlock = (blockId, targetIndex) => {
    updateActivePageBlocks((blocks) => {
      const fromIndex = blocks.findIndex((b) => b.id === blockId);
      if (fromIndex === -1) return blocks;
      const next = [...blocks];
      const [moved] = next.splice(fromIndex, 1);
      const adjustedIndex = fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
      next.splice(adjustedIndex, 0, moved);
      return next;
    });
  };

  const handleChangeBlockProps = (blockId, newProps) => {
    updateActivePageBlocks((blocks) =>
      blocks.map((b) => (b.id === blockId ? { ...b, props: newProps } : b))
    );
  };

  const handleDeleteBlock = (blockId) => {
    updateActivePageBlocks((blocks) => blocks.filter((b) => b.id !== blockId));
    setSelectedBlockId((cur) => (cur === blockId ? null : cur));
  };

  // Swap-with-neighbor reorder — used by the canvas's ↑/↓ buttons, which
  // exist because native HTML5 drag-and-drop doesn't work on touch devices.
  const handleMoveBlock = (blockId, direction) => {
    updateActivePageBlocks((blocks) => {
      const index = blocks.findIndex((b) => b.id === blockId);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || targetIndex < 0 || targetIndex >= blocks.length) return blocks;
      const next = [...blocks];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleAddPage = () => {
    const name = window.prompt("Name this page:");
    if (!name || !name.trim()) return;
    const id = `${slugify(name)}-${Date.now().toString(36)}`;
    setPages((prev) => [...prev, { id, name: name.trim(), slug: slugify(name), blocks: [] }]);
    setActivePageId(id);
    setDirty(true);
  };

  const handleRenamePage = (pageId) => {
    const current = pages.find((p) => p.id === pageId);
    const name = window.prompt("Rename page:", current?.name);
    if (!name || !name.trim()) return;
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, name: name.trim(), slug: slugify(name) } : p))
    );
    setDirty(true);
  };

  const handleDeletePage = (pageId) => {
    const target = pages.find((p) => p.id === pageId);
    const confirmed = window.confirm(`Delete the "${target?.name}" page?`);
    if (!confirmed) return;
    setPages((prev) => {
      const next = prev.filter((p) => p.id !== pageId);
      if (activePageId === pageId) setActivePageId(next[0]?.id || null);
      return next;
    });
    setDirty(true);
  };

  const handleFooterChange = (nextFooter) => {
    setFooter(nextFooter);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "sites", siteId), { pages, footer });
      setDirty(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal-600 border-t-gold-500" />
      </div>
    );
  }

  if (status === "notfound" || status === "forbidden") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-charcoal-600">
          {status === "notfound" ? "That site doesn't exist." : "You don't have access to that site."}
        </p>
        <button onClick={() => router.replace("/dashboard")} className="btn-primary">
          Back to dashboard
        </button>
      </div>
    );
  }

  const selectedBlock = activePage?.blocks.find((b) => b.id === selectedBlockId) || null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-charcoal-700 bg-charcoal-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="shrink-0 text-sm text-charcoal-600 hover:text-white">
              ← Dashboard
            </button>
            <span className="hidden text-charcoal-700 sm:inline">/</span>
            <span className="hidden truncate font-medium sm:inline">{site.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href={`https://${site.subdomain}.rsnet.vercel.app`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-electric-400 hover:underline"
            >
              View live ↗
            </a>
            <button onClick={() => setShowFooterModal(true)} className="btn-secondary text-sm">
              Footer &amp; social
            </button>
            {justSaved && !dirty && (
              <span className="animate-fade-in text-xs text-gold-500">Saved ✓</span>
            )}
            {dirty && <span className="text-xs text-charcoal-600">Unsaved changes</span>}
            <button onClick={handleSave} disabled={saving || !dirty} className="btn-primary text-sm disabled:opacity-40">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </header>

      {site.isSuspended && (
        <div className="border-b border-red-400/30 bg-red-400/10 px-6 py-2 text-center text-sm text-red-400">
          This site has been suspended and isn't visible to the public. Contact support if you
          think this is a mistake.
        </div>
      )}

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-6 py-6 lg:grid-cols-[220px_1fr_280px]">
        <div className="space-y-5 lg:order-1">
          <PageSidebar
            pages={pages}
            activePageId={activePageId}
            onSelectPage={(id) => {
              setActivePageId(id);
              setSelectedBlockId(null);
            }}
            onAddPage={handleAddPage}
            onRenamePage={handleRenamePage}
            onDeletePage={handleDeletePage}
          />
          <BlockPalette onAddBlock={handleAddBlock} />
        </div>

        <div className="lg:order-2">
          <BuilderCanvas
            blocks={activePage?.blocks || []}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onDropNewBlock={handleDropNewBlock}
            onReorderBlock={handleReorderBlock}
            onMoveBlock={handleMoveBlock}
            onDeleteBlock={handleDeleteBlock}
          />
        </div>

        <div className="lg:order-3">
          <PropertiesPanel
            block={selectedBlock}
            onChange={handleChangeBlockProps}
            onDelete={handleDeleteBlock}
            onClose={() => setSelectedBlockId(null)}
            siteId={siteId}
            ownerId={user.uid}
          />
        </div>
      </main>

      {showFooterModal && (
        <FooterEditorModal
          footer={footer}
          onChange={handleFooterChange}
          onClose={() => setShowFooterModal(false)}
        />
      )}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <BuilderContent />
    </ProtectedRoute>
  );
}
