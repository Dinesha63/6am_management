import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import ButtonComponent from './ButtonComponent';
import {Linking} from 'react-native';
import {addOrEditDays, MarkedDates, Toast} from './Extension';
import {HorizontalDivider} from '.';
import {useState} from 'react';
import AlertModal from './AlertModel';
import {FontFamily} from '../../../utils/constant';               
import { imagePaths } from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';

type AddVacationCardProps = {
  setVisible: (value: boolean) => void;
};

export const AddVacationCard: React.FC<AddVacationCardProps> = ({
  setVisible,
}) => {
  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardContainer}>
          <View style={styles.cardFirst}>
            <View style={styles.tickIconWrapper}>
              <Image style={styles.tickIcon} source={imagePaths.TICK_ICON} />
            </View>
            <View>
              <Text style={styles.text}>Add vacation</Text>
              <Text style={styles.description}>You have no vacation added</Text>
            </View>
            <ButtonComponent
              title="Add"
              backgroundColor={Colors.darkPurple}
              onPress={() => setVisible(true)}
              style={styles.addButtonStyle}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export const UpcomingDeliveryDetailsCard: React.FC = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelDelivery = () => {
    setShowCancelModal(false);
    Toast('Your delivery has been canceled successfully');
  };

  return (
    <>
      <AlertModal
        open={showCancelModal}
        setOpen={setShowCancelModal}
        title="Cancel Delivery"
        description="Are you sure want to cancel the delivery ?"
        confirmText="Cancel Delivery"
        onConfirm={handleCancelDelivery}
      />
      <View style={styles.card}>
        <View style={styles.cardContainer}>
          <View style={styles.cardFirst}>
            <View style={styles.tickIconWrapper}>
              <Image style={styles.tickIcon} source={imagePaths.TICK_ICON} />
            </View>
            <View>
              <Text style={styles.text}>
                Next delivery {addOrEditDays(new Date(), 1)}
              </Text>
              <Text style={styles.description}>Evening 5.00 - 7.00</Text>
            </View>
          </View>
        </View>
        <View style={{paddingTop: 20, paddingBottom: 15}}>
          <HorizontalDivider />
        </View>
        <View style={styles.upcomingDeliveryBottomRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.upcomingDeliveryBottomRow}
            onPress={() => Linking.openURL('tel:1234567890')}>
            <Image style={styles.callIcon} source={imagePaths.CALL_ICON} />
            <Text style={{color: Colors.greenColour}}>Contact Delivery Person</Text>
          </TouchableOpacity>
          <ButtonComponent
            title="Cancel"
            backgroundColor={Colors.danger}
            onPress={() => setShowCancelModal(true)}
            style={{marginLeft: 'auto'}}
          />
        </View>
      </View>
    </>
  );
};

type ResumeVacationTextCardProps = {
  setPauseVacation: (value: boolean) => void;
};

export const ResumeVacationTextCard: React.FC<ResumeVacationTextCardProps> = ({
  setPauseVacation,
}) => {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const handleResumeVacation = () => {
    setPauseVacation(false);
    Toast('Your vacation has been revoke successfully');
    setShowResumeModal(false);
  };
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.text}>Your vacation has been paused.</Text>
        <ButtonComponent
          title="Revoke Vacation"
          style={styles.resumeVacationButton}
          backgroundColor={Colors.darkPurple}
          onPress={() => setShowResumeModal(true)}
        />
      </View>
      <AlertModal
        open={showResumeModal}
        setOpen={setShowResumeModal}
        title="Revoke Vacation"
        description="Are you sure you want to revoke vacation ?"
        confirmText="Revoke Vacation"
        onConfirm={handleResumeVacation}
      />
    </>
  );
};

type VacationTextCardProps = {
  text: string;
};

export const VacationTextCard: React.FC<VacationTextCardProps> = ({text}) => (
  <View style={styles.card}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

type VacationDetailsCardProps = {
  onRevoke: (dates: MarkedDates) => void;
  setVisible: (value: boolean) => void;
  days: number;
};

export const VacationDetailsCard: React.FC<VacationDetailsCardProps> = ({
  onRevoke,
  setVisible,
  days,
}) => {
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  return (
    <>
      <View style={styles.card}>
        <View style={styles.vacationRow}>
          <Text style={styles.text}>Vacation Details</Text>
          <Text style={styles.description}>
            {days} {days <= 1 ? 'day' : 'days'}
          </Text>
        </View>
        <View style={styles.vacationBottom}>
           <ButtonComponent
            title="Modify"
            backgroundColor={Colors.darkPurple}
            onPress={() => setVisible(true)}
          />
          <ButtonComponent
            title="Revoke"
            backgroundColor={Colors.greenColour}
            onPress={() => setShowRevokeModal(true)}
          />

        </View>
      </View>
      <AlertModal
        open={showRevokeModal}
        setOpen={setShowRevokeModal}
        title="Revoke Vacation"
        description="Are you sure you want to revoke all the vacation ?"
        confirmText="Revoke Vacation"
        onConfirm={() => {
          onRevoke({});
          setShowRevokeModal(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
  },
  description: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: wp(2.1),         
    padding: wp(5.3),              
    borderWidth: 1,
    borderColor: Colors.darkPurple,
  },
  tickIconWrapper: {
    backgroundColor: Colors.darkPurple,
    width: wp(6.6),                
    height: wp(6.6),
    borderRadius: wp(3.3),         
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickIcon: {
    width: wp(4),                  
    height: wp(4),
  },
  callIcon: {
    width: wp(5.3),                
    height: wp(5.3),
    tintColor: Colors.greenColour,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardFirst: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: wp(4),              
    width: '100%',
  },
  addButtonStyle: {
    paddingVertical: hp(1),        
    paddingHorizontal: wp(2.6),    
    marginLeft: 'auto',
  },
  upcomingDeliveryBottomRow: {
    flexDirection: 'row',
    columnGap: wp(2.6),            
    alignItems: 'center',
  },
  vacationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vacationBottom: {
    flexDirection: 'row',
    columnGap: wp(2.6),            
  },
  resumeVacationButton: {
    marginLeft: 'auto',
    marginTop: hp(1.3),            // ≈10px
  },
});

