import { useSelector, useDispatch } from 'react-redux';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { format } from 'date-fns';
import { Pagination } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';

import { getArticles, setPageNumber, favoriteArticle } from '../../../store/articlesSlice';
import Spinner from '../../Spinner/Spinner';

import classes from './ArticlesPage.module.scss';

const ArticlesPage = () => {
  const { articles, articlesCount, pageNumber, isLoading } = useSelector((state) => state.articles);
  const dispatch = useDispatch();
  const tokenID = localStorage.getItem('token');

  useEffect(() => {
    dispatch(getArticles({ pageNumber: pageNumber * 5 - 5 }));
  }, [dispatch, pageNumber]);

  const shortOverview = (overview, maxSymbols, postfix) => {
    const pos = overview.indexOf(' ', maxSymbols);
    return pos === -1 ? overview : overview.substring(0, pos) + postfix;
  };

  const likeHandler = (slug) => {
    if (tokenID) {
      dispatch(favoriteArticle({ slug, tokenID }));
      setTimeout(() => {
        dispatch(getArticles({ pageNumber: pageNumber * 5 - 5 }));
      }, 300);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <section className={classes.articles}>
            {articles.map((elem) => (
              <article key={v4()} className={classes['article-item']}>
                <div className={classes['article-text']}>
                  <div className={classes['article-item-info']}>
                    <Link to={`/articles/${elem.slug}`}>
                      <h2 className={classes['article-item-title']}>
                        {elem.title ? shortOverview(elem.title, 100, '...') : '[Title was not found]'}
                      </h2>
                    </Link>
                    <div className={classes['article-item-likes-info']} onClick={() => likeHandler(elem.slug)}>
                      {elem.favorited ? (
                        <HeartFilled
                          style={{
                            color: '#ed553b',
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      ) : (
                        <HeartOutlined style={{ width: '20px', height: '20px' }} />
                      )}
                      <span className={classes['article-item-likes-count']}>{elem.favoritesCount}</span>
                    </div>
                  </div>
                  <div className={classes['article-tags']}>
                    {elem.tagList.map((tag) => (
                      <div
                        key={v4()}
                        className={elem.tagList[0] === null || elem.tagList[0] === '' ? null : classes.tagname}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                  <p className={classes['article-description']}>
                    {elem.description ? shortOverview(elem.description, 150, '...') : '[Description is not defined]'}
                  </p>
                </div>
                <div className={classes.userinfo}>
                  <div className={classes.usertext}>
                    <span className={classes.username}>{elem.author.username}</span>
                    <span className={classes.published}>{format(new Date(elem.updatedAt), 'MMMM d, yyyy')}</span>
                  </div>
                  <img src={elem.author.image} alt="User Avatar" />
                </div>
              </article>
            ))}
          </section>
          <Pagination
            className={classes.pagination}
            defaultCurrent={1}
            showSizeChanger={false}
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '25px',
            }}
            pageSize={5}
            current={pageNumber}
            total={articlesCount}
            onChange={(e) => dispatch(setPageNumber(e))}
          />
        </>
      )}
    </>
  );
};

export default ArticlesPage;
