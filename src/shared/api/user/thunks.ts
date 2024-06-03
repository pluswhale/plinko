import { UpdateBalance, userApi } from './user';

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

export const updateBalance = async (userId: string, body: UpdateBalance) => {
    try {
        const res = await userApi.updateBalance(userId, body);
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

