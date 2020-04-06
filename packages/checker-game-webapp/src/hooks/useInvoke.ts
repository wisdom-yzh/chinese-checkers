import { useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useGlobalContext } from './useGlobalContext';
import { Request, Response, STATUS_OK } from 'checker-transfer-contract';

export const useInvoke = (): typeof invoke => {
  const { networkParam } = useGlobalContext();
  const { server, clientId } = networkParam || {};

  const invoke = useMemo(
    () => <TReq, TRes>(path: string, data: TReq): Promise<TRes> => {
      if (!clientId || !server) {
        return Promise.reject('params invalid');
      }

      const url = `//${server}${path}`;
      const request: Request<TReq> = {
        clientId,
        data,
      };

      return axios.post<Response<TRes>>(url, request).then(axiosRes => {
        const res = axiosRes.data;
        if (res.code === STATUS_OK) {
          return res.data;
        }

        toast.warn(res.message, {
          autoClose: 1000,
          hideProgressBar: true,
          position: 'top-center',
        });
        throw new Error(res.message);
      });
    },
    [server, clientId],
  );

  return invoke;
};
