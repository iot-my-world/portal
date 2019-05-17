import React from "react";
import { connect } from "react-redux";
import TK102 from "./TK102";
import { NotificationFailure, NotificationSuccess } from "actions/notification";

let TK102Container = props => {
  return <TK102 {...props} />;
};

const mapStateToProps = state => {
  return {
    claims: state.auth.claims,
    party: state.auth.party,
  };
};

TK102Container = connect(
  mapStateToProps,
  {
    NotificationSuccess,
    NotificationFailure,
  }
)(TK102Container);

export default TK102Container;
