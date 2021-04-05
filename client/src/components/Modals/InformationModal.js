import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function InformationModal(props) {
  return (
    <div>
      <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader toggle={props.toggle}>{props.modalHeader}</ModalHeader>
        <ModalBody>{props.modalBody}</ModalBody>
      </Modal>
    </div>
  );
}
