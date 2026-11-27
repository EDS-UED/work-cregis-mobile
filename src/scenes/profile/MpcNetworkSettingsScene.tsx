import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgReddot } from '@/eds/feedback';
import { EgDivider, EgSystemTag } from '@/eds/home-ui';
import { EG_ITEM_PAD_H, EG_ITEM_PAD_V } from '@/eds/item';
import { EgRadio, EgSwitch } from '@/eds/toggle';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { PersonalCenterSettingsGroup } from '@/scenes/profile/PersonalCenterSettingsGroup';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { EDS_MOTION_OPACITY, edsPx } from '@/utils/edsTheme';

type NodeTone = 'success' | 'warning' | 'muted';

type MpcNode = {
  id: string;
  name: string;
  latency: string;
  tone: NodeTone;
  selectable: boolean;
  preferred?: boolean;
  unavailable?: boolean;
};

const MPC_NODES: readonly MpcNode[] = [
  { id: 'default', name: 'Default', latency: '152ms', tone: 'success', selectable: true },
  { id: 'asia-east', name: 'Asia East', latency: '143ms', tone: 'success', selectable: true, preferred: true },
  { id: 'middle-east', name: 'Middle East', latency: '--', tone: 'warning', selectable: true },
  { id: 'unavailable', name: 'NotAvailable', latency: '', tone: 'muted', selectable: false, unavailable: true },
];

const TONE_COLOR = {
  success: 'status-success',
  warning: 'status-warning',
  muted: 'text-base-quaternary',
} as const;

/** MPC 网络设置 · 自动选择开启时节点列表不可点。 */
export function MpcNetworkSettingsScene() {
  const { t } = useTranslation();
  const { mode, spacing, colors } = useEdsTheme();
  const [autoSelect, setAutoSelect] = useState(true);
  const [selectedId, setSelectedId] = useState('asia-east');

  return (
    <SceneScaffold title={t('profile.mpcNetworkSettings')} showNavBack pageBackground="card">
      <PersonalCenterSettingsGroup>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-4']),
            paddingHorizontal: EG_ITEM_PAD_H,
            paddingVertical: EG_ITEM_PAD_V,
          }}
        >
          <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-1']) }}>
            <SceneText variant="bodyMediumStrong">{t('profile.mpcAutoSelect')}</SceneText>
            <SceneText variant="bodySmallSecondary">{t('profile.mpcAutoSelectHint')}</SceneText>
          </View>
          <EgSwitch
            mode={mode}
            size="md"
            forceRnImplementation
            value={autoSelect}
            onValueChange={setAutoSelect}
            accessibilityLabel={t('profile.mpcAutoSelect')}
          />
        </View>
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.mpcNodeList')}>
        <View pointerEvents={autoSelect ? 'none' : 'auto'}>
            {MPC_NODES.map((node, index) => {
              const selected = selectedId === node.id;
              const rowDisabled = autoSelect || !node.selectable;
              const toneColor = TONE_COLOR[node.tone];
              return (
                <View key={node.id} style={{ opacity: rowDisabled ? EDS_MOTION_OPACITY.subtle : EDS_MOTION_OPACITY.visible }}>
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected, disabled: rowDisabled }}
                    accessibilityLabel={node.name}
                    disabled={rowDisabled}
                    onPress={() => setSelectedId(node.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: edsPx(spacing['spacing-3']),
                      paddingHorizontal: EG_ITEM_PAD_H,
                      paddingVertical: EG_ITEM_PAD_V,
                    }}
                  >
                    <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-1']) }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-2']) }}>
                        <SceneText
                          variant="bodyMediumStrong"
                          style={{ color: String(colors[node.unavailable ? 'text-base-tertiary' : 'text-base-primary']) }}
                        >
                          {node.name}
                        </SceneText>
                        {node.preferred ? (
                          <EgSystemTag
                            mode={mode}
                            size="sm"
                            systemType="subtle"
                            status="success"
                            label={t('profile.mpcAutoPreferred')}
                          />
                        ) : null}
                        {node.unavailable ? (
                          <EgSystemTag
                            mode={mode}
                            size="sm"
                            systemType="subtle"
                            status="invalid"
                            label={t('profile.mpcUnavailable')}
                          />
                        ) : null}
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-2']) }}>
                        <EgReddot
                          mode={mode}
                          accessibilityLabel=""
                          style={{ backgroundColor: String(colors[toneColor]) }}
                        />
                        <SceneText variant="bodySmall" style={{ color: String(colors[toneColor]) }}>
                          {node.unavailable ? t('profile.mpcNoNetwork') : node.latency}
                        </SceneText>
                      </View>
                    </View>
                    <View pointerEvents="none">
                      <EgRadio
                        mode={mode}
                        size="md"
                        checked={selected}
                        disabled={rowDisabled}
                        accessibilityLabel={node.name}
                      />
                    </View>
                  </Pressable>
                  {index < MPC_NODES.length - 1 ? (
                    <View style={{ paddingHorizontal: EG_ITEM_PAD_H }}>
                      <EgDivider variant="module" mode={mode} orientation="horizontal" />
                    </View>
                  ) : null}
                </View>
              );
            })}
        </View>
      </PersonalCenterSettingsGroup>
    </SceneScaffold>
  );
}
