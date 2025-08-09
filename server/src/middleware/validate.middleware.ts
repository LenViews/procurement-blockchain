import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

export const registerVendorSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  kraPin: yup.string().matches(/^[A-Z]\d{9}[A-Z]$/).required(),
  companyName: yup.string().required(),
  phoneNumber: yup.string().matches(/^\+254\d{9}$/).required(),
  category: yup.string().oneOf(['goods', 'services']).required()
});

export const loginVendorSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required()
});

export const createTenderSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  category: yup.string().oneOf(['goods', 'services']).required(),
  budget: yup.number().positive().required(),
  deadline: yup.date().min(new Date()).required()
});

export const submitBidSchema = yup.object().shape({
  tenderId: yup.string().required(),
  amount: yup.number().positive().required(),
  description: yup.string().required()
});

export const validate = (schema: yup.AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err: unknown) {
    if (err instanceof yup.ValidationError) {
      res.status(400).json({ errors: err.errors });
    } else if (err instanceof Error) {
      res.status(400).json({ errors: [err.message] });
    } else {
      res.status(400).json({ errors: ['Unknown validation error'] });
    }
  }
};