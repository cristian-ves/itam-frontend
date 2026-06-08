export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// TODO: replace mock with real call when backend is ready
// return api.post<LoginResponse>("/auth/login", credentials)

export const loginService = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  console.log("credentials", credentials);

  // mock response
  return {
    token: "mock-token-123",
    user: {
      id: "1",
      name: "Ricardo",
      email: credentials.email,
    },
  };
};
