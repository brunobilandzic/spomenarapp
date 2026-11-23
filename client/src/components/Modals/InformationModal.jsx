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
            <a href={"http://spomenarapp.com/" + props.modalPath}>
              {"http://spomenarapp.com/" + props.modalPath}
            </a>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}
