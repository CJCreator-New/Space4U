export const FEATURE_FLAGS = {
  ENABLE_MODERN_UI: import.meta.env.VITE_MODERN_UI === 'true' || false,
  ENABLE_ANIMATIONS: import.meta.env.VITE_ANIMATIONS === 'true' || true,
  ENABLE_ACCESSIBILITY_ENHANCEMENTS: true
};

export const useFeatureFlag = (flag) => {
  return FEATURE_FLAGS[flag];
};
