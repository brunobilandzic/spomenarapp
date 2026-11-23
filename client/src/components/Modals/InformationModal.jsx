import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function InformationModal(props) {
  const shareUrl =
    props.modalPath && new URL(`/${props.modalPath}`, window.location.origin).href;

  return (
    <div>
      <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader toggle={props.toggle}>{props.modalHeader}</ModalHeader>
        <ModalBody>
          <div>{props.modalBody}</div>
          {shareUrl && <a href={shareUrl}>{shareUrl}</a>}
        </ModalBody>
      </Modal>
    </div>
  );
}
