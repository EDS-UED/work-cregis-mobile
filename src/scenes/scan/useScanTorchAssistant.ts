import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_TORCH_DELAY_MS = 2_000;

type UseScanTorchAssistantOptions = {
  cameraReady: boolean;
  permissionGranted: boolean;
};

/** 环境偏暗时主动开灯；用户手动切换后本页不再自动开。 */
export function useScanTorchAssistant({
  cameraReady,
  permissionGranted,
}: UseScanTorchAssistantOptions) {
  const [torchOn, setTorchOn] = useState(false);
  const userTouchedRef = useRef(false);
  const autoFiredRef = useRef(false);

  useEffect(() => {
    if (
      !cameraReady ||
      !permissionGranted ||
      userTouchedRef.current ||
      autoFiredRef.current
    ) {
      return;
    }
    const timer = setTimeout(() => {
      autoFiredRef.current = true;
      setTorchOn(true);
    }, AUTO_TORCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [cameraReady, permissionGranted]);

  const toggleTorch = useCallback(() => {
    userTouchedRef.current = true;
    setTorchOn((prev) => !prev);
  }, []);

  return { torchOn, toggleTorch };
}
