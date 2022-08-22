import Checkbox from 'antd/lib/checkbox/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { registerUser, setUserData, loginUser, getCurrentUser } from '../../store/usersSlice';

import classes from './SignUp.module.scss';

const SignUp = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({ mode: 'all' });

  const onSubmit = (data) => {
    dispatch(registerUser(data));
    dispatch(setUserData(data));
    reset();
  };

  const navigate = useNavigate();
  const { email, password } = useSelector((state) => state.users);
  const tokenID = localStorage.getItem('token');
  useEffect(() => {
    if (tokenID) {
      dispatch(loginUser({ email, password }));
      dispatch(getCurrentUser({ tokenID }));
      navigate('/');
    }
  }, [tokenID, dispatch]);

  return (
    <section className={classes['sign-up']}>
      <form className={classes['sign-up-form']} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={classes.title}>Create new account</h2>
        <label className={classes.label}>
          Username
          <input
            className={errors?.username?.message ? classes.required : classes.input}
            placeholder="Username"
            {...register('username', {
              required: 'Username is required field',
              minLength: {
                value: 3,
                message: 'Username must contain 3-20 characters',
              },
              maxLength: {
                value: 20,
                message: 'Username must contain 3-20 characters',
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'Username must contain only A-Z, a-z, 0-9',
              },
            })}
          />
          {errors?.username && <p className={classes.validate}>{errors?.username?.message || 'Error!'}</p>}
        </label>
        <label className={classes.label}>
          Email address
          <input
            className={errors?.email?.message ? classes.required : classes.input}
            placeholder="Email address"
            {...register('email', {
              required: 'Email address is required field',
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
            className={errors?.password?.message ? classes.required : classes.input}
            type="password"
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
        <label className={classes.label}>
          Repeat Password
          <input
            className={errors?.repeatPassword?.message ? classes.required : classes.input}
            type="password"
            placeholder="Repeat Password"
            {...register('repeatPassword', {
              required: 'Repeat password is required field',
              validate: (value) => getValues('password') === value || 'Passwords must match',
            })}
          />
          {errors?.repeatPassword && <p className={classes.validate}>{errors?.repeatPassword?.message || 'Error!'}</p>}
        </label>
        <Checkbox checked className={classes.checkbox}>
          I agree to the processing of my personal information
        </Checkbox>
        <button className={classes.button}>Create</button>
        <span className={classes.postfix}>
          Already have an account? <Link to={'/sign-in'}>Sign In</Link>.
        </span>
      </form>
    </section>
  );
};

export default SignUp;
