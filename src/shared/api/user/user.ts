import { Instance } from '../api-config';

export const userApi = {
    getUserInfoById: (id: string) => Instance.get(`plinko/user/${id}`),
    loginUser: (userId: string) => Instance.post(`plinko/login/${userId}`),
    incrementBalance: (userId: string, body: UpdateBalance) => Instance.post(`plinko/points/increment/${userId}`, body),
    decrementBalance: (userId: string, body: UpdateBalance) => Instance.post(`plinko/points/decrement/${userId}`, body),
    topUpBalance: (userId: string, body: WithdrawOrTopupBalance) =>
        Instance.post(`plinko/balance/topup/${userId}`, body),
    withdrawBalance: (userId: string, body: WithdrawOrTopupBalance) =>
        Instance.post(`plinko/balance/withdraw/${userId}`, body),
};

export type UpdateBalance = {
    points: number;
};

export type WithdrawOrTopupBalance = {
    amount: number;
};

