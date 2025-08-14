export interface ScreenDimensions {
  width: number;
  height: number;
}

export interface ResponsiveConfig {
  isTablet: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  deviceType: 'mobile' | 'tablet';
  columns: number;
}

export interface ResponsiveStyles {
  container: any;
  item: any;
  text: any;
  image: any;
}

// Device type detection constants
export const DEVICE_BREAKPOINTS = {
  TABLET_MIN_WIDTH: 768,
  LARGE_TABLET_MIN_WIDTH: 1024,
} as const; 