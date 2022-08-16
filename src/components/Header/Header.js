import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCurrentUser, setLogOut } from '../../store/usersSlice';
import noAvatar from '../../img/no-avatar.svg';

import classes from './Header.module.scss';

const Header = () => {
  const tokenID = localStorage.getItem('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, image } = useSelector((state) => state.users);

  useEffect(() => {
    if (tokenID) dispatch(getCurrentUser({ tokenID }));
  }, [tokenID, dispatch]);

  const userLogOut = () => {
    dispatch(setLogOut());
    navigate('/');
  };

  return (
    <>
      <header className={classes.header}>
        <Link to="/">
          <h1 className={classes['header-title']}>Realworld Blog</h1>
        </Link>
        {tokenID ? (
          <div className={classes.logged}>
            <Link to="/new-article">
              <button className={classes.createarticle}>Create article</button>
            </Link>
            <Link to="/profile">
              <div className={classes.profile}>
                <span className={classes.username}>{username}</span>
                <img className={classes.useravatar} src={image ? image : noAvatar} alt="User Avatar" />
              </div>
            </Link>
            <button className={classes.logout} onClick={userLogOut}>
              Log Out
            </button>
          </div>
        ) : (
          <div className={classes['header-buttons']}>
            <Link to="/sign-in">
              <button className={classes['header-buttons-sign-in']}>Sign In</button>
            </Link>
            <Link to="/sign-up">
              <button className={classes['header-buttons-sign-up']}>Sign Up</button>
            </Link>
          </div>
        )}
      </header>
      <Outlet />
    </>
  );
};

export default Header;
