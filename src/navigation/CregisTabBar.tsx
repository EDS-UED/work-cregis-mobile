import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EgCregisTabBar } from '@eds-evergreen/mobile';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { tabI18nKeys } from '@/navigation/types';
import type { TabRouteName } from '@/types/app';

export function CregisTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = useThemeColors();
  const { t } = useTranslation();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.page, borderTopColor: colors['stroke-divider'] }]}>
      <EgCregisTabBar testID="cregis-tab-bar" style={styles.dsTabBar} />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const routeName = route.name as TabRouteName;
          const { options } = descriptors[route.key];
          const label = t(tabI18nKeys[routeName]);
          const focused = state.index === index;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              style={styles.tab}
            >
              <Text
                style={{
                  color: focused ? colors.brand : colors['text-base-secondary'],
                  fontSize: 11,
                  fontWeight: focused ? '600' : '400',
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dsTabBar: {
    height: 4,
    opacity: 0.35,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
