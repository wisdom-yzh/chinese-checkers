export const STATUS_OK = 200;
export const STATUS_ERROR = 500;

export const CHECK_VALID_PATH = '/check';
export const SOCKET_PATH = '/chess';

export type Request<T> = {
  clientId: string;
  data: T;
};

export type Response<T> = {
  code: number;
  message?: string;
  data: T;
};
