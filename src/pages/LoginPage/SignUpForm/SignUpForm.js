import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ButtonBase, TextField, Box, Input, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';
import { AccountCircle, Lock, Visibility, VisibilityOff, Email } from '@mui/icons-material';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import classNames from 'classnames/bind';

import { auth, db } from '~/firebase/config';
import { generateKeyWords } from '~/firebase/services';
import { validateSignUpSchema } from '~/validateForm/validateSchema';
import styles from './SignUpForm.module.scss';

const cx = classNames.bind(styles);

function SignUpForm({ setIsLogin }) {
  const [isShowPassWord, setIsShowPassword] = useState(false);
  const [isEmailUsed, setIsEmailUsed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validateSignUpSchema) });

  const handleSignUpByEmail = (data) => {
    const { email, password, username } = data;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        addDoc(collection(db, 'users'), {
          displayName: username,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          uid: userCredential.user.uid,
          providerId: userCredential.providerId,
          keywords: generateKeyWords(username?.toLowerCase()),
          createAt: serverTimestamp(),
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setIsEmailUsed(true);
        }
      });
  };

  return (
    <div className={cx('container')}>
      <h3 className={cx('title')}>Sign Up</h3>
      {isEmailUsed && <p className={cx('error-signup-msg')}>Account with this email is already exists</p>}
      <form className={cx('form')} onSubmit={handleSubmit(handleSignUpByEmail)} id="signup-form">
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={cx('form-control')}>
          <Email sx={{ color: 'action.active', mr: 1, my: 0.5 }} className={cx('form-control-icon')} />
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            variant="standard"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            onFocus={() => setIsEmailUsed(false)}
          />
          {<p className={cx('error-msg')}>{errors.email?.message}</p>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={cx('form-control')}>
          <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} className={cx('form-control-icon')} />
          <TextField
            id="username"
            name="username"
            label="Username"
            type="text"
            variant="standard"
            fullWidth
            {...register('username')}
            error={!!errors.username}
          />
          {<p className={cx('error-msg')}>{errors.username?.message}</p>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={cx('form-control')}>
          <Lock sx={{ color: 'action.active', mr: 1, my: 0.5 }} className={cx('form-control-icon')} />
          <FormControl fullWidth>
            <InputLabel htmlFor="password" sx={{ ml: -1.8, my: 0.5 }}>
              Password
            </InputLabel>
            <Input
              id="password"
              name="password"
              type={isShowPassWord ? 'text' : 'password'}
              {...register('password')}
              error={!!errors.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setIsShowPassword((prev) => !prev)}
                  >
                    {isShowPassWord ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {<p className={cx('error-msg')}>{errors.password?.message}</p>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={cx('form-control')}>
          <Lock sx={{ color: 'action.active', mr: 1, my: 0.5 }} className={cx('form-control-icon')} />
          <FormControl fullWidth>
            <InputLabel htmlFor="password" sx={{ ml: -1.8, my: 0.5 }}>
              Confirm Password
            </InputLabel>
            <Input
              id="confirm-password"
              name="confirm-password"
              type={isShowPassWord ? 'text' : 'password'}
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setIsShowPassword((prev) => !prev)}
                  >
                    {isShowPassWord ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {<p className={cx('error-msg')}>{errors.confirmPassword?.message}</p>}
        </Box>
        <ButtonBase type="submit" form='signup-form' className={cx('login-btn')} onClick={handleSubmit(handleSignUpByEmail)}>
          Sign Up
        </ButtonBase>
      </form>
      <p className={cx('separate-text')}>
        Already a member?{' '}
        <span className={cx('sign-up-nav')} onClick={() => setIsLogin(true)}>
          Log In now
        </span>
      </p>
    </div>
  );
}

export default SignUpForm;
