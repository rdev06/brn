import axios from 'axios';
import { Link } from 'react-router-dom';
import ArticleItem from '../Component/ArticleItem';
import { useEffect, useState } from 'react';

export default function Home() {

  const [articles, setArticles] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:5000/article')
    .then(res => res?.data && setArticles(res.data))
    .catch(err => console.error(err?.response?.data))
  }, []);


  return (
    <>
      <div></div>
      <h2>Articles</h2>
      <Link to='/myarticle' style={{ float: 'right' }}>
        My Articles
      </Link>
      <br />
      <br />
      <br />
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} isHome={true} />
      ))}
    </>
  );
}
