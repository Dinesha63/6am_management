import { AxiosResponse } from 'axios';
import API from '../../../services/api';
import { APIResponse, ValidateCouponParams } from './coupon.types';
    

export const validateCouponCode = async ({
  phoneNumber,
  couponCode,
}: ValidateCouponParams): Promise<APIResponse> => {
  console.log(phoneNumber, couponCode, ' :: validateCouponCode');
  const response = await API.get<APIResponse>(
    `Promotion/ValidateCouponCode`,
    {
      params: {
        PhoneNumber: phoneNumber,
        CouponCode: couponCode,
      },
    }
  );
  console.log(response.data, 'response.data');
  return response.data;
};



