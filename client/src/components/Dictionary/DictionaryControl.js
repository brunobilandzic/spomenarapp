import React from "react";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { deleteDictionary } from "../../actions/dictionaryActions";
import { Button } from "reactstrap";
function DictionaryControl(props) {
  function handleClick() {
    if (window.confirm("Are you sure you want to delete this dictionary?")) {
      props.deleteDictionary(props.dict);
      window.location.href = "/user/dictionaries";
    }
  }
  return (
    <div>
      <Button onClick={handleClick} color="danger">
        Delete
      </Button>
    </div>
  );
}
DictionaryControl.propTypes = {
  deleteDictionary: propTypes.func.isRequired,
};

export default connect(null, { deleteDictionary })(DictionaryControl);
