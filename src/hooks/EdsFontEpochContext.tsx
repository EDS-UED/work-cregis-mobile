import { createContext, useContext, type PropsWithChildren } from 'react';

const EdsFontEpochContext = createContext(0);

export function useEdsFontEpoch() {
  return useContext(EdsFontEpochContext);
}

export function EdsFontEpochProvider({
  epoch,
  children,
}: PropsWithChildren<{ epoch: number }>) {
  return (
    <EdsFontEpochContext.Provider value={epoch}>{children}</EdsFontEpochContext.Provider>
  );
}
