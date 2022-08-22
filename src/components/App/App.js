import './App.module.scss';
import { Route, Routes } from 'react-router-dom';
import 'antd/dist/antd.min.css';

import Header from '../Header';
import ArticlesPage from '../../pages/ArticlesPage';
import ArticlesItemPage from '../../pages/ArticlesItemPage';
import SignUp from '../../pages/SignUp';
import SignIn from '../../pages/SignIn';
import ProfilePage from '../../pages/ProfilePage';
import NewArticle from '../../pages/NewArticle';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<ArticlesPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:slug" element={<ArticlesItemPage />} />
        <Route path="articles/:slug/edit" element={<NewArticle />} />
        <Route path="new-article" element={<NewArticle />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default App;
