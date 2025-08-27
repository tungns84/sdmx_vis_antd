import React from 'react';
import Collapse from '@mui/material/Collapse';
import makeStyles from '@mui/styles/makeStyles';
import { ShortUrls } from '@sis-cc/dotstatsuite-visions';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import useShortenUrl from '../../hooks/useShortenUrl';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(1, 0, 1, 0),
    padding: theme.spacing(2),
  },
}));

const ShortUrl = ({ open, setOpen }) => {
  const classes = useStyles();
  const { props, shortenUrl } = useShortenUrl();

  return (
    <>
      <Collapse in={open}>
        <Paper elevation={2} className={classes.container}>
          <IconButton
            style={{ float: 'right' }}
            size="small"
            color="primary"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <ShortUrls {...props} onClick={shortenUrl} />
        </Paper>
      </Collapse>
    </>
  );
};

export default ShortUrl;
