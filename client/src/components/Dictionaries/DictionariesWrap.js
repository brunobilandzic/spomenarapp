import React, { useState, useEffect } from "react";
import {
  loadUserDictionaries,
  loadAllDictionaries,
  clearDictionaries,
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
    };
  }, [dontRun]);

  useEffect(() => {
    if (!props.dictionaries || !props.dictionaries.length) return;
    props.fetchImagesByUsernames([...props.dictionaries.map((d) => d.author)]);
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
};

const mapStateToProps = (state) => ({
  dictionaries: state.dictionaries.dictionaries,
  usernameImages: state.friends.usernameImages,
});

export default connect(mapStateToProps, {
  loadAllDictionaries,
  loadUserDictionaries,
  clearDictionaries,
  fetchImagesByUsernames,
})(DictionariesWrap);
