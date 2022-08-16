import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { loginUser } from '../../../store/usersSlice';

import classes from './SignIn.module.scss';

const SignIn = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'all' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokenID = localStorage.getItem('token');

  const onSubmit = ({ email, password }) => {
    dispatch(loginUser({ email, password }));
    reset();
    navigate('/');
  };

  useEffect(() => {
    if (tokenID) navigate('/');
  });

  return (
    <section className={classes['sign-in']}>
      <form className={classes['sign-in-form']} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={classes.title}>Sign In</h2>
        <label className={classes.label}>
          Email address
          <input
            className={errors?.email?.message ? classes.required : classes.input}
            placeholder="Email address"
            {...register('email', {
              required: 'Email is required field',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors?.email && <p className={classes.validate}>{errors?.email?.message || 'Error!'}</p>}
        </label>
        <label className={classes.label}>
          Password
          <input
            type="password"
            className={errors?.password?.message ? classes.required : classes.input}
            placeholder="Password"
            {...register('password', {
              required: 'Password is required field',
              minLength: {
                value: 6,
                message: 'Password must contain 6-40 characters',
              },
              maxLength: {
                value: 40,
                message: 'Password must contain 6-40 characters',
              },
              pattern: {
                value: /^(?=.*\d)[0-9a-zA-Z]{8,}$/,
                message: 'Password must contain A-Z(a-z) and 0-9',
              },
            })}
          />
          {errors?.password && <p className={classes.validate}>{errors?.password?.message || 'Error!'}</p>}
        </label>
        <button className={classes.button}>Login</button>
        <span className={classes.postfix}>
          Don’t have an account? <Link to={'/sign-up'}>Sign Up</Link>.
        </span>
      </form>
    </section>
  );
};

export default SignIn;
