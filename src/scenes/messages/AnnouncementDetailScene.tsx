import { View } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { HomeStackParamList } from '@/navigation/types';
import { findAnnouncement } from '@/scenes/messages/announcements';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type AnnouncementDetailSceneProps = {
  route: RouteProp<HomeStackParamList, 'MessagesAnnouncement'>;
};

function titleForLanguage(
  title: { 'zh-CN': string; 'en-US': string; 'zh-TW': string },
  language: string,
): string {
  if (language === 'en-US' || language.startsWith('en')) {
    return title['en-US'];
  }
  if (language === 'zh-TW' || language === 'zh-Hant' || language.startsWith('zh-TW')) {
    return title['zh-TW'];
  }
  return title['zh-CN'];
}

/** 公告正文 · 留在应用内，顶栏返回回到公告列表。 */
export function AnnouncementDetailScene({ route }: AnnouncementDetailSceneProps) {
  const { i18n } = useTranslation();
  const { spacing } = useEdsTheme();
  const article = findAnnouncement(route.params.id);
  const title = article ? titleForLanguage(article.title, i18n.language) : '';

  return (
    <SceneScaffold title={title} showNavBack showNavTitle={false}>
      {article ? (
        <View style={{ gap: edsPx(spacing['spacing-3']) }}>
          <SceneText variant="title">{title}</SceneText>
          {article.blocks.map((block, index) => {
            if (block.type === 'heading') {
              return (
                <SceneText key={`${block.type}-${index}`} variant="bodyMediumStrong">
                  {block.text}
                </SceneText>
              );
            }
            if (block.type === 'bullet') {
              return (
                <SceneText key={`${block.type}-${index}`} variant="body">
                  {`· ${block.text}`}
                </SceneText>
              );
            }
            return (
              <SceneText key={`${block.type}-${index}`} variant="body">
                {block.text}
              </SceneText>
            );
          })}
        </View>
      ) : null}
    </SceneScaffold>
  );
}
