import React, { useState, Fragment, useEffect } from "react";
import { Modal, ModalHeader } from "reactstrap";
import { INCOGNITO_PROFILE_IMAGE } from "../../style/images";

export default function ProfileImagePreview(props) {
  const { imageUrl } = props;
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  return (
    <Fragment>
      <div className="image-modal-wrap">
        <img
          className="round-box round-box-lg image-modal-toggle"
          onClick={toggleModal}
          src={imageUrl ? imageUrl : INCOGNITO_PROFILE_IMAGE}
        />
      </div>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader
          className="modal-header-custom"
          toggle={toggleModal}
        ></ModalHeader>
        <img
          className="image-modal full-image"
          src={imageUrl ? imageUrl : INCOGNITO_PROFILE_IMAGE}
        />
      </Modal>
    </Fragment>
  );
}
