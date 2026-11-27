import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDataListRowPressable } from '@/eds/data-list';
import { egReddotSizePx } from '@/eds/feedback';
import { EgInput } from '@/eds/input';
import { EgDecorButton } from '@/eds/scene-buttons';
import { EgSheets } from '@/eds/sheets';
import {
  EG_ITEM_ICON_GAP,
  EG_ITEM_ICON_SLOT,
  EG_ITEM_MIN_HEIGHT,
  EG_ITEM_PAD_H,
  EG_ITEM_PAD_V,
  EgItem,
} from '@/eds/item';
import { EgSymbol } from '@/eds/profile-icons';
import { EgAvatar } from '@/eds/button-glass';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { PersonalCenterSettingsGroup } from '@/scenes/profile/PersonalCenterSettingsGroup';
import { useProfileAvatarPicker } from '@/scenes/profile/useProfileAvatarPicker';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import {
  useAccountEmail,
  useHomeUserAvatarColorIndex,
  useHomeUserAvatarSource,
  useHomeUserDisplayName,
} from '@/scenes/shared/homeUserIdentity';
import { useHomeStore } from '@/store';
import { maskEmail } from '@/utils/maskEmail';
import { edsPageCardBackground, edsPx } from '@/utils/edsTheme';

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 20;

/** 2–20 位中英文、数字、下划线或连字符。 */
function isNicknameValid(value: string): boolean {
  if (value.length < NICKNAME_MIN_LENGTH || value.length > NICKNAME_MAX_LENGTH) {
    return false;
  }
  return /^[\u4e00-\u9fffA-Za-z0-9_-]+$/.test(value);
}

type NicknameEditSheetProps = {
  visible: boolean;
  initialName: string;
  onDismiss: (nextName: string | null) => void;
};

function NicknameEditSheet({ visible, initialName, onDismiss }: NicknameEditSheetProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const [draft, setDraft] = useState(initialName);

  useEffect(() => {
    if (visible) {
      setDraft(initialName);
    }
  }, [initialName, visible]);

  const closeSheet = () => {
    onDismiss(isNicknameValid(draft) ? draft : null);
  };

  return (
    <EgSheets
      visible={visible}
      onDismiss={closeSheet}
      mode={mode}
      detents={['medium']}
      initialDetent="medium"
      showTitle={false}
      showLeft={false}
      showRight={false}
      showDragIndicator
      dismissible
      testID="profile-nickname-sheet"
      actions={
        <EgDecorButton
          label={t('profile.nicknameConfirm')}
          mode={mode}
          size="lg"
          figmaType="primary"
          onPress={closeSheet}
          style={{ alignSelf: 'stretch' }}
          testID="profile-nickname-sheet-confirm"
        />
      }
    >
      <View style={{ gap: edsPx(spacing['spacing-4']) }}>
        <SceneText variant="title" style={{ textAlign: 'center' }}>
          {t('profile.nicknameSheetTitle')}
        </SceneText>
        <EgInput
          mode={mode}
          size="xl"
          value={draft}
          showClear={false}
          placeholder={t('profile.nicknameSheetTitle')}
          onChangeText={(text) => setDraft(text.slice(0, NICKNAME_MAX_LENGTH))}
          testID="profile-nickname-sheet-input"
        />
        <SceneText variant="bodySmallSecondary" style={{ textAlign: 'center' }}>
          {t('profile.nicknameRule')}
        </SceneText>
      </View>
    </EgSheets>
  );
}

