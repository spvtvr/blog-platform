import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { useEffect } from 'react';

import {
  setTagList,
  removeTagList,
  createArticleItem,
  getArticles,
  clearTagList,
  updateArticleItem,
  setIsEditTagList,
} from '../../store/articlesSlice';

import classes from './NewArticle.module.scss';

const NewArticle = () => {
  const tokenID = localStorage.getItem('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tagList } = useSelector((state) => state.articles);
  const isEdit = window.location.pathname.includes('edit');
  const { slug } = useParams();
  const { description, body, title } = useSelector((state) => state.articles.articleItem);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'all' });

  const onSubmit = ({ title, description, body }) => {
    if (isEdit) {
      dispatch(updateArticleItem({ title, description, body, tagList, tokenID, slug }));
    } else {
      dispatch(createArticleItem({ title, description, body, tagList, tokenID }));
    }
    dispatch(clearTagList());
    navigate('/');
    setTimeout(() => {
      dispatch(getArticles({ pageNumber: 0 }));
    }, 300);
  };

  const handleAddTag = (e, value) => {
    e.preventDefault();
    if (value.length > 0) dispatch(setTagList(value));
    document.getElementById('tagInput').value = '';
  };

  const handleRemoveTag = (e, tag) => {
    e.preventDefault();
    dispatch(removeTagList(tag));
  };

  const tagInputHandle = (e) => {
    if (e.key === 'Enter' && e.target.value.length > 0) {
      dispatch(setTagList(e.target.value));
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (isEdit) dispatch(setIsEditTagList());
  }, [isEdit, dispatch]);

  return (
    <>
      {tokenID ? (
        <section className={classes.container}>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={classes.title}>{isEdit ? 'Edit article' : 'Create new article'}</h2>
            <label className={classes.label}>
              Title
              <input
                className={errors?.title?.message ? classes.required : classes.input}
                placeholder="Title"
                defaultValue={isEdit ? title : null}
                {...register('title', {
                  required: 'Title is required field',
                  setValueAs: (v) => v.trim(),
                  minLength: {
                    value: 3,
                    message: 'Title must have 3-70 characters',
                  },
                  maxLength: {
                    value: 70,
                    message: 'Title must have 3-70 characters',
                  },
                })}
              />
              {errors?.title && <p className={classes.validate}>{errors?.title?.message || 'Error!'}</p>}
            </label>
            <label className={classes.label}>
              Short description
              <input
                className={errors?.description?.message ? classes.required : classes.input}
                placeholder="Short description"
                defaultValue={isEdit ? description : null}
                {...register('description', {
                  required: 'Short description is required field',
                  setValueAs: (v) => v.trim(),
                  minLength: {
                    value: 10,
                    message: 'Short description must have 10-500 characters',
                  },
                  maxLength: {
                    value: 500,
                    message: 'Short description must have 3-500 characters',
                  },
                })}
              />
              {errors?.description && <p className={classes.validate}>{errors?.description?.message || 'Error!'}</p>}
            </label>
            <label className={classes.label}>
              Text
              <textarea
                className={errors?.body?.message ? classes.required : classes.input}
                placeholder="Text"
                defaultValue={isEdit ? body : null}
                {...register('body', {
                  required: 'Text is required field',
                  setValueAs: (v) => v.trim(),
                  minLength: {
                    value: 10,
                    message: 'Text field must have min 10 characters',
                  },
                })}
              />
              {errors?.body && <p className={classes.validate}>{errors?.body?.message || 'Error!'}</p>}
            </label>
            <label className={classes.taglabel}>
              Tags
              <div className={classes.tags}>
                <input
                  id="tagInput"
                  onKeyDown={(e) => tagInputHandle(e)}
                  className={classes.tag}
                  placeholder="Add tag"
                  {...register('tag', {
                    setValueAs: (v) => v.trim(),
                  })}
                />
                <button className={classes.addtag} onClick={(e) => handleAddTag(e, getValues('tag'))}>
                  Add tag
                </button>
              </div>
            </label>
            {tagList.map((tag) => (
              <div className={classes.addedtag} key={v4()}>
                <input className={classes.tagitem} value={tag} disabled />
                <button className={classes.deletetag} onClick={(e) => handleRemoveTag(e, tag)}>
                  Delete
                </button>
              </div>
            ))}
            <button className={classes.send}>Send</button>
          </form>
        </section>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default NewArticle;
