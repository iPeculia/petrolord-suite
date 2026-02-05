const loginIfNeeded = async () => {
  if (localStorage.getItem('token')) {
    return;
  }

  const password = import.meta.env.VITE_FRONT_LOGIN_PASS;
  if (!password) {
    console.error("VITE_FRONT_LOGIN_PASS is not set in .env file");
    return;
  }

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: password
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
  } catch (error) {
    console.error("Auto-login failed:", error);
    localStorage.removeItem('token');
  }
};

export { loginIfNeeded };