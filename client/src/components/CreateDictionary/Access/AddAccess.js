import React from "react";
import { Label, Button, ButtonGroup } from "reactstrap";
import AccessModal from "./AccessModal";
export default function AddAccess(props) {
  return (
    <div>
      <Label>Set Access</Label>
      <br></br>
      <ButtonGroup>
        <Button
          color="primary"
          className="mr-2"
          active={!props.access}
          onClick={() => props.setAccess(false)}
        >
          Public
        </Button>
        <Button
          color="primary"
          active={props.access}
          onClick={() => {
            props.setAccess(true);
            console.log("private");
          }}
        >
          Private
        </Button>
      </ButtonGroup>
      <div>
        {!props.access ? (
          <div>Anyone will be able to read and answer this dictionary.</div>
        ) : (
          <AccessModal />
        )}
      </div>
    </div>
  );
}
