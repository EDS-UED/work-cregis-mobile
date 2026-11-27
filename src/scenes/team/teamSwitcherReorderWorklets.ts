export type TeamSwitcherPositions = Record<string, number>;

export function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

export type TeamSwitcherListGeometry = {
  rowHeight: number;
  rowGap: number;
};

export function teamSwitcherRowOrigin(
  index: number,
  geometry: TeamSwitcherListGeometry,
) {
  'worklet';
  return {
    y: index * (geometry.rowHeight + geometry.rowGap),
  };
}

export function hoveredTeamSwitcherIndex(
  translateY: number,
  geometry: TeamSwitcherListGeometry,
  count: number,
) {
  'worklet';
  const rowStride = geometry.rowHeight + geometry.rowGap;
  return clamp(Math.round((translateY + geometry.rowHeight / 2) / rowStride), 0, count - 1);
}

export function moveTeamSwitcherPosition(
  positions: TeamSwitcherPositions,
  id: string,
  to: number,
): TeamSwitcherPositions {
  'worklet';
  const from = positions[id];
  const next: TeamSwitcherPositions = {};
  for (const key in positions) {
    const position = positions[key];
    if (key === id) {
      next[key] = to;
    } else if (from < to && position > from && position <= to) {
      next[key] = position - 1;
    } else if (to < from && position >= to && position < from) {
      next[key] = position + 1;
    } else {
      next[key] = position;
    }
  }
  return next;
}

export function teamSwitcherToPositions(ids: string[]): TeamSwitcherPositions {
  const map: TeamSwitcherPositions = {};
  ids.forEach((id, index) => {
    map[id] = index;
  });
  return map;
}

export function teamSwitcherOrderFromPositions(
  positions: TeamSwitcherPositions,
): string[] {
  return Object.keys(positions).sort((a, b) => positions[a] - positions[b]);
}