import React from 'react';
import DataAvailability from './data-availability';
import Filters from './filters';
import PiTFilter from './pit-filter';

const Side = ({ classes }) => {
  return (
    <>
      <Filters classes={classes} />
      <DataAvailability />
      <PiTFilter />
    </>
  );
};

export default Side;
