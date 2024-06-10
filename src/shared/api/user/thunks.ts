import { UpdateBalance, userApi, WithdrawOrTopupBalance } from './user';

export const loginUser = async (userId: string) => {
    try {
        const res = await userApi.loginUser(userId);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const fetchUserById = async (userId: string) => {
    try {
        const res = await userApi.getUserInfoById(userId);

        if (res) {
            return res;
        }

        return null;
    } catch (err) {
        console.error(err);
    }
};

export const incrementBalance = async (userId: string, body: UpdateBalance) => {
    try {
        const res = await userApi.incrementBalance(userId, body);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const decrementBalance = async (userId: string, body: UpdateBalance) => {
    try {
        const res = await userApi.decrementBalance(userId, body);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const topUpBalance = async (userId: string, body: WithdrawOrTopupBalance) => {
    try {
        const res = await userApi.topUpBalance(userId, body);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const withdrawBalance = async (userId: string, body: WithdrawOrTopupBalance) => {
    try {
        const res = await userApi.withdrawBalance(userId, body);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

