import { Dimensions, PixelRatio } from 'react-native';
import { ResponsiveConfig, ScreenDimensions, DEVICE_BREAKPOINTS } from './Dimensions';

// Get screen dimensions
export const getScreenDimensions = (): ScreenDimensions => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Device type detection
export const isTablet = (): boolean => {
  const { width, height } = getScreenDimensions();
  const aspectRatio = height / width;
  const pixelDensity = PixelRatio.get();
  
  // Calculate actual device dimensions in inches
  const widthInches = width / (pixelDensity * 160);
  const heightInches = height / (pixelDensity * 160);
  const diagonalInches = Math.sqrt(widthInches * widthInches + heightInches * heightInches);
  
  // Consider it a tablet if diagonal is >= 7 inches or width >= 768
  return diagonalInches >= 7 || width >= DEVICE_BREAKPOINTS.TABLET_MIN_WIDTH;
};

// Check if device is in landscape mode
export const isLandscape = (): boolean => {
  const { width, height } = getScreenDimensions();
  return width > height;
};

// Get responsive configuration
export const getResponsiveConfig = (): ResponsiveConfig => {
  const dimensions = getScreenDimensions();
  const deviceIsTablet = isTablet();
  const deviceIsLandscape = isLandscape();
  
  // Determine number of columns based on device type and orientation
  let columns = 2; // Default for mobile portrait
  
  if (deviceIsTablet) {
    columns = deviceIsLandscape ? 4 : 3;
  } else {
    columns = deviceIsLandscape ? 3 : 2;
  }
  
  return {
    isTablet: deviceIsTablet,
    isLandscape: deviceIsLandscape,
    screenWidth: dimensions.width,
    screenHeight: dimensions.height,
    deviceType: deviceIsTablet ? 'tablet' : 'mobile',
    columns,
  };
};

// Responsive width calculation
export const getResponsiveWidth = (percentage: number): number => {
  const { width } = getScreenDimensions();
  return (width * percentage) / 100;
};

// Responsive height calculation
export const getResponsiveHeight = (percentage: number): number => {
  const { height } = getScreenDimensions();
  return (height * percentage) / 100;
};

// Responsive font size based on screen width
export const getResponsiveFontSize = (baseFontSize: number): number => {
  const { width } = getScreenDimensions();
  const scale = width / 375; // Base width for scaling (iPhone X)
  const newSize = baseFontSize * scale;
  return Math.max(baseFontSize * 0.8, Math.min(newSize, baseFontSize * 1.3));
};

// Get item width for grid layout
export const getItemWidth = (columns: number, padding: number = 16): number => {
  const { width } = getScreenDimensions();
  const totalPadding = padding * (columns + 1);
  return (width - totalPadding) / columns;
};

// Responsive padding/margin
export const getResponsiveSpacing = (baseSpacing: number): number => {
  const config = getResponsiveConfig();
  return config.isTablet ? baseSpacing * 1.5 : baseSpacing;
}; 