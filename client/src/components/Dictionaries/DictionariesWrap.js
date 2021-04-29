import React, { useState, useEffect } from "react";
import {
  loadUserDictionaries,
  loadAllDictionaries,
  clearDictionaries,
} from "../../actions/dictionaryActions";
import DictionaryItem from "./DictionaryItem";
import { connect } from "react-redux";
import propTypes from "prop-types";

function DictionariesWrap(props) {
  const [dontRun] = useState(null);
  useEffect(() => {
    props.author ? props.loadUserDictionaries() : props.loadAllDictionaries();

    return () => {
      props.clearDictionaries();
    };
  }, [dontRun]);

  function renderDictionaries() {
    if (props.dictionaries === null) {
      return "...Loading";
    }
    return props.dictionaries.map((dict) => (
      <DictionaryItem key={dict._id} dict={{ ...dict }} />
    ));
  }

  return <div className="dictionaries-wrap">{renderDictionaries()}</div>;
}

DictionariesWrap.propTypes = {
  loadAllDictionaries: propTypes.func.isRequired,
  loadUserDictionaries: propTypes.func.isRequired,
  clearDictionaries: propTypes.func.isRequired,
  dictionaries: propTypes.array,
};

const mapStateToProps = (state) => ({
  dictionaries: state.dictionaries.dictionaries,
});

export default connect(mapStateToProps, {
  loadAllDictionaries,
  loadUserDictionaries,
  clearDictionaries,
})(DictionariesWrap);
