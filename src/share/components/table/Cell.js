import TableCell from '@mui/material/TableCell';
import withStyles from '@mui/styles/withStyles';

const Cell = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(TableCell);

export default Cell;
