# WriteBuilder – Technical Feature Specification

> Target audience: developers implementing or extending the app.  
> Stack baseline: Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Zustand + Lucide.  
> Current state: Write and Timeline exist in basic form; Characters route is wired but empty; no real persistence or versioning yet.

This document is the single source of truth for the product model, module responsibilities, data shapes, and cross-module contracts. Implement against it.

---

## 0. Shared Project Model & Storage

### feat(storage) / feat(versioning)

#### Goals
- One Project is the root of truth.
- Local-first by default (IndexedDB / OPFS recommended).
- Recoverable history without full git complexity in v1.
- Characters carry their own lightweight evolution history.

#### Core data shapes (TypeScript-oriented)

```ts
type ProjectId = string;
type EntityId = string;

interface Project {
  id: ProjectId;
  title: string;
  createdAt: string;          // ISO
  updatedAt: string;
  schemaVersion: number;      // for migrations

  script: ScriptDocument;
  timeline: TimelineDocument;
  characters: Character[];
  // derived / cached cross-links can live here or be computed
}

interface ScriptDocument {
  content: string;            // plain text or future rich document
  // annotations layer for mentions & markers (see feat(write))
  annotations: ScriptAnnotation[];
  history: ScriptSnapshot[];  // optional finer-grained
}

interface TimelineDocument {
  nodes: EventNode[];
  edges: TimelineEdge[];
}

interface Character {
  id: EntityId;
  name: string;
  // ... core fields
  source: CharacterSource;    // current definition
  history: CharacterVersion[]; // evolution
  relations: CharacterRelation[];
}

interface ProjectSnapshot {
  id: EntityId;
  projectId: ProjectId;
  name?: string;              // "After chapter 3 rewrite"
  createdAt: string;
  // full or differential payload of script + timeline + characters
  payload: unknown;           // serialize the three main documents
}
```

#### Versioning rules (v1)
- **Project Snapshot**: captures Script + Timeline + all Characters at a point in time.  
  - Manual (“Save version”) + light auto-snapshots (e.g. every N minutes or on blur of important surfaces).
- **Per-character history**: every meaningful edit to a Character’s `source` creates a `CharacterVersion` entry.  
  - Used for “how this character evolved” and for linking Timeline beats.
- No branching / merge in v1. Linear history is enough.
- Rename of a character must update all structured mentions (see feat(write)).

#### Persistence contract
- Primary store: local (IndexedDB recommended).  
- Export / import: single project file (JSON or zip of JSON).  
- Cloud sync is out of scope for this document.
- Schema version field must be present so future migrations can run.

#### Implementation notes
- Introduce a `projectStore` (Zustand or equivalent) that owns the live Project.  
- UI stores (`uiStore`) stay presentation-only.  
- All modules read/write through the project store or derived selectors.  
- Snapshots are immutable; restoring a snapshot replaces the live documents (with confirmation).

---

## 1. Write Module

### feat(write)

#### Current baseline
- Plain `<textarea>` with optional line numbers, word/char count, Spanish placeholder.
- Footer status bar.
- Contextual toolbar actions (line numbers, tagging stub).

#### Required behaviour

**Core editing**
- Distraction-minimized writing surface.
- Line numbers toggle (already present).
- Live word / character / line counts.
- Preserve existing visual language (serif for body, amber caret, zinc chrome).

**Mentions (`@`)**
- Trigger: typing `@`.
- Autocomplete from current project’s `characters` (name matching, multi-word supported).
- On confirm, insert a structured mention, not raw text.
- Stored as annotation:

```ts
interface ScriptAnnotation {
  id: EntityId;
  type: "mention" | "timeline-marker" | ...;
  start: number;          // character offset
  end: number;
  payload: {
    characterId?: EntityId;
    // for timeline markers later
    nodeId?: EntityId;
  };
}
```

- Hover → peek card (name + short summary + optional current state).
- Click → navigate to Character Source mode (or focus Graph if last used).
- Context menu: “Open in Graph”, “Show appearances in Timeline”, etc.
- Rename of character must rewrite all matching annotations.

**Timeline linking (lightweight v1)**
- User can create a marker from a selection or caret position that points to an existing or new Timeline node.
- Visual indicator in the gutter or subtle underline for linked ranges.
- From the marker: jump to the corresponding Timeline node.
- From a Timeline node: “Open linked script section” jumps back and highlights.

