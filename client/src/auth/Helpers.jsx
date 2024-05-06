import cookie from 'js-cookie';

// Set a cookie
export const setCookie = (key, value) => {
  if (typeof window !== "undefined") {
    cookie.set(key, value, {
      expires: 1, // Expires in 1 day
    });
  }
};

// Remove a cookie
export const removeCookie = (key) => {
  if (typeof window !== "undefined") {
    cookie.remove(key, {
      expires: 1, // Expires in 1 day
    });
  }
};

// Get a cookie value
export const getCookie = (key) => {
  if (typeof window !== "undefined") {
    return cookie.get(key);
  }
};

// Set data in localStorage
export const setLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Remove data from localStorage
export const removeLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// Authenticate user by storing data in cookie and localStorage during signin
export const authenticate = (response, next) => {
  console.log('AUTHENTICATE HELPER ON SIGNIN RESPONSE', response);
  setCookie('token', response.data.token);
  setLocalStorage('user', response.data.user);
  next();
};

// Access user info from localStorage
export const isAuth = () => {
  if (typeof window !== "undefined") {
    const cookieChecked = getCookie('token');
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
        return false;
      }
    }
  }
};

// Sign out
export const signout = next => {
  removeCookie('token');
  removeLocalStorage('user');
  next();
};

// Update user data in localStorage
export const updateUser = (response, next) => {
  console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
  if (typeof window !== 'undefined') {
    let auth = JSON.parse(localStorage.getItem('user'));
    auth = response.data;
    localStorage.setItem('user', JSON.stringify(auth));
  }
  next();
};
