import React, { useState } from "react";
import axios from "axios";
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states

  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(0);
  const [spinnerOn, setSpinnerOn] = useState(false);

  const currentArticle = currentArticleId
  ? articles.find((article) => article.article_id === currentArticleId)
  : undefined;

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      setMessage("Goodbye!");
    }
    return redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axios
      .post(loginUrl, { username: username, password: password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        redirectToArticles();
        setSpinnerOn(false);
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    axios
      .get(articlesUrl, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
        setSpinnerOn(false);
        // console.log(res);
      })
      .catch((err) => {
        redirectToLogin();
        setSpinnerOn(false);
        console.log(err);
      });
  };

  const postArticle = (article) => {
    const token = localStorage.getItem("token");
    axios
      .post(articlesUrl, article, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        console.log(res);
        setArticles((prevArticles) => [...prevArticles, res.data.article]);
        setMessage(res.data.message)
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  
  

  const updateArticle = ({ article_id, article }) => {
    setSpinnerOn(true)
    const token = localStorage.getItem("token");
    axios
      .put(`http://localhost:9000/api/articles/${article_id}`, article, {
        headers: {
          authorization: token,
        },
      })
      .then(res => {
        setArticles(prevArticles => {
          return prevArticles.map(art => {
            if (art.article_id === res.data.article_id) {
              return {...art, ...res.data.article};
            } else {
              return art;
            }
          });
        });
        setMessage(res.data.message)
        setSpinnerOn(false)
        console.log(res.data.article);
      })
      .catch(err => {
        console.error("Error updating article:", err);
      });
  };
  

  const deleteArticle = (article_id) => {
    // ✨ implement
    setMessage("")
    setSpinnerOn(true)
    const token = localStorage.getItem("token");
    axios
      .delete(`${articlesUrl}/${article_id}`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.article_id !== article_id)
        );
        setMessage(res.data.message)
        console.log(res);
        setSpinnerOn(false)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticle={currentArticle}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
