import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

import { useHomeStore } from '@/store';

/** 管理个人资料 · 从相册选一张图作为头像。 */
export function useProfileAvatarPicker() {
  const { t } = useTranslation();
  const setUserAvatarUri = useHomeStore((state) => state.setUserAvatarUri);

  return useCallback(async () => {
    const current = await ImagePicker.getMediaLibraryPermissionsAsync();
    let granted = current.granted;
    if (!granted) {
      const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
      granted = requested.granted;
    }
    if (!granted) {
      const canAskAgain =
        (await ImagePicker.getMediaLibraryPermissionsAsync()).canAskAgain !== false;
      Alert.alert(t('profile.avatarPermissionTitle'), t('profile.avatarPermissionMessage'), [
        canAskAgain
          ? {
              text: t('profile.avatarGrantPermission'),
              onPress: () => void ImagePicker.requestMediaLibraryPermissionsAsync(),
            }
          : {
              text: t('profile.avatarOpenSettings'),
              onPress: () => void Linking.openSettings(),
            },
      ]);
      return;
    }

    const pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    const uri = pick.canceled ? undefined : pick.assets[0]?.uri;
    if (uri) {
      setUserAvatarUri(uri);
    }
  }, [setUserAvatarUri, t]);
}
