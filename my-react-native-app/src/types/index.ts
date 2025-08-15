export type NavigationProps = {
  navigate: (screen: string) => void;
};

export type SplashScreenProps = {
  duration?: number;
};

export type HomeScreenProps = {
  user?: {
    name: string;
    age: number;
  };
};