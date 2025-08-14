import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import {
  addOrEditDays,
  getDerivePeriodsFromSelectedDates,
  isMarkedDatesClean,
  MarkedDates,
  Period,
  Toast,
} from './Extension';
import ButtonComponent from './ButtonComponent';
import { FontFamily } from '../../../utils/constant';
import { imagePaths } from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,            
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';

type CalendarDatePickerProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  vacationDates: MarkedDates;
  handleVacationDates: (dates: MarkedDates) => void;
  setPauseVacation: (visible: boolean) => void;
};

export const PeriodCalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  visible,
  setVisible,
  vacationDates,
  handleVacationDates,
  setPauseVacation,
}) => {
  const minDate = addOrEditDays(new Date(), 0);
  const maxDate = addOrEditDays(new Date(), 30);
  // const [showPauseModal, setShowPauseModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState<MarkedDates>({});
  const [currentStartDate, setCurrentStartDate] = useState<string | null>();
  const [currentEndDate, setCurrentEndDate] = useState<string | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const handlePauseVacation = () => {
    setVisible(false);
    setPauseVacation(true);
    Toast('Your vacation has been resumed successfully');
    // setShowPauseModal(false);
  };

  useEffect(() => {
    if (visible) {
      const transformedDates = Object.entries(vacationDates).reduce(
        (acc, [date, dateProps]) => {
          acc[date] = {
            startingDay: dateProps.startingDay || false,
            endingDay: dateProps.endingDay || false,
            color: dateProps.color,
            textColor: 'white',
            date: date,
          };
          return acc;
        },
        {} as MarkedDates,
      );
      console.log('transformedDates', transformedDates);
      setSelectedDates(transformedDates);
      setPeriods(getDerivePeriodsFromSelectedDates(selectedDates));
      setIsSelecting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function handleDayPress(day: DateData) {
    const dateString = day.dateString;

    // Check if clicking inside an existing period
    const clickedPeriod = periods.find(period => {
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      const clickedDate = new Date(dateString);
      return clickedDate >= start && clickedDate <= end;
    });

    if (clickedPeriod) {
      handleRemovePeriods(clickedPeriod.startDate, clickedPeriod.endDate);
      return;
    }

    if (!isSelecting) {
      // Start selecting
      setCurrentStartDate(dateString);
      setCurrentEndDate(null);
      setIsSelecting(true);
      setSelectedDates({
        ...selectedDates,
        [dateString]: {
          startingDay: true,
          color: Colors.darkPurple,
          textColor: 'white',
          date: dateString,
        },
      });
    } else {
      // Complete selection
      let newStart = currentStartDate!;
      let newEnd = dateString;
      const start = new Date(newStart);
      const end = new Date(newEnd);

      if (start > end) {
        [newStart, newEnd] = [newEnd, newStart];
      }

      // Check for and remove any periods that are completely within the new period
      const updatedPeriods = periods.filter(period => {
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);

        // Check if the existing period is completely within the new period
        const isWithinNewPeriod = periodStart >= start && periodEnd <= end;

        // Keep the period only if it's NOT completely within the new period
        return !isWithinNewPeriod;
      });

      const newPeriod: Period = {startDate: newStart, endDate: newEnd};
      setPeriods([...updatedPeriods, newPeriod]);
      handleMarkPeriods([...updatedPeriods, newPeriod]);
      setCurrentStartDate(null);
      setCurrentEndDate(null);
      setIsSelecting(false);
    }
  }

  function handleMarkPeriods(periodsList: Period[]) {
    const newMarkedDates: MarkedDates = {};

    periodsList.forEach(period => {
      const startDateObj = new Date(period.startDate);
      const endDateObj = new Date(period.endDate);
      const timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      for (let i = 0; i <= diffDays; i++) {
        const currentDate = new Date(startDateObj);
        currentDate.setDate(startDateObj.getDate() + i);
        const currentDateString = currentDate.toISOString().split('T')[0];

        if (diffDays === 0) {
          newMarkedDates[currentDateString] = {
            startingDay: true,
            endingDay: true,
            color: Colors.darkPurple,
            textColor: 'white',
            date: currentDateString,
          };
        } else if (i === 0) {
          newMarkedDates[currentDateString] = {
            startingDay: true,
            color: Colors.darkPurple,
            textColor: 'white',
            date: currentDateString,
          };
        } else if (i === diffDays) {
          newMarkedDates[currentDateString] = {
            endingDay: true,
            color: Colors.darkPurple,
            textColor: 'white',
            date: currentDateString,
          };
        } else {
          // Between dates marked as light color
          newMarkedDates[currentDateString] = {
            color: Colors.lightSecondary,
            textColor: 'white',
            date: currentDateString,
          };
        }
      }
    });

    setSelectedDates(newMarkedDates);
  }

  function handleRemovePeriods(startDate: string, endDate: string) {
    const updatedPeriods = periods.filter(
      p => !(p.startDate === startDate && p.endDate === endDate),
    );
    setPeriods(updatedPeriods);
    handleMarkPeriods(updatedPeriods);
  }

  return (
    <>
      {/* <AlertModal
        open={showPauseModal}
        setOpen={setShowPauseModal}
        title="Pause Vacation"
        description="Are you sure you want to pause vacation ?"
        confirmText="Pause Vacation"
        onConfirm={handlePauseVacation}
      /> */}
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(!visible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.calendarPickerHeader}>
              <Text style={styles.text}>Mark vacation</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setVisible(false)}>
                <Image style={styles.icons} source={imagePaths.CLOSE_ICON} />
              </TouchableOpacity>
            </View>
            <Calendar
              style={styles.calendar}
              minDate={minDate}
              maxDate={maxDate}
              markingType="period"
              markedDates={selectedDates}
              onDayPress={handleDayPress}
              hideExtraDays={true}
              theme={{
                dayTextColor: 'black',
                arrowColor: 'black',
                reservationsBackgroundColor: 'red',
              }}
            />
            <View style={styles.calendarFooter}>
              {/* <ButtonComponent
                title="Pause Vacation"
                style={styles.calendarPickerSaveButton}
                backgroundColor={COLORS.violet}
                onPress={handlePauseVacation}
              /> */}
              <ButtonComponent
                title="Submit"
                style={styles.calendarPickerSaveButton}
                backgroundColor={Colors.greenColour}
                disabled={!isMarkedDatesClean(selectedDates)}
                onPress={() => {
                  handleVacationDates(selectedDates);
                  setVisible(!visible);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
  },
  container: {
    paddingBottom: hp(1.85), // ≈15px
  },
  calendar: {},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blackText,
  },
  modalView: {
    margin: wp(5.3), // ≈20px
    backgroundColor: Colors.white,
    padding: wp(5.3), // ≈20px
    borderRadius: wp(2.6), // ≈10px
    elevation: 30,
    width: '90%',
  },
  icons: {
    width: wp(7.5), // ≈28px
    height: wp(7.5),
  },
  calendarPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: hp(1.2), // ≈10px
  },
  calendarPickerSaveButton: {
    paddingHorizontal: wp(8), // ≈30px
    paddingVertical: hp(1.2), // ≈10px
  },
  datesContainer: {
    marginTop: hp(2.5),     // ≈20px
    padding: wp(4),         // ≈15px
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(1.3),  // ≈5px
  },
  sectionTitle: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    marginVertical: hp(0.6), // ≈5px
    color: Colors.blackText,
  },
  dateText: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    marginVertical: hp(0.4), // ≈3px
    color: Colors.blackText,
  },
  periodText: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    marginVertical: hp(0.4), // ≈3px
    color: Colors.grey,
    marginLeft: wp(2.6), // ≈10px
    padding: wp(1.3),    // ≈5px
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(0.8), // ≈3px
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2.5), // ≈20px
  },
});

