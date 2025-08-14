import { ImageSourcePropType } from 'react-native';

export interface ImageListItem {
  image: ImageSourcePropType;
  caption: string;
}

export const imageList: ImageListItem[] = [
  {
    image: require('../../assets/images/farm.png'),
    caption: 'Pure milk, straight from healthy cows to your doorstep.',
  },
  {
    image: require('../../assets/images/society.png'),
    caption: 'Collected early morning and delivered fresh to 6 am stores',
  },
  {
    image: require('../../assets/images/store.png'),
    caption: 'Delivered fresh to 6 am stores – from farm to home.',
  },
  {
    image: require('../../assets/images/customer.png'),
    caption: 'No middlemen, no compromise — just farm-fresh milk.',
  },
];