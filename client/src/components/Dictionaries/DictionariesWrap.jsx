import React, { useState, useEffect } from "react";
import {
  loadUserDictionaries,
  loadAllDictionaries,
  clearDictionaries,
  fetchAnswersCount,
  clearAnswersCount,
} from "../../actions/dictionaryActions";
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
        count={props.answersCounts && props.answersCounts[dict._id]}
        key={dict._id}
        dict={{ ...dict }}
      />
    ));
  }

  const listClassName = import.meta.env.STATIC_DEMO
    ? "dicts-wrap col-md-8 mx-auto px-0"
    : "dicts-wrap";
  return <div className={listClassName}>{renderDictionaries()}</div>;
}

DictionariesWrap.propTypes = {
  loadAllDictionaries: propTypes.func.isRequired,
  loadUserDictionaries: propTypes.func.isRequired,
  clearDictionaries: propTypes.func.isRequired,
  dictionaries: propTypes.array,
  answersCounts: propTypes.object,
  clearAnswersCount: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dictionaries: state.dictionaries.dictionaries,
  answersCounts: state.dictionaries.answersCounts,
});

export default connect(mapStateToProps, {
  loadAllDictionaries,
  loadUserDictionaries,
  clearDictionaries,
  fetchAnswersCount,
  clearAnswersCount,
})(DictionariesWrap);
