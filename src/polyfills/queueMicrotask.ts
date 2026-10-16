/**
 * Hermes 上未必有 `queueMicrotask`；react-native-worklets / Reanimated 4 在 JS 线程会调用它。
 * 须在任意 worklets 模块加载前执行（见 `index.ts`）。
 */
const globalRef = globalThis as typeof globalThis & {
  queueMicrotask?: (callback: () => void) => void;
};

if (typeof globalRef.queueMicrotask !== 'function') {
  globalRef.queueMicrotask = (callback: () => void) => {
    Promise.resolve()
      .then(callback)
      .catch((error: unknown) => {
        setTimeout(() => {
          throw error;
        }, 0);
      });
  };
}
