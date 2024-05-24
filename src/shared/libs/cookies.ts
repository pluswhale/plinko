import Cookie from 'js-cookie';

// export const SetCookie = (name, usr, exp) => {
//   const expires = new Date(exp).toUTCString();
//   document.cookie = `${name}=${usr}; secure=true expires=${expires}; path=/; SameSite=Strict`;
// };
export const SetCookie = (name: string, usr: string, exp?: number | Date | undefined) => {
    Cookie.set(name, usr, {
        expires: exp,
        secure: true,
        sameSite: 'strict',
        path: '/',
    });
};

export const GetCookie = (name: string) => {
    return Cookie.get(name);
};

export const RemoveCookie = (name: string) => {
    Cookie.remove(name);
};

export function removeAllCookies() {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    }
}

