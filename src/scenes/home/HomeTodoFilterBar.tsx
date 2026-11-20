import type { ReactNode } from 'react';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgTabBlock, type EgTabBlockItem } from '@/eds/tab-block';
import type { HomeTodoFilter } from '@/store';
import { edsSceneContentInset } from '@/utils/edsTheme';

export type HomeTodoFilterOption<T extends string = HomeTodoFilter> = {
  id: T;
  label: string;
  count: number;
};

type HomeTodoFilterBarProps<T extends string> = {
  options: HomeTodoFilterOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  parentContentInset?: number;
  children?: ReactNode;
  contentKey?: string;
  onContentSwitchStart?: () => void;
  contentSwipeToSwitch?: boolean;
};

/** @deprecated 实现已迁入 EDS `EgTabBlock` — 本组件为业务薄封装。 */
export function HomeTodoFilterBar<T extends string>({
  options,
  selectedId,
  onSelect,
  parentContentInset,
  children,
  contentKey,
  onContentSwitchStart,
  contentSwipeToSwitch,
}: HomeTodoFilterBarProps<T>) {
  const { mode, spacing } = useEdsTheme();
  const items: EgTabBlockItem[] = options.map((option) => ({
    id: option.id,
    label: option.label,
    count: option.count,
  }));

  return (
    <EgTabBlock
      mode={mode}
      items={items}
      selectedId={selectedId}
      parentContentInset={parentContentInset ?? edsSceneContentInset(spacing)}
      onSelect={(id: string) => onSelect(id as T)}
      contentKey={contentKey}
      onContentSwitchStart={onContentSwitchStart}
      contentSwipeToSwitch={contentSwipeToSwitch}
    >
      {children}
    </EgTabBlock>
  );
}
