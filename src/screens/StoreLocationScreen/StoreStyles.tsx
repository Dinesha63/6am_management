import { StyleSheet } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

export default StyleSheet.create({
  container: { flex: 1 },

  map: {
    position: 'absolute',
    top: hp(7), 
    left: 0,
    right: 0,
    bottom: 0,
  },

  appBar: {
    position: 'absolute',
    top: 0,
    height: hp(7), 
    width: '100%',
    zIndex: 20,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4), 
    justifyContent: 'space-between',
  },

  backButton: {
    width: wp(10), 
    height: wp(10),
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    width: wp(5), 
    height: wp(5),
    resizeMode: 'contain',
  },

  appBarTitle: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.black,
  },

  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',

    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    padding: rsp(20),
    alignItems: 'center',
  },

  mapIcon: {
    width: wp(25),
    height: wp(25),
    marginBottom: hp(1.5),
    resizeMode: 'contain',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },

  listTitle: {
    fontSize: sp(16),
    fontWeight: '600',
    marginBottom: hp(3),
  },

  subtitlebutton: {
    fontSize: sp(12),
    color: Colors.primary,
    marginBottom: hp(3),
    textAlign: 'left',
    fontWeight: 'bold',
  },

  title: {
    fontSize: sp(16),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },

  subtitle: {
    fontSize: sp(12),
    color: Colors.black,
    marginBottom: hp(2),
    textAlign: 'center',
  },

  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
    marginTop: hp(2),
  },

  confirmText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  storeItem: {
    padding: rsp(10),
    borderBottomWidth: 1,
    borderColor: Colors.grey,
  },

  selectedStoreItem: {
    borderLeftWidth: 4,
     borderLeftColor: Colors.primary,
    backgroundColor: Colors.greyBackground,
  },

  bannerWords: {
    fontSize: sp(12),
    color: Colors.black,
    textAlign: 'center',
    marginTop: hp(2),
  },

  locateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
    marginTop: hp(2),
    width: '100%',
    alignItems: 'center',
  },

  locateButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: sp(16),
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    marginBottom: hp(1),
  },

  storeImage: {
    width: wp(15),      
    height: wp(15),     
    borderRadius: 6,    
    marginRight: wp(3),
  },
  StoremapIcon: {
  width: 24, 
  height: 24,
  borderRadius: 20, 
  backgroundColor: Colors.primary, 
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 16,}  ,
  storeCardUnique: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  storeCardAccent: {
    width: 6,
    height: '90%',
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: 8,
    alignSelf: 'center',
  },
  storeCardImage: {
    width: 60,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: Colors.greyBackground,
  },
  storeCardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  storeCardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: Colors.black,
  },
  storeCardAddress: {
    color: Colors.lightGrey,
    fontSize: 13,
    marginBottom: 4,
  },
  storeCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  storeCardClockIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: Colors.primary,
  },
  storeCardTime: {
    fontSize: 13,
    color: Colors.primary,
    marginRight: 8,
  },
  storeCardDistance: {
    fontSize: 13,
    color: Colors.grey,
  },
  uniqueStoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.grey,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.15,
    // shadowRadius: 16,
    // elevation: 2,
    overflow: 'visible',
    position: 'relative',
    minHeight: 100,
  },
  uniqueStoreCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#e8fbe8',
  },
  gradientAccent: {
    // position: 'absolute',
    // left: 0,
    // top: 0,
    // bottom: 0,
    // width: 8,
    // borderTopLeftRadius: 20,
    // borderBottomLeftRadius: 20,
    // backgroundColor: Colors.primary, // fallback, use gradient lib for real gradient
    // zIndex: 1,
  },
  imageWrapper: {
    marginLeft: 16,
    marginRight: 12,
    // zIndex: 2,
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.12,
    // shadowRadius: 8,
  },
  uniqueStoreImage: {
    width: 60,
    height: 96,
    // borderRadius: 16,
    // borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
    // marginTop: -20,
  },
  uniqueStoreContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingRight: 12,
  },
  uniqueStoreTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginBottom: 2,
  },
  uniqueStoreAddress: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8fbe8',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    tintColor: '#28c76f',
  },
  badgeText: {
    fontSize: 12,
    color: '#28c76f',
    fontWeight: '600',
  },
});
