import React from "react";
import { Link } from "react-router-dom";
import { Card, CardFooter, CardBody, CardTitle } from "reactstrap";
import parseDate from "../../helpers/date";
import truncate from "../../helpers/truncate";
export default function DictionaryItem(props) {
  const { dict } = props;
  const dictionaryPath = `/dictionary/${dict._id}`;

  return (
    <div className={import.meta.env.STATIC_DEMO ? "dict-item w-100" : "dict-item"}>
      <Card className="dict-item-card">
        <CardBody className="d-flex flex-column justify-content-between">
          <div>
            <div className="dict-item-head">
              <CardTitle>
                <div className="dict-item-title">
                  {import.meta.env.STATIC_DEMO ? (
                    <b className="dark-blue">{dict.title}</b>
                  ) : (
                    <Link to={dictionaryPath} className="app-navigation-link">
                      <b>{dict.title}</b>
                    </Link>
                  )}
                </div>
              </CardTitle>
            </div>
            <div className="dict-description">
              {truncate(dict.description, 150)}
            </div>
            {import.meta.env.STATIC_DEMO && (
              <Link to={dictionaryPath} className="btn btn-dark mb-3">
                Open sample spomenar
              </Link>
            )}
          </div>
          <CardFooter className="dict-item-footer">
            {import.meta.env.STATIC_DEMO ? (
              <span>{dict.author_username}</span>
            ) : (
              <Link className="app-navigation-link" to={"/" + dict.author_username}>
                {dict.author_username}
              </Link>
            )}
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
