import express from 'express';
import { Response, STATUS_ERROR } from 'checker-transfer-contract';

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  res.json({
    code: STATUS_ERROR,
    message: (err && err.message) || 'error',
    data: {},
  } as Response<{}>);
};

export default errorHandler;