**Future-friendly note**
- The current textarea is sufficient for a first usable version with offset-based annotations.  
- Plan migration path to a rich editor (TipTap / Lexical / ProseMirror) when annotation density or inline rendering becomes painful. Keep the data model annotation-based so the switch is mostly a view change.

#### Toolbar / UI
- Keep existing “Líneas” and “Tagging” buttons.
- Tagging can later open a side panel of active mentions / linked nodes.
- Status bar remains the place for counts and “Escribiendo…” state.

#### Acceptance criteria (dev)
- [ ] `@` triggers character autocomplete drawn from live project data.
- [ ] Mentions survive rename of the character.
- [ ] Clicking a mention opens the correct Character view.
- [ ] At least one direction of Write ↔ Timeline marker works.
- [ ] Content + annotations are part of Project snapshots.

---

## 2. Timeline Module

### feat(timeline)

#### Current baseline
- Custom pan/zoom canvas (`EditorCanvas`).
- `EventNode` with left/right ports, drag, snap-to-grid.
- Bezier `Edge`s.
- Hard-coded sample nodes; no real project data yet.
- Toolbar stubs: Add Event, Auto layout, Filters, Fit, Snap.

#### Required evolution

**Richer EventNode**

```ts
interface EventNode {
  id: EntityId;
  position: { x: number; y: number };
  title: string;                 // short
  description?: string;          // longer notes
  type: EventType;               // "plot" | "character-beat" | "revelation" | "transition" | ...
  linkedCharacters: LinkedCharacter[];
  // optional script link
  scriptRange?: { start: number; end: number } | { markerId: EntityId };
  // optional evolution payload
  causesChange?: {
    characterId: EntityId;
    note: string;                // “at this point…”
  };
}

interface LinkedCharacter {
  characterId: EntityId;
  role?: string;                 // “protagonist”, “witness”, etc.
  stateNote?: string;
}

type EventType = "plot" | "character-beat" | "revelation" | "transition" | string;
```

**Visual rules**
- Node appearance varies by `type` (colour / icon / border).
- Linked characters appear as chips or small avatars on the node.
- Clicking a chip focuses the Character (Source or Graph).
- “Character beat” nodes can create / update an entry in that character’s `history`.

**Interactions to implement**
- Add node from toolbar or from port click (already partially there).
- Drag character from Characters module (or a palette) onto a node → adds to `linkedCharacters`.
- Filters (toolbar): by type, by character, “show only arcs of character X”.
- Fit-to-screen and snap-to-grid remain.
- Auto-layout is optional polish; not blocking.

**Canvas contract**
- Keep the existing hand-rolled pan/zoom + port interaction model.
- Replace hard-coded `initialNodes` / `initialEdges` with live data from `projectStore.timeline`.
- All mutations go through the project store so they participate in snapshots.

#### Acceptance criteria
- [ ] Nodes are persisted in the Project and restored on load.
- [ ] Node has title, type, description, and linked characters.
- [ ] Linking a character is possible and visible.
- [ ] Filter by character works.
- [ ] A character-beat node can write into that character’s evolution history.
- [ ] Bidirectional jump with Write markers works in at least one direction.

---

## 3. Characters Module

### feat(characters)

#### Goals
- Not classical cards or flat lists.
- Hybrid: Graph overview + Source document for deep work.
- Characters are a living “codebase” that Write and Timeline reference.
- Evolution is first-class.

#### Modes

**Graph mode (default overview)**
- Spatial canvas of characters (same interaction language as Timeline: pan/zoom, nodes, edges).
- Nodes = characters.
- Edges = typed relations (`CharacterRelation`).

```ts
interface CharacterRelation {
  id: EntityId;
  sourceId: EntityId;
  targetId: EntityId;
  type: string;                 // "family" | "rival" | "secret" | "ally" | ...
  note?: string;
}
```

- Click character → focus / open Source mode.
- Drag to create relations (ports or similar).
- Visual density should stay tool-like, not decorative.

