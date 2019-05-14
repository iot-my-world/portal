// ##############################
// // // Pages Layout styles
// #############################

// import {
//
// } from "assets/jss/material-dashboard-pro-react.jsx";

const pagesStyle = {
  wrapper: {
    height: "auto",
    minHeight: "100vh",
    position: "relative",
    top: "0",
    overflow: "hidden"
  },
  fullPage: {
    "&:before": {
      backgroundColor: "rgba(0, 0, 0, 0.65)"
    },
    "&:before,&:after": {
      display: "block",
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "0",
      left: "0",
      zIndex: "2"
    }
  },
  fullPageBackground: {
    position: "absolute",
    zIndex: "1",
    height: "100%",
    width: "100%",
    display: "block",
    top: "0",
    left: "0",
    backgroundSize: "cover",
    backgroundPosition: "center center"
  }
};

export default pagesStyle;
