import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { v4 } from 'uuid';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

import { getArticleItem, getArticles, removeArticleItem, favoriteArticle } from '../../store/articlesSlice';
import Spinner from '../../components/Spinner/Spinner';

import classes from './ArticlesItemPage.module.scss';

const ArticlesItemPage = () => {
  const dispatch = useDispatch();
  const tokenID = localStorage.getItem('token');
  const { slug } = useParams();
  const navigate = useNavigate();
  const { articleItem, isLoading } = useSelector((state) => state.articles);
  const { username } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getArticleItem({ slug }));
  }, [dispatch, slug]);

  const removeArticle = () => {
    dispatch(removeArticleItem({ slug, tokenID }));
    navigate('/');
    setTimeout(() => {
      dispatch(getArticles({ pageNumber: 0 }));
    }, 300);
  };

  const likeHandler = (slug) => {
    if (tokenID) {
      dispatch(favoriteArticle({ slug, tokenID }));
      setTimeout(() => dispatch(getArticleItem({ slug })), 300);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <main className={classes.main}>
          <article className={classes['articles-page-item']}>
            <header className={classes['item-header']}>
              <div className={classes['item-header-info']}>
                <div className={classes['header-info']}>
                  <h2 className={classes['info-title']}>{articleItem.title}</h2>
                  <div className={classes['info-likes']} onClick={() => likeHandler(slug)}>
                    {articleItem.favorited ? <HeartFilled /> : <HeartOutlined />}
                    <span className={classes['likes-count']}>{articleItem.favoritesCount}</span>
                  </div>
                </div>
                <div className={classes['header-tags']}>
                  {articleItem.tagList?.map((tag) => (
                    <div key={v4()} className={classes['info-tagname']}>
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <div className={classes['item-header-user-info']}>
                <div className={classes['user-data']}>
                  <span className={classes['user-data-name']}>{articleItem.author?.username}</span>
                  <span className={classes['user-data-created']}>
                    {articleItem.createdAt ? format(new Date(articleItem.createdAt), 'MMMM d, yyyy') : 'null'}
                  </span>
                </div>
                <img src={articleItem.author?.image} alt="User Avatar" />
              </div>
            </header>
            <div className={classes.descbuttons}>
              <p className={classes['item-description']}>{articleItem.description}</p>
              {articleItem.author?.username === username ? (
                <div className={classes.buttons}>
                  <Popconfirm
                    title="Are you sure to delete this article?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={removeArticle}
                  >
                    <button className={classes.delete}>Delete</button>
                  </Popconfirm>
                  <Link to={`/articles/${articleItem.slug}/edit`}>
                    <button className={classes.edit}>Edit</button>
                  </Link>
                </div>
              ) : null}
            </div>
            <ReactMarkdown className={classes['item-body']}>{articleItem.body}</ReactMarkdown>
          </article>
        </main>
      )}
    </>
  );
};

export default ArticlesItemPage;
