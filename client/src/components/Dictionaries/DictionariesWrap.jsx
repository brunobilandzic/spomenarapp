import React, { useState, useEffect } from "react";
import {
  loadUserDictionaries,
  loadAllDictionaries,
  clearDictionaries,
  fetchAnswersCount,
  clearAnswersCount,
} from "../../actions/dictionaryActions";
import { fetchImagesByUsernames } from "../../actions/friendsActions";
import DictionaryItem from "./DictionaryItem";
import { connect } from "react-redux";
import propTypes from "prop-types";
import "../../style/dictionary-wrap/spacing.scss";
import "../../style/dictionary-wrap/graphic.scss";
function DictionariesWrap(props) {
  const [dontRun] = useState(null);
  useEffect(() => {
    props.author
      ? props.loadUserDictionaries(props.userId)
      : props.loadAllDictionaries();

    return () => {
      props.clearDictionaries();
      props.clearAnswersCount();
    };
  }, [dontRun]);

  useEffect(() => {
    if (!props.dictionaries || !props.dictionaries.length) return;
    props.fetchImagesByUsernames([...props.dictionaries.map((d) => d.author)]);
    props.fetchAnswersCount([...props.dictionaries.map((d) => d._id)]);
  }, [props.dictionaries]);
  function renderDictionaries() {
    if (props.dictionaries === null) {
      return "...Loading";
    }
    if (props.dictionaries.length == 0) {
      return <div>No dictionaries here yet.</div>;
    }
    return props.dictionaries.map((dict) => (
      <DictionaryItem
        imageUrl={
          props.usernameImages && props.usernameImages[dict.author_username]
        }
        count={props.answersCounts && props.answersCounts[dict._id]}
        key={dict._id}
        dict={{ ...dict }}
      />
    ));
  }

  return <div className="dicts-wrap">{renderDictionaries()}</div>;
}

DictionariesWrap.propTypes = {
  loadAllDictionaries: propTypes.func.isRequired,
  loadUserDictionaries: propTypes.func.isRequired,
  clearDictionaries: propTypes.func.isRequired,
  dictionaries: propTypes.array,
  fetchImagesByUsernames: propTypes.func.isRequired,
  answersCounts: propTypes.object,
  clearAnswersCount: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dictionaries: state.dictionaries.dictionaries,
  usernameImages: state.friends.usernameImages,
  answersCounts: state.dictionaries.answersCounts,
});

export default connect(mapStateToProps, {
  loadAllDictionaries,
  loadUserDictionaries,
  clearDictionaries,
  fetchImagesByUsernames,
  fetchAnswersCount,
  clearAnswersCount,
})(DictionariesWrap);
