export const FEATURE_FLAGS = {
  ENABLE_MODERN_UI: process.env.REACT_APP_MODERN_UI === 'true' || false,
  ENABLE_ANIMATIONS: process.env.REACT_APP_ANIMATIONS === 'true' || true,
  ENABLE_ACCESSIBILITY_ENHANCEMENTS: true
};

export const useFeatureFlag = (flag) => {
  return FEATURE_FLAGS[flag];
};
