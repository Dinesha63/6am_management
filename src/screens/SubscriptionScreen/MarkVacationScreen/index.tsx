import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AddVacationCard,
  VacationTextCard,
  UpcomingDeliveryDetailsCard,
  VacationDetailsCard,
  ResumeVacationTextCard,
} from './Components';
import {useState} from 'react';
import {
  convertToMarkedDates,
  generateRandomStatusDates,
  getCalenderDatesLength,
  getResumptionDate,
  isCalendarDatesEmpty,
  MarkedDates,
  ResponseDate,
} from './Extension';
import CalendarView from './CalendarView';
import {OrderStatus, STATUS_TYPES} from './OrderStatus';
import {PeriodCalendarDatePicker} from './PeriodCalendar';
import OrderListModel from './OrderListModel';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import SimpleIcon from '../../../components/SimpleIcon';
import {  FontFamily } from '../../../utils/constant';
import { imagePaths } from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';

const MarkVacationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [visible, setVisible] = useState(false);
  const [orderModel, setOrderModel] = useState(false);
  const [pauseVacation, setPauseVacation] = useState(false);
  const [vacationDates, setVacationDates] = useState<MarkedDates>({});
  const [dates, setDates] = useState<MarkedDates>(
    convertToMarkedDates(generateRandomStatusDates() as ResponseDate[]),
  );

  function handleVacationDates(vDates: MarkedDates) {
    const todayDateStr = new Date().toISOString().slice(0, 10);

    setDates((prevDates: MarkedDates) => {
      const newDates: MarkedDates = {};
      // Copy all past dates (before today) untouched
      Object.keys(prevDates).forEach(dateKey => {
        if (dateKey < todayDateStr) {
          newDates[dateKey] = prevDates[dateKey];
        }
      });
      // If vDates is empty, just return past dates only (removes all current+future dates)
      if (Object.keys(vDates).length === 0) {
        return newDates;
      }
      // Otherwise, add all vDates (current+future dates to keep)
      Object.keys(vDates).forEach(dateKey => {
        // Only add dates from today onwards (safety check)
        if (dateKey >= todayDateStr) {
          const d = vDates[dateKey];
          Object.assign(d, {
            marked: true,
            dotColor: STATUS_TYPES.vacation.color,
            textColor: STATUS_TYPES.vacation.color,
            status: STATUS_TYPES.vacation.key,
            label: STATUS_TYPES.vacation.label,
            selected: true,
            selectedColor: 'transparent',
            selectedTextColor: STATUS_TYPES.vacation.color,
            key: STATUS_TYPES.vacation.key,
          });
          newDates[dateKey] = d;
        }
      });
      return newDates;
    });
    setVacationDates(vDates);
  }

  return (
    <>
      <PeriodCalendarDatePicker
        visible={visible}
        setVisible={setVisible}
        vacationDates={vacationDates}
        handleVacationDates={handleVacationDates}
        setPauseVacation={setPauseVacation}
      />
      <OrderListModel open={orderModel} setOpen={setOrderModel} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SimpleIcon source={imagePaths.back_icon} style={{width: wp(6), height: wp(6), resizeMode: 'contain'}}  /> 
          </TouchableOpacity>
          <Text style={styles.title}>Mark vacation</Text>
          <View style={styles.backBtn} />
        </View>
        <ScrollView>
          <CalendarView onClick={() => setOrderModel(true)} dates={dates} />
          <HorizontalDivider />
          <View style={styles.statusDetailsContainer}>
            <OrderStatus status="undelivered" />
            <VerticalDivider />
            <OrderStatus status="canceled" />
            <VerticalDivider />
            <OrderStatus status="delivered" />
            <VerticalDivider />
            <OrderStatus status="vacation" />
          </View>
          <View style={styles.cardContainer}>
            {pauseVacation ? (
              <ResumeVacationTextCard setPauseVacation={setPauseVacation} />
            ) : (
              <>
                {isCalendarDatesEmpty(vacationDates) && (
                  <AddVacationCard setVisible={setVisible} />
                )}
                <UpcomingDeliveryDetailsCard />
                {!isCalendarDatesEmpty(vacationDates) && (
                  <>
                    <VacationTextCard
                      text={
                        getResumptionDate(vacationDates)
                          ? `Your Service will resume on ${getResumptionDate(
                              vacationDates,
                            )}`
                          : 'No vacation available'
                      }
                    />
                    <VacationDetailsCard
                      onRevoke={handleVacationDates}
                      setVisible={setVisible}
                      days={getCalenderDatesLength(vacationDates)}
                    />
                  </>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export const VerticalDivider: React.FC = () => (
  <View style={styles.verticalDivider} />
);

export const HorizontalDivider: React.FC = () => (
  <View style={styles.horizontalDivider} />
);

const styles = StyleSheet.create({
  horizontalDivider: {
    height: 1,
    backgroundColor: Colors.borderColour,
    width: '100%',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: Colors.borderColour,
    height: '100%',
  },
  dot: {
    width: wp(2.6),               
    height: wp(2.6),
    borderRadius: wp(1.3),        
    marginRight: wp(1.3),         
  },
  label: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),     
    backgroundColor: Colors.white,
  },
  calendarContainer: {
    width: '100%',
    height: hp(37),               
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    height: hp(7),              
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
  backBtn: {
    width: wp(4.8),               
    height: wp(4.8),
    tintColor: Colors.blackText,
  },
  statusDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1.85),    
  },
  cardContainer: {
    paddingVertical: hp(2.5),     
    rowGap: hp(2.5),              
  },
});

export default MarkVacationScreen;
