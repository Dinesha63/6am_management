import {StyleSheet, View} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import {addOrEditDays, MarkedDates, MarkingProps} from './Extension';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';

type CalendarViewProps = {
  dates: MarkedDates;
  onClick: (selected: MarkingProps) => void;
};

const CalendarView: React.FC<CalendarViewProps> = ({dates, onClick}) => {
  const minDate = addOrEditDays(new Date(), -30);
  const maxDate = addOrEditDays(new Date(), 30);

  const handleDayPress = (model: DateData) => {
    const selected: MarkingProps | null = dates[model.dateString];
    if (!selected) {
      return;
    }
    onClick(selected);
    console.log(`${selected.label} - ${model.dateString}`);
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType="custom"
        minDate={minDate}
        maxDate={maxDate}
        hideExtraDays={true}
        theme={{
          // todayTextColor: 'blue',
          dayTextColor: 'black',
          arrowColor: 'black',
        }}
        markedDates={dates}
        onDayPress={handleDayPress}
        // enableSwipeMonths
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(1.85), 
  },
});

export default CalendarView;
