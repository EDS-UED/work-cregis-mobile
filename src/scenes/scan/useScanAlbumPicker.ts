import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scanFromURLAsync } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

/** 系统相册选图 · `expo-camera` `scanFromURLAsync` 识 QR。 */
export function useScanAlbumPicker() {
  const { t } = useTranslation();

  return useCallback(async () => {
    const current = await ImagePicker.getMediaLibraryPermissionsAsync();
    let granted = current.granted;
    if (!granted) {
      const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
      granted = requested.granted;
    }
    if (!granted) {
      const canAskAgain = (await ImagePicker.getMediaLibraryPermissionsAsync()).canAskAgain !== false;
      Alert.alert(t('home.scanAlbum'), t('home.scanAlbumPermissionMessage'), [
        canAskAgain
          ? {
              text: t('home.scanAlbumGrantPermission'),
              onPress: () => void ImagePicker.requestMediaLibraryPermissionsAsync(),
            }
          : {
              text: t('home.scanOpenSettings'),
              onPress: () => void Linking.openSettings(),
            },
      ]);
      return;
    }

    const pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (pick.canceled || !pick.assets[0]?.uri) {
      return;
    }

    const uri = pick.assets[0].uri;

    try {
      const codes = await scanFromURLAsync(uri, ['qr']);
      const data = codes.find((c) => c.data?.trim())?.data?.trim();
      if (!data) {
        Alert.alert(t('home.scan'), t('home.scanAlbumNoQr'));
        return;
      }
      Alert.alert(t('home.scanResultTitle'), data, [{ text: t('home.scanAgain') }]);
    } catch {
      Alert.alert(t('home.scan'), t('home.scanAlbumNoQr'));
    }
  }, [t]);
}
