import { Instance } from '../api-config';
import { BuySpinsBody, ReferralBody, SpinWheelBody } from './types';

export const userApi = {
    getUserInfoById: (id: string) => Instance.get(`user/${id}`),
    spinWheel: (userId: string, body: SpinWheelBody) => Instance.post(`spin/${userId}`, body),
    buySpins: (userId: string, body: BuySpinsBody) => Instance.post(`buy/${userId}`, body),
    loginUser: (userId: string) => Instance.post(`login/${userId}`),
    referral: (refferedUserId: string, body: ReferralBody) => Instance.post(`referral/${refferedUserId}`, body),
};

