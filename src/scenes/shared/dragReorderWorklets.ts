/**
 * 与 `QuickEntryEditSlotGrid` 文件内 worklet 同名同等逻辑 · 供列表 / 网格拖拽排序复用。
 * @see src/scenes/home/QuickEntryEditSlotGrid.tsx
 */

export type DragReorderPositions = Record<string, number>;

export type DragReorderListGeometry = {
  rowHeight: number;
  rowGap: number;
};

export function dragReorderClamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

/** `slotOrigin` · 单列纵轴。 */
export function dragReorderListOrigin(
  index: number,
  geometry: DragReorderListGeometry,
) {
  'worklet';
  return {
    y: index * (geometry.rowHeight + geometry.rowGap),
  };
}

/** `hoveredSlot` · 仅用纵坐标（`rowStride / 2` 与网格行槽一致）。 */
export function dragReorderHoveredListRow(
  y: number,
  geometry: DragReorderListGeometry,
  count: number,
) {
  'worklet';
  const rowStride = geometry.rowHeight + geometry.rowGap;
  const row = dragReorderClamp(
    Math.floor((y + rowStride / 2) / rowStride),
    0,
    count - 1,
  );
  return Math.min(count - 1, row);
}

export function dragReorderMovePosition(
  positions: DragReorderPositions,
  id: string,
  to: number,
): DragReorderPositions {
  'worklet';
  const from = positions[id];
  const next: DragReorderPositions = {};
  for (const key in positions) {
    const p = positions[key];
    if (key === id) {
      next[key] = to;
    } else if (from < to && p > from && p <= to) {
      next[key] = p - 1;
    } else if (to < from && p >= to && p < from) {
      next[key] = p + 1;
    } else {
      next[key] = p;
    }
  }
  return next;
}

export function dragReorderToPositions(ids: string[]): DragReorderPositions {
  const map: DragReorderPositions = {};
  ids.forEach((id, index) => {
    map[id] = index;
  });
  return map;
}

export function dragReorderOrderFromPositions(
  positions: DragReorderPositions,
): string[] {
  return Object.keys(positions).sort((a, b) => positions[a] - positions[b]);
}