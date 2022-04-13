import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten, makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';
import CropFreeIcon from '@material-ui/icons/CropFree';

export default function UserTable(props) {
  const classes = useStyles();
  const { users, onAddClick, onDeleteClick } = props;
  const [selected, setSelected] = React.useState([]);
  const [dense, setDense] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.address);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleAddClick = (event) => {
    setOpen(true);
  };

  const handleScanClick = (event) => {
    console.log(12321312323123123);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleDeleteClick = (event) => {
    onDeleteClick(selected);
  };

  const handleAddUser = (name, address) => {
    setOpen(false);
    onAddClick(name, address);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event, address) => {
    const selectedIndex = selected.indexOf(address);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, address);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const normalTableRow = {
    background: 'white',
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <UserTableToolbar
          numSelected={selected.length}
          onAddClick={handleAddClick}
          onScanClick={handleScanClick}
          onDeleteClick={handleDeleteClick}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <UserTableHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={users.length}
            />

            <TableBody>
              {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row.address);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.address)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.address}
                    selected={isItemSelected}
                    style={normalTableRow}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} color="primary" />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.address}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <AddUserDialog open={open} onClose={handleClose} onConfirm={handleAddUser} />
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const UserTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, onAddClick, onScanClick, onDeleteClick } = props;
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="primary" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          参与抽奖用户
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="删除">
          <IconButton aria-label="delete" onClick={onDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Box display="flex" flexDirection="row">
          <Tooltip title="扫码参与">
            <IconButton aria-label="scan" onClick={onScanClick}>
              <CropFreeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="添加抽奖用户">
            <IconButton aria-label="add" onClick={onAddClick}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Toolbar>
  );
};

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: '姓名' },
  { id: 'address', numeric: false, disablePadding: false, label: '账户地址' },
];

function UserTableHead(props) {
  const { classes, onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
            color="primary"
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

UserTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function AddUserDialog(props) {
  const classes = useStyles();
  const { onClose, onConfirm, open } = props;
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');

  const handleClickConfirm = () => {
    onConfirm(name, address);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeAddres = (e) => {
    setAddress(e.target.value);
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">添加抽奖用户</DialogTitle>
      <Box p={1}>
        <TextField id="outlined-basic" label="姓名" value={name} variant="outlined" onChange={handleChangeName} />
      </Box>

      <Box p={1}>
        <TextField
          id="outlined-basic"
          label="账户地址"
          value={address}
          variant="outlined"
          onChange={handleChangeAddres}
        />
      </Box>

      <Box display="flex" flexDirection="row" p={1} m={1} bgcolor="background.paper">
        <Box p={1}>
          <Button variant="contained" onClick={onClose}>
            取消
          </Button>
        </Box>
        <Box p={1}>
          <Button variant="contained" color="primary" onClick={handleClickConfirm}>
            确认
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
