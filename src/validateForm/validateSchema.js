import yup from "./yupGlobal";

export const validateSignUpSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Email invalid'),
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
    .password('Password must be 8 characters, at least 1 letter and number'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Password must match'),
});

export const validateLoginSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Email invalid'),
  password: yup
    .string()
    .required('Password is required')
    .password('Password must be 8 characters, at least 1 letter and number'),
});
