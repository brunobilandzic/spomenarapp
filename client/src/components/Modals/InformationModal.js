import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function InformationModal(props) {
  return (
    <div>
      <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader toggle={props.toggle}>{props.modalHeader}</ModalHeader>
        <ModalBody>
          <div>{props.modalBody}</div>
          {props.modalPath && (
            <a href={"http://localhost:3000/" + props.modalPath}>
              {"http://localhost:3000/" + props.modalPath}
            </a>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}
