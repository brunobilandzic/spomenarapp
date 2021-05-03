import React, { useEffect, useState } from "react";
import { Input, Button, Label } from "reactstrap";
import { connect } from "react-redux";
import propTypes from "prop-types";
import {
  changeProfileImage,
  deleteProfileImage,
} from "../../../../actions/authActions";
import { INCOGNITO_PROFILE_IMAGE } from "../../../../style/images";

function ProfileImageChange(props) {
  const [newImageObject, setNewImageObject] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!props.user) return;
    console.log("updating image url");
    setImageUrl(props.user.imageUrl);
  }, [props.user]);

  const onChangeImage = (e) => {
    setNewImageObject(e.target.files[0]);
  };
  const onSubmit = () => {
    if (!newImageObject) return setError("Please do choose a file");
    props.changeProfileImage(newImageObject);
  };
  const onDelete = () => {
    if (window.confirm("Do you want to delete your profile image?"))
      props.deleteProfileImage();
  };
  return (
    <div>
      <div>
        <img
          className="round-box round-box-lg"
          src={imageUrl ? imageUrl : INCOGNITO_PROFILE_IMAGE}
        />
      </div>
      <div>
        <Label for="image">Choose your new image</Label>
        <Input
          type="file"
          onChange={onChangeImage}
          accept=".jpg,.png"
          name="image"
        />
      </div>
      <div>{error}</div>
      <div>
        <Button type="submit" onClick={onSubmit}>
          Submit
        </Button>
      </div>
      <Button onClick={onDelete}>Delete Profile Image</Button>
    </div>
  );
}

ProfileImageChange.propTypes = {
  changeProfileImage: propTypes.func.isRequired,
  user: propTypes.object,
  deleteProfileImage: propTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  changeProfileImage,
  deleteProfileImage,
})(ProfileImageChange);
