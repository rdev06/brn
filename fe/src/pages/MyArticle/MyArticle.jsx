import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LoginContext } from '../../store';
import { Link, useNavigate } from 'react-router-dom';
import ArticleItem from '../../Component/ArticleItem';

export default function MyArticle() {
  const [loggedIn] = useContext(LoginContext);
  const navigate = useNavigate();
  const articleRef = useRef();

  const [error, setError] = useState('Fill required field');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!loggedIn) {
      return navigate('/auth');
    }
    axios
      .get('http://localhost:5000/article')
      .then((res) => setArticles(res.data))
      .catch(err => console.error(err.response.data));
  }, [loggedIn]);

  function onSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(articleRef.current);
    const formProps = Object.fromEntries(formData);
    axios
      .post('http://localhost:5000/article', formProps)
      .then(()=>setArticles(prev => [...prev, {id: prev.length-1, ...formProps}]))
      .catch(err => console.error(err.response.data));
  }

  function MinLengthValidator(e) {
    const currentLength = e.target.value.length;
    if (currentLength < 10) {
      setError(
        `Description should be atleast 10 charaters, Now: ${currentLength}, remaining : ${
          10 - currentLength
        }`
      );
    } else {
      setError('');
    }
  }

  return (
    <div>
      <h2>My Articles</h2>
      <Link style={{ float: 'right' }} to='/'>
        Back to home
      </Link>

      <br />
      <br />
      <br />
      <br />

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <form method='post' ref={articleRef} onSubmit={onSubmitHandler}>
        <input type='text' name='title' required placeholder='Title' />
        <input
          type='text'
          onChange={MinLengthValidator}
          minLength={10}
          name='description'
          required
          placeholder='Description'
        />
        <button type='submit' disabled={!!error}>
          Add
        </button>
      </form>

      <br />
      <br />
      <br />
      <br />
      <br />

      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </div>
  );
}
