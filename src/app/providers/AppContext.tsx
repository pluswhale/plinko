import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import LoaderScreen from '../../features/loader-screen/LoaderScreen';
import {
    decrementBalance,
    incrementBalance,
    loginUser,
    topUpBalance,
    withdrawBalance,
} from '../../shared/api/user/thunks';
import { useMediaQuery } from 'react-responsive';
import { removeAllCookies } from '../../shared/libs/cookies';
import { Flip, toast } from 'react-toastify';

//@ts-ignore
const tg: any = window?.Telegram?.WebApp;

export interface UserData {
    createdAt: string;
    points: number;
    unclaimedWhisks: number;
    updatedAt: string;
    userId: string;
    __v: number;
    _id: string;
}

export interface TelegramUserData {
    allows_write_to_pm: boolean;
    first_name: string;
    id: number;
    is_premium: boolean;
    language_code: string;
    last_name: string;
    username: string;
}

interface AppContextType {
    userData: UserData;
    isMobile: boolean;
    tgUser: TelegramUserData | null;
    decrementCurrentBalance: (amount: number) => void;
    incrementCurrentBalance: (amount: number) => void;
    topUpCurrentBalance: (amount: number) => void;
    withdrawCurrentBalance: (amount: number) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

const FAKE_USER = {
    _id: '664df59323d74ce23ab961f5',
    userId: '574813379',
    points: 1000,
    unclaimedWhisks: 1000,
    createdAt: '2024-05-21T11:33:49.389+00:00',
    updatedAt: '2024-05-22T10:17:34.733+00:00',
    __v: 5,
} as UserData;

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

export const AppContextProvider: React.FC<{ children: ReactElement | ReactElement[] }> = ({ children }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const [tgUser, setTgUser] = useState<TelegramUserData | null>(null);
    const [userData, setUserData] = useState<UserData>(FAKE_USER);
    const [loading, setIsLoading] = useState<boolean>(true);
    const [isAppLoaded, setIsAppLoaded] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            onExitFromApp();
        };
    }, []);

    useEffect(() => {
        //@ts-ignore
        if (window.Telegram && window.Telegram.WebApp) {
            //@ts-ignore
            tg.ready();
            // Get user data from the Telegram Web App context
            const user = tg.initDataUnsafe.user;
            setTgUser(user);
        } else {
            console.error('Telegram WebApp is not initialized or running outside of Telegram context.');
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await loginUser(tgUser?.id?.toString() || '90849048490'); //574813379
                if (res) {
                    setUserData(res);
                }
            } catch (error) {
                setUserData(FAKE_USER);
                console.error('Error during login:', error);
            }
        };

        fetchUserData();
    }, [tgUser?.id]);

    useEffect(() => {
        setTimeout(() => {
            setIsAppLoaded(true);
            setIsLoading(false);
        }, 4000);
    }, [userData]);

    if (loading && !isAppLoaded) {
        return <LoaderScreen />;
    }

    function decrementCurrentBalance(amount: number) {
        if (userData?.userId) {
            decrementBalance(userData?.userId, { points: amount }).then((res) => {
                if (res === 'succession update the points') {
                    setUserData((prev: UserData) => {
                        return {
                            ...prev,
                            points:
                                +parseFloat(String(prev?.points)).toFixed(2) - +parseFloat(String(amount)).toFixed(2),
                        };
                    });
                }
            });
        }
    }

    function incrementCurrentBalance(amount: number) {
        if (userData?.userId) {
            incrementBalance(userData?.userId, { points: amount }).then((res) => {
                if (res === 'succession update the points') {
                    setUserData((prev: UserData) => {
                        return {
                            ...prev,
                            points:
                                +parseFloat(String(prev?.points)).toFixed(2) + +parseFloat(String(amount)).toFixed(2),
                        };
                    });
                }
            });
        }
    }

    function topUpCurrentBalance(amount: number) {
        if (userData?.userId) {
            topUpBalance(userData?.userId, { amount }).then((res) => {
                if (res === 'succession update the points') {
                    setUserData((prev: UserData) => {
                        return {
                            ...prev,
                            points:
                                +parseFloat(String(prev?.points)).toFixed(2) + +parseFloat(String(amount)).toFixed(2),
                        };
                    });
                    toast.success(`You top up ${amount} whisks`, {
                        position: 'bottom-left',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        transition: Flip,
                    });
                } else {
                    toast.error(`You didn't top up whisks. Try again!`, {
                        position: 'bottom-left',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        transition: Flip,
                    });
                }
            });
        }
    }

    function withdrawCurrentBalance(amount: number) {
        if (userData?.userId) {
            withdrawBalance(userData?.userId, { amount }).then((res) => {
                if (res === 'succession update the points') {
                    setUserData((prev: UserData) => {
                        return {
                            ...prev,
                            points:
                                +parseFloat(String(prev?.points)).toFixed(2) - +parseFloat(String(amount)).toFixed(2),
                        };
                    });
                    toast.success(`You withdraw ${amount} whisks`, {
                        position: 'bottom-left',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        transition: Flip,
                    });
                } else {
                    toast.error(`You didn't withdraw whisks. Try again!`, {
                        position: 'bottom-left',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        transition: Flip,
                    });
                }
            });
        }
    }

    function onExitFromApp() {
        removeAllCookies();
        tg.close();
    }

    return (
        <AppContext.Provider
            value={{
                tgUser,
                userData,
                isMobile,
                decrementCurrentBalance,
                incrementCurrentBalance,
                topUpCurrentBalance,
                withdrawCurrentBalance,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

