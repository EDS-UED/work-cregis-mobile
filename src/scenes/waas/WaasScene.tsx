import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SceneCard } from '@/scenes/shared/SceneCard';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useWaasStore } from '@/store';

export function WaasScene() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const projects = useWaasStore((state) => state.projects);
  const shellView = useWaasStore((state) => state.shellView);
  const openCreate = useWaasStore((state) => state.openCreate);
  const cancelCreate = useWaasStore((state) => state.cancelCreate);
  const createProject = useWaasStore((state) => state.createProject);
  const [projectName, setProjectName] = useState('');

  return (
    <SceneScaffold title={t('scenes.waasTitle')} subtitle={t('scenes.waasSubtitle')}>
      {shellView === 'empty' && projects.length === 0 ? (
        <SceneCard
          title={t('waas.empty')}
          onPress={openCreate}
          inspect={{
            label: 'WaasEmptyState',
            motionScene: 'motion-flotation',
            motionPreset: 'spring.default',
            layoutLines: ['align-items: center'],
            styleLines: ['background: var(--material-card-shallow)'],
          }}
        >
          <Text>{t('waas.create')}</Text>
        </SceneCard>
      ) : null}

      {shellView === 'create' ? (
        <View style={{ gap: 8 }}>
          <TextInput
            value={projectName}
            onChangeText={setProjectName}
            placeholder={t('waas.projectName')}
            placeholderTextColor={colors['text-base-tertiary']}
            style={{
              borderWidth: 1,
              borderColor: colors['stroke-divider'],
              borderRadius: 8,
              padding: 12,
              color: colors['text-base-primary'],
            }}
          />
          <Pressable onPress={() => createProject(projectName)}>
            <Text style={{ color: colors.brand }}>{t('waas.submit')}</Text>
          </Pressable>
          <Pressable onPress={cancelCreate}>
            <Text style={{ color: colors['text-base-secondary'] }}>{t('waas.cancel')}</Text>
          </Pressable>
        </View>
      ) : null}

      {projects.length > 0
        ? projects.map((project) => (
            <SceneCard
              key={project.id}
              title={project.name}
              inspect={{
                label: 'WaasProjectCard',
                motionScene: null,
                motionPreset: null,
                layoutLines: ['padding: var(--spacing-4)'],
                styleLines: ['background: var(--material-card-shallow)'],
              }}
            >
              <Text>{project.id}</Text>
            </SceneCard>
          ))
        : null}
    </SceneScaffold>
  );
}
