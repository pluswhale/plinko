import axios from 'axios';

//@ts-ignore
const hostBackendUrl = 'https://whiskers-be-20f5dcb585e5.herokuapp.com/';
//@ts-ignore
const localBackendUrl = 'http://localhost:3000/';

export const Instance = axios.create({
    baseURL: hostBackendUrl,
    headers: {
        Accept: 'application/json',
        ['Content-Type']: 'application/json',
    },
});