/** 管理个人资料 · 设置页分组卡片 + 头像 / 昵称 / 账户。 */
export function ProfileEditScene() {
  const { t } = useTranslation();
  const accountEmail = useAccountEmail();
  const { mode, spacing, colors } = useEdsTheme();
  const displayName = useHomeUserDisplayName();
  const avatarColorIndex = useHomeUserAvatarColorIndex();
  const avatarSource = useHomeUserAvatarSource();
  const setUserDisplayName = useHomeStore((state) => state.setUserDisplayName);
  const pickAvatar = useProfileAvatarPicker();
  const avatarSize = edsPx(spacing['avatar-5xl']);
  const badgeSize = edsPx(spacing['spacing-6']);
  const [nicknameSheetVisible, setNicknameSheetVisible] = useState(false);
  const [nicknameSheetSession, setNicknameSheetSession] = useState(0);

  const userIcon = (
    <EgSymbol
      name="eds-user-mobiletabbar"
      mode={mode}
      size="md"
      strokeColorToken="text-base-primary"
      accessibilityLabel=""
    />
  );
  const editIcon = (
    <EgSymbol
      name="eds-editor"
      mode={mode}
      size="md"
      strokeColorToken="text-base-tertiary"
      accessibilityLabel={t('profile.nickname')}
    />
  );

  return (
    <SceneScaffold title={t('profile.changeNickname')} showNavBack pageBackground="card">
      <View
        style={{
          alignItems: 'center',
          gap: edsPx(spacing['spacing-3']),
          paddingTop: edsPx(spacing['spacing-4']),
          paddingBottom: edsPx(spacing['spacing-4']),
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('profile.changeAvatar')}
          onPress={() => void pickAvatar()}
          testID="profile-change-avatar"
          style={{ width: avatarSize, height: avatarSize }}
        >
          <EgAvatar
            name={displayName}
            size="5xl"
            colorIndex={avatarColorIndex}
            source={avatarSource}
            accessibilityLabel={displayName}
          />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: badgeSize,
              height: badgeSize,
              borderRadius: edsPx(spacing['radius-full']),
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: String(colors['material-card-same-white']),
              borderWidth: edsPx(spacing['spacing-05']),
              borderColor: edsPageCardBackground(colors),
            }}
          >
            <EgSymbol
              name="eds-camera-1"
              mode={mode}
              size="xs"
              strokeColorToken="text-base-primary"
              accessibilityLabel=""
            />
          </View>
        </Pressable>
        <SceneText variant="title">{displayName}</SceneText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-2']),
            paddingHorizontal: edsPx(spacing['spacing-3']),
            paddingVertical: edsPx(spacing['spacing-1']),
            borderRadius: edsPx(spacing['radius-full']),
            backgroundColor: String(colors['material-card-same-white']),
          }}
        >
          <View
            style={{
              width: egReddotSizePx,
              height: egReddotSizePx,
              borderRadius: edsPx(spacing['radius-full']),
              backgroundColor: String(colors['status-success']),
            }}
            accessibilityLabel=""
          />
          <SceneText variant="bodySmallSecondary">{maskEmail(accountEmail)}</SceneText>
        </View>
      </View>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.nickname')}>
        <EgItem
          testID="profile-edit-nickname"
          mode={mode}
          icon={userIcon}
          label={displayName}
          trailingDisplay="custom"
          trailing={editIcon}
          showChevron={false}
          showDivider={false}
          onPress={() => {
            setNicknameSheetSession((session) => session + 1);
            setNicknameSheetVisible(true);
          }}
          accessibilityLabel={t('profile.nickname')}
        />
      </PersonalCenterSettingsGroup>

      <NicknameEditSheet
        key={nicknameSheetSession}
        visible={nicknameSheetVisible}
        initialName={displayName}
        onDismiss={(nextName) => {
          if (nextName) {
            setUserDisplayName(nextName);
          }
          setNicknameSheetVisible(false);
        }}
      />

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionAccount')}>
        <EgItem
          testID="profile-edit-logout"
          mode={mode}
          icon={
            <EgSymbol
              name="eds-arrow-exit-left"
              mode={mode}
              size="md"
              strokeColorToken="text-base-primary"
              accessibilityLabel=""
            />
          }
          label={t('profile.logOut')}
          showChevron
          showDivider
          onPress={() => undefined}
          accessibilityLabel={t('profile.logOut')}
        />
        <EgDataListRowPressable
          testID="profile-edit-delete-account"
          accessibilityLabel={t('profile.deleteAccount')}
          onPress={() => undefined}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: EG_ITEM_MIN_HEIGHT,
            paddingHorizontal: EG_ITEM_PAD_H,
            paddingVertical: EG_ITEM_PAD_V,
            gap: EG_ITEM_ICON_GAP,
          }}
        >
          <View
            style={{
              width: EG_ITEM_ICON_SLOT,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EgSymbol
              name="eds-recycle"
              mode={mode}
              size="md"
              strokeColorToken="status-danger"
              accessibilityLabel=""
            />
          </View>
          <SceneText
            variant="body"
            numberOfLines={1}
            style={{ flex: 1, minWidth: 0, color: String(colors['status-danger']) }}
          >
            {t('profile.deleteAccount')}
          </SceneText>
          <EgSymbol
            name="eds-arrow-right-ios"
            mode={mode}
            size="sm"
            strokeColorToken="status-danger"
            accessibilityLabel=""
          />
        </EgDataListRowPressable>
      </PersonalCenterSettingsGroup>
    </SceneScaffold>
  );
}
