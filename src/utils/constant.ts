import {Dimensions, ImageSourcePropType} from 'react-native';
import { fileMapCacheDirectory } from '../../metro.config';

export const {width, height} = Dimensions.get('window');

interface ImageListItem {
  image: ImageSourcePropType;
  caption: string;
}

export const imageList: ImageListItem[] = [
  {
    image: require('../assets/images/farm.png'),
    caption: 'Pure milk, straight from healthy cows to your doorstep.',
  },
  {
    image: require('../assets/images/society.png'),
    caption: 'Collected early morning and delivered fresh to 6 am stores',
  },
  {
    image: require('../assets/images/store.png'),
    caption: 'Delivered fresh to 6 am stores – from farm to home.',
  },
  {
    image: require('../assets/images/customer.png'),
    caption: 'No middlemen, no compromise — just farm-fresh milk.',
  },
];

interface ColorsType {
  primary: string;
  backgroundLight: string;
  backgroundCream: string;
  text: string;
  price: string;
  buttonAddBackground: string;
  buttonAddText: string;
  yellow: string;
  orange: string;
  green: string;
  violet: string;
  gray: string;
  red: string;
  lightViolet: string;
}

export const COLORS: ColorsType = {
  primary: '#7CC467',
  backgroundLight: '#C0F8B1',
  backgroundCream: '#FAF3A0',
  text: '#000000',
  price: '#FE724E',
  buttonAddBackground: '#E5FFFD',
  buttonAddText: '#0AA99C',
  yellow: '#FFBC00',
  orange: '#EB6A6A',
  green: '#90D272',
  violet: '#734CC9',
  gray: '#6F7F95',
  red: '#D6293A',
  lightViolet: '#9d80dc',
};

interface FontFamilyType {
  REGULAR: string;
  MEDIUM: string;
  SEMIBOLD: string;
  BOLD: string;
}

export const FontFamily: FontFamilyType = {
  REGULAR: 'Roboto-Regular',
  MEDIUM: 'Roboto-Medium',
  SEMIBOLD: 'Roboto-SemiBold',
  BOLD: 'Roboto-Bold',
};

interface FontSizeType {
  XS: number;
  SM: number;
  MD: number;
  LG: number;
  XL: number;
  XXL: number;
  XXXL: number;
}

export const FontSize: FontSizeType = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 28,
};




// export enum TransactionTabType {
//   ALL = 'All',
//   CREDITS = 'Credits Added',
//   PURCHASES = 'Purchases'
// }

// export const TRANSACTIONTABS = [
//   TransactionTabType.ALL,
//   TransactionTabType.CREDITS,
//   TransactionTabType.PURCHASES,
// ];

export type TransactionTabType = 'All' | 'Credits Added' | 'Purchases' | '6am Credit';

export const TRANSACTIONTABS: TransactionTabType[] = [
  'All',
  'Credits Added',
  'Purchases',
  '6am Credit',
];
