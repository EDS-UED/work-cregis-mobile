import { Text, type TextProps } from 'react-native';

import { useEdsTypography } from '@/hooks/useEdsTypography';
import type { EdsTextVariant } from '@/utils/edsTheme';

type SceneTextProps = TextProps & {
  variant?: EdsTextVariant;
};

export function SceneText({ variant = 'body', style, ...rest }: SceneTextProps) {
  const text = useEdsTypography();
  return <Text {...rest} style={[text[variant], style]} />;
}