**Source mode**
- Focused document for one character.
- Structured sections (editable):
  - Core (name, role, appearance notes…)
  - Personality / traits
  - Backstory
  - Visual references (later)
  - **Evolution / Appearances** — list of Timeline nodes where this character appears or has a `causesChange` entry, plus the notes.
- Version history of the character itself (list of `CharacterVersion`).
- Editing the source creates a new history entry when the change is meaningful.

```ts
interface CharacterSource {
  // free-form or structured fields
  sections: Record<string, string>; // or more typed
  // ...
}

interface CharacterVersion {
  id: EntityId;
  createdAt: string;
  label?: string;
  sourceSnapshot: CharacterSource;
  // optional link back to the Timeline node that triggered it
  triggeredByNodeId?: EntityId;
}
```

#### Navigation between modes
- Graph ↔ Source is instant and stateful (preserve graph viewport when returning).
- From any mention in Write or chip on Timeline → land in Source (or Graph if that was last context).

#### Empty & first-run states
- Empty Graph shows a clear call-to-action to create the first character.
- Creating a character from Write’s `@` autocomplete (if the name does not exist) should be possible.

#### Acceptance criteria
- [ ] Graph shows characters and typed relations.
- [ ] Source mode shows structured content + Evolution list.
- [ ] Evolution list is populated from Timeline character-beats / linked nodes.
- [ ] Edits to Source create history entries.
- [ ] Character is referenceable from Write and Timeline.
- [ ] No classical card grid or flat list as the primary UI.

---

## 4. Cross-module Connections

### feat(links)

This is not a separate screen; it is the contract that makes the three modules a system.

| Direction              | Mechanism                              | Behaviour |
|------------------------|----------------------------------------|-----------|
| Write → Character      | `@` mention + annotation               | Autocomplete, hover peek, click → Source/Graph |
| Write → Timeline       | Marker / scriptRange on EventNode      | Jump both ways, visual indicator |
| Timeline → Character   | `linkedCharacters` + chips             | Click chip → Character; filter canvas by character |
| Timeline → Character evolution | `causesChange` on node            | Writes into `Character.history` |
| Character → Timeline   | Appearances list in Source             | Jump to node(s) |
| Character → Character  | `relations` in Graph                   | Typed edges |

All references must use stable `EntityId`s, never display names, so renames stay consistent.

---

## 5. Shared Shell & Navigation

### feat(shell)

Already present and should be preserved:
- Left floating `MenuBar`: Dashboard · Write · Timeline · Characters · Settings.
- Contextual `TopToolbar` that changes per route.
- Dark zinc + amber visual language.
- Layout that keeps the active module full-height under the toolbar.

#### Required additions
- Characters route must render the Hybrid surface (Graph default).
- Dashboard can remain minimal for now (project title, last opened, recent snapshots).
- Settings remains the place for future persistence / export preferences.

#### State ownership
- `uiStore` → presentation only (snap, colours, line numbers, current mode inside Characters, etc.).
- `projectStore` → all durable content and history.

---

## 6. Implementation Order (recommended)

1. **feat(storage)** – Project model + Zustand project store + basic IndexedDB persistence + snapshot create/restore.
2. **feat(write)** – Wire existing editor to project store; add annotation layer + `@` autocomplete.
3. **feat(timeline)** – Replace hard-coded nodes with live data; enrich EventNode shape; character linking + filters.
4. **feat(characters)** – Graph + Source dual mode; relations; evolution list fed by Timeline.
5. **feat(links)** – Close the loops (markers, chips, jumps, rename propagation).
6. Polish: auto-snapshots, export/import, empty states, keyboard flows.

---

## 7. Out of scope for this version

- Real-time collaboration.
- Cloud sync / accounts.
- Full git-style branching and merging.
- AI assistance.
- Classical character card grids or spreadsheet views.
- Mobile-first redesign (desktop tool density is intentional).

---

## 8. Open decisions (do not invent silently)

- Exact set of default `EventType` values.
- Exact set of default relation types.
- Whether Source sections are fully free-form Markdown or a fixed schema of fields.
- Auto-snapshot interval and triggers.
- File format for project export (plain JSON vs zip).

Record any decision in this document or in PRODUCT.md when it is made.

---

*End of technical specification.*  
Implement against the data shapes and acceptance criteria above. When in doubt, prefer the spatial, reference-based model over isolated CRUD screens.

