declare module '*.png' {
  const source: number;
  export default source;
}

declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const ReactComponent: FC<SvgProps>;
  export default ReactComponent;
}
