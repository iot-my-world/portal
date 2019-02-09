import {HexToRGBA} from 'utilities/color'

const tableStyle = (theme) => {
  return {
    CellValueStyle: {
      alignSelf: 'center',
      justifySelf: 'center',
      color: theme.palette.primary.contrastText,
    },
    Table: {
      border: 'none',
      overflow: 'hidden',
      ...theme.typography.body1,
      backgroundColor: 'white',
    },
    TableHeader: {
      boxShadow: 'none',
      backgroundColor: HexToRGBA(theme.palette.primary.main, 1),
      color: theme.palette.primary.contrastText,
    },
    TableHeaderRow: {
      ...theme.typography.subheading,
      color: theme.palette.primary.contrastText,
      height: '34px',
    },
    TableRow: {
      borderBottom: 'none',
      minHeight: '0px',
    },
  }
}

export default tableStyle
