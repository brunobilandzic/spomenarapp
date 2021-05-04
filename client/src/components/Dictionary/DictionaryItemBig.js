import React from "react";
import { Link } from "react-router-dom";
import parseDate from "../../helpers/date";
import {
  GENERIC_DICTIONARY_IMAGE,
  INCOGNITO_PROFILE_IMAGE,
} from "../../style/images";
import "../../style/dictionary/spacing.scss";
import "../../style/dictionary/graphic.scss";
import DictionaryControl from "./DictionaryControl";

export default function DictionaryItemBig(props) {
  const { dict } = props;

  return (
    <div className="dict-info">
      <div>
        <img
          className="dict-info-image"
          src={dict.imageUrl ? dict.imageUrl : GENERIC_DICTIONARY_IMAGE}
        />
      </div>
      <div className="dict-info-text">
        <div>
          <div className="dict-info-title">
            <b className="">{dict.title}</b>
          </div>
          <div className="dict-description">{dict.description}</div>
        </div>
        <div className="dict-info-footer d-flex justify-content-between">
          <div className="dict-author-date">
            <Link
              className="app-navigation-link"
              to={"/" + dict.author_username}
            >
              <div className="dict-info-author username-image-sm username-image">
                <img
                  className="round-box round-box-sm"
                  src={
                    props.imageUrl ? props.imageUrl : INCOGNITO_PROFILE_IMAGE
                  }
                />
                <div>{dict.author_username}</div>
              </div>
            </Link>
            <div className="dict-info-date">{parseDate(dict.date)}</div>
          </div>
          <div>{props.control && <DictionaryControl dict={dict.id} />}</div>
        </div>
      </div>
    </div>
  );
}
