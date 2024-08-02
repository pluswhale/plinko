import { Instance } from '../api-config';

export const userApi = {
    getUserInfoById: (id: string) => Instance.get(`/user/${id}`),
    loginUser: (userId: string) => Instance.post(`/login/${userId}`),
    incrementBalance: (userId: string, body: UpdateBalance) => Instance.post(`/points/increment/${userId}`, body),
    decrementBalance: (userId: string, body: UpdateBalance) => Instance.post(`/points/decrement/${userId}`, body),
    topUpBalance: (userId: string, body: WithdrawOrTopupBalance) => Instance.post(`/balance/topup/${userId}`, body),
    withdrawBalance: (userId: string, body: WithdrawOrTopupBalance) =>
        Instance.post(`/balance/withdraw/${userId}`, body),
};

export type UpdateBalance = {
    points: number;
};

export type WithdrawOrTopupBalance = {
    amount: number;
};

