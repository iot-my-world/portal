// ##############################
// // // PricingPage Pages View styles
// #############################

import {
  container,
  defaultFont,
  cardTitle,
  roseColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const pricingPageStyle = {
  content: {
    minHeight: "calc(100vh - 80px)",
    position: "relative",
    zIndex: "4"
  },
  container: {
    ...container
  },
  title: {
    ...defaultFont,
    color: "#FFFFFF",
    marginTop: "13vh",
    marginBottom: "30px",
    textAlign: "center"
  },
  description: {
    fontSize: "18px",
    color: "#FFFFFF",
    textAlign: "center"
  },
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF !important"
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px"
  },
  cardCategoryWhite: {
    color: "#FFFFFF",
    marginTop: "10px"
  },
  icon: {
    color: "rgba(255, 255, 255, 0.76)",
    margin: "10px auto 0",
    width: "130px",
    height: "130px",
    border: "1px solid #E5E5E5",
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px"
    }
  },
  iconWhite: {
    color: "#FFFFFF"
  },
  iconRose: {
    color: roseColor
  },
  marginTop30: {
    marginTop: "30px"
  }
};

export default pricingPageStyle;
