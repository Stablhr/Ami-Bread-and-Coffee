import {httpClient} from './httpClient';

export type Address = {
  street: string;
  barangay: string;
  city: string;
  province: string;
  landmark: string;
};

type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: Address;
};

export type ProfileUpdate = {
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
};

type RegisterResponse = {
  id: string;
  email: string;
};

type LoginResponse = {
  user: {
    id: string;
    email: string;
    type: 'admin' | 'user';
  };
};
type LogoutResponse = {message: string};

export type MeUser = {
  id: string;
  type: 'admin' | 'user';
  firstName: string;
  lastName: string;
  email: string;
  /** Customers only. Needed before ordering. */
  phone: string | null;
  address: Address | null;
};

type MeResponse = {
  user: MeUser;
};

export async function registerCustomer(data: RegisterRequest) {
  const res = await httpClient.post<RegisterResponse>('/auth/register', data);
  return res.data;
}

export async function verifyCustomerEmail(params: {
  email: string;
  code: string;
}) {
  const res = await httpClient.post<{message: string}>('/auth/verify', params);
  return res.data;
}

export async function resendVerificationCode(params: {email: string}) {
  const res = await httpClient.post<{message: string}>(
    '/auth/resend-verification',
    params
  );
  return res.data;
}

export async function login(params: {email: string; password: string}) {
  const res = await httpClient.post<LoginResponse>('/auth/login', params);
  return res.data;
}

export async function logout() {
  const res = await httpClient.post<LogoutResponse>('/auth/logout');
  return res.data;
}

export async function sendPasswordResetCode(params: {email: string}) {
  const res = await httpClient.post<{message: string}>(
    '/auth/forgot-password',
    params
  );
  return res.data;
}

export async function resendPasswordResetCode(params: {email: string}) {
  const res = await httpClient.post<{message: string}>(
    '/auth/resend-reset-code',
    params
  );
  return res.data;
}

export async function verifyPasswordResetCode(params: {
  email: string;
  code: string;
}) {
  const res = await httpClient.post<{message: string}>(
    '/auth/verify-reset-code',
    params
  );
  return res.data;
}

export async function resetPassword(params: {
  email: string;
  code: string;
  newPassword: string;
}) {
  const res = await httpClient.post<{message: string}>(
    '/auth/reset-password',
    params
  );
  return res.data;
}


export async function getMe() {
  const res = await httpClient.get<MeResponse>('/auth/me');
  return res.data;
}

export async function changePassword(params: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await httpClient.put<{message: string}>(
    '/auth/password',
    params
  );
  return res.data;
}

export async function updateProfile(data: ProfileUpdate) {
  const res = await httpClient.put<MeResponse>('/auth/profile', data);
  return res.data;
}

/** True when a customer has the contact details the shop requires to order. */
export function hasOrderingProfile(user: MeUser) {
  return Boolean(user.phone && user.address?.street && user.address.barangay && user.address.city);
}
