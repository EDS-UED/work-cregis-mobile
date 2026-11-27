export type LoginDeviceKind = 'phone' | 'desktop';

export type LoginDevice = {
  id: string;
  kind: LoginDeviceKind;
  /** 列表主标题，如 iphone (iOS 27.2.1)。 */
  name: string;
  /** 详情页平台名，如 iOS。 */
  platform: string;
  /** 列表第二行，如 mobile 3.9.0。 */
  clientLabel: string;
  /** 详情副标题，如 mobile 3.9.0(iphone)。 */
  clientDetail: string;
  online: boolean;
  deviceId: string;
  loginAt: string;
  loginIp: string;
  clientVersion: string;
  systemVersion: string;
};

/** 登录设备 · 列表与详情共用的示意数据。 */
export const LOGIN_DEVICES: readonly LoginDevice[] = [
  {
    id: 'iphone',
    kind: 'phone',
    name: 'iphone (iOS 27.2.1)',
    platform: 'iOS',
    clientLabel: 'mobile 3.9.0',
    clientDetail: 'mobile 3.9.0(iphone)',
    online: true,
    deviceId: 'SHUDFSUKYT',
    loginAt: '2026-11-25 15:04:16',
    loginIp: '42.200.149.57',
    clientVersion: '3.9.0',
    systemVersion: '27.2.1',
  },
  {
    id: 'imac',
    kind: 'desktop',
    name: 'iMac (MacOS 26.6.2)',
    platform: 'macOS',
    clientLabel: 'Desktop 3.9.1',
    clientDetail: 'Desktop 3.9.1(iMac)',
    online: true,
    deviceId: 'TZNVYDZJMJ',
    loginAt: '2026-11-25 11:28:40',
    loginIp: '42.200.149.12',
    clientVersion: '3.9.1',
    systemVersion: '26.6.2',
  },
  {
    id: 'xiaomi',
    kind: 'phone',
    name: 'Xiaomi (Android 15)',
    platform: 'Android',
    clientLabel: 'mobile 3.7.3',
    clientDetail: 'mobile 3.7.3(Xiaomi)',
    online: false,
    deviceId: 'NUSDLIMXGW',
    loginAt: '2026-11-24 19:06:52',
    loginIp: '223.88.16.41',
    clientVersion: '3.7.3',
    systemVersion: '15',
  },
  {
    id: 'mac',
    kind: 'desktop',
    name: 'Mac (MacOS 14.6.1)',
    platform: 'macOS',
    clientLabel: 'Desktop 3.7.3',
    clientDetail: 'Desktop 3.7.3(Mac)',
    online: false,
    deviceId: 'JPPNGDHYXD',
    loginAt: '2026-11-22 08:41:03',
    loginIp: '18.162.44.9',
    clientVersion: '3.7.3',
    systemVersion: '14.6.1',
  },
];
