import API from '../../../services/api';
import { PromotionImageResponse } from './promotion.types';

export const fetchPromotionImageAPI = async (widget: string): Promise<PromotionImageResponse> => {
  try {
    console.log(`fetchPromotionImageAPI called with widget: ${widget}`);
    const response = await API.get('/Promotion/GetPromotionalImage', {
      params: { Widget: widget },
    });
    console.log('fetchPromotionImageAPI response:',response,widget);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 