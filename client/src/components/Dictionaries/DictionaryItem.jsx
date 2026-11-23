import React from "react";
import { Link } from "react-router-dom";
import { Card, CardImg, CardFooter, CardBody, CardTitle } from "reactstrap";
import parseDate from "../../helpers/date";
import truncate from "../../helpers/truncate";
import {
  GENERIC_DICTIONARY_IMAGE,
  INCOGNITO_PROFILE_IMAGE,
} from "../../style/images";
export default function DictionaryItem(props) {
  const { dict } = props;

  return (
    <div className="dict-item">
      <Card className="dict-item-card">
        <div className="dict-item-image-wrapper">
          <Link to={`/dictionary/${dict._id}`} className="app-navigation-link">
            <CardImg
              className="dict-item-image"
              top
              width="100%"
              src={dict.imageUrl ? dict.imageUrl : GENERIC_DICTIONARY_IMAGE}
            />
          </Link>
        </div>
        <CardBody className="d-flex flex-column justify-content-between">
          <div>
            <div className="dict-item-head">
              <CardTitle>
                <div className="dict-item-title">
                  <Link
                    to={`/dictionary/${dict._id}`}
                    className="app-navigation-link"
                  >
                    <b className="">{dict.title}</b>
                  </Link>
                </div>
              </CardTitle>
            </div>
            <div className="dict-description">
              {truncate(dict.description, 150)}
            </div>
          </div>
          <CardFooter className="dict-item-footer">
            <Link
              className="app-navigation-link"
              to={"/" + dict.author_username}
            >
              <div className="dict-item-author username-image-sm username-image">
                <img
                  className="round-box round-box-sm"
                  src={
                    props.imageUrl ? props.imageUrl : INCOGNITO_PROFILE_IMAGE
                  }
                />
                <div>{dict.author_username}</div>
              </div>
            </Link>
            <div className="answer-count-wrap d-flex">
              <div className="answer-count-icon mr-2">
                <i className="fas fa-user dark-blue"></i>
              </div>
              <div className="answer-count-count">{props.count}</div>
            </div>
            <div className="dict-item-date">{parseDate(dict.date)}</div>
          </CardFooter>
        </CardBody>
      </Card>
    </div>
  );
}
