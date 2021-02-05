import React from 'react';
import { TableHead, TableContainer, Table, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles((theme) => {

})
function ResidentTable() {
  const rows = [
    {
      'id': 1,
      'Photo': 'image',
      'name': 'Johan With',
      'group': 'Lakeside flats'
    },
    {
      'id': 2,
      'Photo': 'image',
      'name': 'Johan With',
      'group': 'Lakeside flats'
    },
  ]
  const classes = useStyles()
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="caption table">
        <caption>A basic table example with a caption</caption>
        <TableHead>
          <TableRow>
            {
              Object.keys(rows[0]).map((obj, i) => {
                return <TableCell key={i}>{obj==='id'?'':obj}</TableCell>
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{i+1}</TableCell>             
              <TableCell>{row.Photo}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.group}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResidentTable;