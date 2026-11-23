import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import propTypes from "prop-types";
import "../../style/profile/spacing.scss";
import "../../style/profile/graphic.scss";
function Profile(props) {
  return (
    <div>
      {props.user && <h4>@{props.user.username}</h4>}
      <div className="profile-options">
        <Link className="app-navigation-link option" to="/user/dictionaries">
          <div className="option-icon">
            <i className="fas fa-book"></i>
          </div>
          <div className="option-text">Your dictionaries</div>
        </Link>

        <Link className="app-navigation-link option" to="/friends">
          <div className="option-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="option-text">Friends</div>
        </Link>

        <Link className="app-navigation-link option" to="/settings">
          <div className="option-icon">
            <i className="fas fa-cog"></i>
          </div>
          <div className="option-text">Settings</div>
        </Link>
        <Link className="app-navigation-link option" to="/explore">
          <div className="option-icon">
            <i className="fab fa-connectdevelop"></i>
          </div>
          <div className="option-text">Connect with others</div>
        </Link>
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: propTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Profile);
