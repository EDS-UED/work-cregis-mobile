import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, View, type ImageSourcePropType } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';

import { EgDivider, EgSymbol, EgSystemTag } from '@/eds/home-ui';
import { EG_ITEM_PAD_H, EG_ITEM_PAD_V } from '@/eds/item';
import { egNavBarScrollContentReserve } from '@/eds/nav-bar';
import { EgSheets } from '@/eds/sheets';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { LOGIN_DEVICES, type LoginDevice } from '@/scenes/profile/loginDevicesMock';
import { PersonalCenterSettingsGroup } from '@/scenes/profile/PersonalCenterSettingsGroup';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

import deviceIphone from '../../../assets/devices/device-iphone.png';
import deviceImac from '../../../assets/devices/device-imac.png';
import deviceAndroid from '../../../assets/devices/device-android.png';
import deviceMac from '../../../assets/devices/device-mac.png';

const DEVICE_IMAGES: Record<string, ImageSourcePropType> = {
  iphone: deviceIphone,
  imac: deviceImac,
  xiaomi: deviceAndroid,
  mac: deviceMac,
};

/** 登录设备列表 · 点一行打开账户安全详情。 */
export function LoginDevicesScene() {
  const { t } = useTranslation();
  const { mode, spacing, colors } = useEdsTheme();
  const [selected, setSelected] = useState<LoginDevice | null>(null);
  const [copied, setCopied] = useState(false);
  const tagGap = edsPx(spacing['spacing-1']);
  const iconSlot = edsPx(spacing['spacing-12']);
  const detailIconSlot = edsPx(spacing['spacing-20']);

  const sheetContentMarginTop = useMemo(() => {
    const sheetsChrome = egNavBarScrollContentReserve(
      0,
      edsPx(spacing['spacing-4']),
      edsPx(spacing['spacing-2']),
    );
    return edsPx(spacing['spacing-8']) - sheetsChrome;
  }, [spacing]);

  useEffect(() => {
    setCopied(false);
  }, [selected?.id]);

  const onlineTag = (
    <EgSystemTag
      mode={mode}
      size="sm"
      systemType="subtle"
      status="success"
      label={t('profile.deviceOnline')}
    />
  );

  const detailRow = (label: string, value: string) => (
    <View
      key={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: edsPx(spacing['spacing-4']),
      }}
    >
      <SceneText variant="body" style={{ color: String(colors['text-base-secondary']) }}>
        {label}
      </SceneText>
      <SceneText variant="body" style={{ flexShrink: 1, textAlign: 'right' }}>
        {value}
      </SceneText>
    </View>
  );

  return (
    <>
      <SceneScaffold title={t('profile.deviceLoginTitle')} showNavBack pageBackground="card">
        <PersonalCenterSettingsGroup marginBottom={0}>
          {LOGIN_DEVICES.map((device, index) => (
            <View key={device.id}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={device.name}
              onPress={() => setSelected(device)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: edsPx(spacing['spacing-4']),
                paddingHorizontal: EG_ITEM_PAD_H,
                paddingVertical: EG_ITEM_PAD_V,
              }}
            >
              <Image
                source={DEVICE_IMAGES[device.id]}
                resizeMode="contain"
                accessibilityLabel=""
                style={{ width: iconSlot, height: iconSlot }}
              />
              <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-05']) }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: tagGap }}>
                    <SceneText variant="bodySemibold" numberOfLines={1} style={{ flexShrink: 1 }}>
                      {device.name}
                    </SceneText>
                    {device.online ? onlineTag : null}
                  </View>
                  <SceneText variant="body">{device.clientLabel}</SceneText>
                  <SceneText variant="bodySmallSecondary">
                    {`${t('profile.deviceIdLabel')} ${device.deviceId}`}
                  </SceneText>
              </View>
            </Pressable>
            {index < LOGIN_DEVICES.length - 1 ? (
              <View style={{ paddingHorizontal: EG_ITEM_PAD_H }}>
                <EgDivider variant="module" mode={mode} orientation="horizontal" />
              </View>
            ) : null}
            </View>
          ))}
        </PersonalCenterSettingsGroup>
      </SceneScaffold>
      <EgSheets
        visible={selected != null}
        onDismiss={() => setSelected(null)}
        mode={mode}
        showTitle={false}
        showLeft={false}
        showRight={false}
        dismissible
        showDragIndicator
        detents={['large']}
        initialDetent="large"
        showActions={false}
        testID="login-device-detail-sheet"
      >
        {selected ? (
          <View style={{ marginTop: sheetContentMarginTop, gap: edsPx(spacing['spacing-5']) }}>
            <View style={{ alignItems: 'center', gap: edsPx(spacing['spacing-3']) }}>
              <Image
                source={DEVICE_IMAGES[selected.id]}
                resizeMode="contain"
                accessibilityLabel=""
                style={{ width: detailIconSlot, height: detailIconSlot }}
              />
              <SceneText variant="title">{selected.platform}</SceneText>
              <SceneText variant="body">{selected.clientDetail}</SceneText>
              {selected.online ? <View style={{ alignSelf: 'center' }}>{onlineTag}</View> : null}
            </View>
            <EgDivider variant="module" mode={mode} orientation="horizontal" />
            <View style={{ gap: edsPx(spacing['spacing-4']) }}>
              {detailRow(t('profile.deviceLoginTime'), selected.loginAt)}
              {detailRow(t('profile.deviceLoginIp'), selected.loginIp)}
              {detailRow(t('profile.deviceClientVersion'), selected.clientVersion)}
              {detailRow(t('profile.deviceSystemVersion'), selected.systemVersion)}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: edsPx(spacing['spacing-4']),
                }}
              >
                <SceneText variant="body" style={{ color: String(colors['text-base-secondary']) }}>
                  {t('profile.deviceSerial')}
                </SceneText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-2']) }}>
                  <SceneText variant="body">{selected.deviceId}</SceneText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={copied ? t('profile.deviceCopied') : t('profile.googleAuthCopy')}
                    hitSlop={edsPx(spacing['spacing-2'])}
                    onPress={() => {
                      void Clipboard.setStringAsync(selected.deviceId)
                        .then(() => setCopied(true))
                        .catch(() => undefined);
                    }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: edsPx(spacing['spacing-1']),
                      paddingHorizontal: edsPx(spacing['spacing-1']),
                      paddingVertical: edsPx(spacing['spacing-05']),
                      borderRadius: edsPx(spacing['radius-full']),
                      backgroundColor: pressed ? String(colors['event-tap']) : 'transparent',
                    })}
                  >
                    <EgSymbol
                      name={copied ? 'eds-tick' : 'eds-copy'}
                      mode={mode}
                      size="sm"
                      strokeColorToken={copied ? 'status-success' : 'text-base-secondary'}
                      accessibilityLabel=""
                    />
                    {copied ? (
                      <SceneText variant="bodySmall" style={{ color: String(colors['status-success']) }}>
                        {t('profile.deviceCopied')}
                      </SceneText>
                    ) : null}
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </EgSheets>
    </>
  );
}
