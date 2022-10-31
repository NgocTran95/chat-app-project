import classNames from 'classnames/bind';
import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { ButtonBase, TextField, Box, Input, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import styles from './LoginForm.module.scss';
import { addUsers } from '~/firebase/services';
import { validateLoginSchema } from '~/validateForm/validateSchema';
import { auth } from '~/firebase/config';

const fbProvider = new FacebookAuthProvider();
const ggProvider = new GoogleAuthProvider();
const cx = classNames.bind(styles);

function LoginForm({ setIsLogin }) {
  const [isShowPassWord, setIsShowPassword] = useState(false);
  const [ErrorLogin, setErrorLogin] = useState({ error: false, msg: '' });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validateLoginSchema) });

  const handleLoginFacebook = () => {
    addUsers(fbProvider);
  };

  const handleLoginGoogle = () => {
    addUsers(ggProvider);
  };

  const handleLoginByEmail = (data) => {
    const { email, password } = data;
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      if (error.code === 'auth/user-not-found') {
        setErrorLogin({ error: true, msg: 'User not found, please try again!' });
      }
      if (error.code === 'auth/wrong-password') {
        setErrorLogin({ error: true, msg: 'Wrong password, please try again!' });
      }
    });
  };
  return (
    <div className={cx('container')}>
      <h3 className={cx('title')}>Log In</h3>
      {ErrorLogin.error && <p className={cx('error-signin-msg')}>{ErrorLogin.msg}</p>}
      <form className={cx('form')} onSubmit={handleSubmit(handleLoginByEmail)} id="login-form">
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={cx('form-control')}>
          <Email sx={{ color: 'action.active', mr: 1, my: 0.5 }} className={cx('form-control-icon')} />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            variant="standard"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            onFocus={() => setErrorLogin({ error: false, msg: '' })}
          />
          {<p className={cx('error-msg')}>{errors.email?.message}</p>}
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
              onFocus={() => setErrorLogin({ error: false, msg: '' })}
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
        <ButtonBase
          type="submit"
          form="login-form"
          className={cx('login-btn')}
          onClick={handleSubmit(handleLoginByEmail)}
        >
          Log In
        </ButtonBase>
      </form>
      <p className={cx('separate-text')}>
        Not a member?{' '}
        <span className={cx('sign-up-nav')} onClick={() => setIsLogin(false)}>
          Sign up now
        </span>
      </p>
      <p className={cx('separate-text')}>Or you can log in with</p>
      <div className={cx('socials-login')}>
        <ButtonBase className={cx('social-login-btn', 'facebook')} onClick={handleLoginFacebook}>
          <FontAwesomeIcon icon={faFacebook} />
        </ButtonBase>
        <ButtonBase className={cx('social-login-btn', 'google')} onClick={handleLoginGoogle}>
          <FontAwesomeIcon icon={faGoogle} />
        </ButtonBase>
      </div>
    </div>
  );
}

export default LoginForm;
