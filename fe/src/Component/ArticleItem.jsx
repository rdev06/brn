import { useContext } from 'react';
import { LoginContext } from '../store';

export default function ArticleItem({ article, isHome }) {
  const [loggedIn] = useContext(LoginContext);

  return (
    <div>
      <h4>{article.title}</h4>
      <p>{article.description}</p>
      {loggedIn && !isHome && (
        <>
          <button>Edit</button>
          <button>Delete</button>
        </>
      )}

      <hr />
    </div>
  );
}
