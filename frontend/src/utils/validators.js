import * as yup from "yup";

export const registerSchema = yup.object({
  firstName: yup
    .string()
    .min(2)
    .max(50)
    .matches(/^[a-zA-Z]+$/, "Letters only")
    .required(),
  lastName: yup
    .string()
    .min(2)
    .max(50)
    .matches(/^[a-zA-Z]+$/, "Letters only")
    .required(),
  email: yup.string().email("Invalid email").max(100).required(),
  phoneNumber: yup
    .string()
    .matches(/^\+91\d{10}$/, "Format: +91XXXXXXXXXX")
    .required(),
  dateOfBirth: yup.string().required("Date of birth is required"),
  password: yup
    .string()
    .min(8)
    .max(64)
    .matches(/[A-Z]/, "Must include uppercase")
    .matches(/[a-z]/, "Must include lowercase")
    .matches(/[0-9]/, "Must include digit")
    .matches(/[!@#$%^&*]/, "Must include special char")
    .required(),
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const kycInfoSchema = yup.object({
  aadharNumber: yup
    .string()
    .matches(/^[2-9]\d{11}$/, "12 digits, starts with 2-9")
    .required(),
  aadharName: yup.string().min(2).max(100).required(),
  dateOfBirth: yup.string().required(),
  address: yup.string().min(10).max(300).required(),
  panNumber: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Format: ABCDE1234F")
    .required(),
  panName: yup.string().min(2).max(100).required(),
});

export const addressSchema = yup.object({
  address: yup.string().max(200).required(),
  city: yup.string().max(100).required(),
  state: yup.string().max(100).required(),
  pincode: yup
    .string()
    .matches(/^\d{6}$/, "Exactly 6 digits")
    .required(),
});

export const depositSchema = yup.object({
  accountNumber: yup.string().required(),
  amount: yup.number().positive("Must be greater than 0").required(),
  paymentMode: yup.string().required(),
});

export const transferSchema = yup.object({
  senderAccountNumber: yup.string().required(),
  receiverAccountNumber: yup.string().required(),
  amount: yup.number().positive().required(),
  paymentMode: yup.string().required(),
});
