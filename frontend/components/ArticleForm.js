import React, { useEffect, useState } from "react";
import PT from "prop-types";

const initialFormValues = { title: "", text: "", topic: "" };

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues);
  // ✨ where are my props? Destructure them here
  const { postArticle, updateArticle, setCurrentArticleId, currentArticle } =
    props;

  console.log(values);

  useEffect(() => {
    if (currentArticle) {
      setValues({
        title: currentArticle.title || '',
        text: currentArticle.text || '',
        topic: currentArticle.topic || ''
      });
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticle]);
  

  const onChange = (evt) => {
    const { id, value } = evt.target;
    // console.log(`onChange called: id=${id}, value=${value}`); // Add this line
    setValues({ ...values, [id]: value });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    if (currentArticle) {
      updateArticle({
        article_id: currentArticle.article_id,
        article: { title: values.title, text: values.text, topic: values.topic },
      });
      setValues(initialFormValues)
    } else {
      postArticle({ title: values.title, text: values.text, topic: values.topic });
    }
    setCurrentArticleId(undefined)
    // Ensure there's no state reset here.
    // setValues(initialFormValues);
  };
  

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    if (!values.text || !values.title || !values.topic) {
      return true;
    }
    return false;
  };

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{!currentArticle ? "Create Article" : "Edit Article"}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title || ''}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text || ''}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic || ''}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        {!currentArticle ? (
          <button disabled={isDisabled()} id="submitArticle">
            Submit
          </button>
        ) : (
          <>
            <button disabled={isDisabled()} id="submitArticle">
              Submit
            </button>
            <button onClick={() => setCurrentArticleId(undefined)}>
              Cancel edit
            </button>
          </>
        )}
      </div>
    </form>
  );
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  }),
};
