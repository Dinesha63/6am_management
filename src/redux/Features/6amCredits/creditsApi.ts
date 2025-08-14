import API from '../../../services/api';
import { GetWalletBonusResponse } from './credits.types';

const getWalletBonusAPI = async (): Promise<GetWalletBonusResponse> => {
    return API.get('/Promotion/GetWalletBonus')
  .then(r => r.data);
};

export default { getWalletBonusAPI };
                      