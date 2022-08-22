import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { updateUser } from '../../store/usersSlice';

import classes from './ProfilePage.module.scss';

const ProfilePage = () => {
  const tokenID = localStorage.getItem('token');
  const dispatch = useDispatch();
  const { username, email, image } = useSelector((state) => state.users);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'all' });

  const onSubmit = (data) => {
    const token = localStorage.getItem('token');
    dispatch(updateUser({ ...data, token }));
    reset();
  };

  return (
    <>
      {tokenID ? (
        <section className={classes.container}>
          <form className={classes.profile} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={classes.title}>Edit profile</h2>
            <label className={classes.label}>
              Username
              <input
                className={errors?.username?.message ? classes.required : classes.input}
                placeholder="Username"
                defaultValue={username}
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
                defaultValue={email}
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
              New password
              <input
                className={errors?.password?.message ? classes.required : classes.input}
                placeholder="New password"
                type="password"
                {...register('password', {
                  required: 'New password is required field',
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
              Avatar image (url)
              <input
                defaultValue={image}
                className={errors?.image?.message ? classes.required : classes.input}
                placeholder="Avatar image (url)"
                {...register('image', {
                  pattern: {
                    value:
                      /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/,
                    message: 'Not valid URL',
                  },
                })}
              />
              {errors?.image && <p className={classes.validate}>{errors?.image?.message || 'Error!'}</p>}
            </label>
            <button className={classes.button}>Save</button>
          </form>
        </section>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
};

export default ProfilePage;
