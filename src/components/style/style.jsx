const drawerWidth = 260

const drawerMiniWidth = 80

const transition = {
  transition: "all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
}

const containerFluid = {
  paddingRight: "15px",
  paddingLeft: "15px",
  marginRight: "auto",
  marginLeft: "auto",
  "&:before,&:after": {
    display: "table",
    content: '" "'
  },
  "&:after": {
    clear: "both"
  }
}

const container = {
  paddingRight: "15px",
  paddingLeft: "15px",
  marginRight: "auto",
  marginLeft: "auto",
  "@media (min-width: 768px)": {
    width: "750px"
  },
  "@media (min-width: 992px)": {
    width: "970px"
  },
  "@media (min-width: 1200px)": {
    width: "1170px"
  },
  "&:before,&:after": {
    display: "table",
    content: '" "'
  },
  "&:after": {
    clear: "both"
  }
}

const boxShadow = {
  boxShadow:
    "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
}

const card = {
  display: "inline-block",
  position: "relative",
  width: "100%",
  margin: "25px 0",
  boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
  borderRadius: "6px",
  color: "rgba(0, 0, 0, 0.87)",
  background: "#fff"
}

const defaultFont = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: "300",
  lineHeight: "1.5em"
}

const primaryColor = "#9c27b0"
const warningColor = "#ff9800"
const dangerColor = "#f44336"
const successColor = "#4caf50"
const infoColor = "#00acc1"
const roseColor = "#e91e63"

const primaryBoxShadow = {
  boxShadow:
    "0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)"
}

const defaultBoxShadow = {
  border: "0",
  borderRadius: "3px",
  boxShadow:
    "0 10px 20px -12px rgba(0, 0, 0, 0.42), 0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
  padding: "10px 0",
  transition: "all 150ms ease 0s"
}

const tooltip = {
  padding: "10px 15px",
  minWidth: "130px",
  color: "#FFFFFF",
  lineHeight: "1.7em",
  background: "rgba(85,85,85,0.9)",
  border: "none",
  borderRadius: "3px",
  opacity: "1!important",
  boxShadow:
    "0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2)",
  maxWidth: "200px",
  textAlign: "center",
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: "400",
  textShadow: "none",
  textTransform: "none",
  letterSpacing: "normal",
  wordBreak: "normal",
  wordSpacing: "normal",
  wordWrap: "normal",
  whiteSpace: "normal",
  lineBreak: "auto"
}

export {
  //variables
  drawerWidth,
  drawerMiniWidth,
  transition,
  container,
  containerFluid,
  boxShadow,
  card,
  defaultFont,
  primaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  primaryBoxShadow,
  defaultBoxShadow,
  tooltip,
}
