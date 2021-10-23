// This method grabs the token from storage
// and returns Bearer+token to serve as authorization for
// making an API call to a protected route

export function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user.token) {
      return { headers: { Authorization: 'Bearer ' + user.token } };
    } else {
      return {};
    }
  }