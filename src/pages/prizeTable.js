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

export default function PrizeTable(props) {
  const classes = useStyles();
  const { prizes, onCheck, onLottery, onAddClick, onDeleteClick } = props;
  const [selected, setSelected] = React.useState('');
  const [dense, setDense] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleAddClick = (event) => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleDeleteClick = (event) => {
    onDeleteClick(selected);
  };

  const handleAddPrize = (name, amount, number) => {
    onAddClick(name, amount, number);
    setOpen(false);
  };

  const handleClick = (event, name) => {
    var newSelected = name;
    if (name === selected) {
      newSelected = '';
    }

    setSelected(newSelected);
  };

  const handleClickCheck = () => {
    onCheck(selected);
  };

  const handleClickLottery = () => {
    onLottery(selected);
  };

  const isSelected = (name) => selected === name;

  const normalTableRow = {
    background: 'white',
  };

  const selectedTableRow = {
    background: 'primary',
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <PrizeTableToolbar
          isSelected={selected.length != 0}
          onAddClick={handleAddClick}
          onDeleteClick={handleDeleteClick}
          onCheckClick={handleClickCheck}
          onLotteryClick={handleClickLottery}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <PrizeTableHead classes={classes} />

            <TableBody>
              {prizes.map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    style={isItemSelected ? selectedTableRow : normalTableRow}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} color="primary" />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.amount}</TableCell>
                    <TableCell align="left">{row.number}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <AddPrizeDialog open={open} onClose={handleClose} onConfirm={handleAddPrize} />
        </TableContainer>
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

const PrizeTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { isSelected, onAddClick, onDeleteClick, onLotteryClick, onCheckClick } = props;
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: isSelected,
      })}
    >
      {isSelected ? (
        <Typography className={classes.title} color="primary" variant="subtitle1" component="div">
          1 selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          奖项设置
        </Typography>
      )}

      {isSelected ? (
        <Box display="flex" flexDirection="row">
          <Button onClick={onCheckClick}>查看</Button>

          <Button onClick={onLotteryClick}>开奖</Button>

          <Tooltip title="删除">
            <IconButton aria-label="delete" onClick={onDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Tooltip title="添加奖项">
          <IconButton aria-label="add" onClick={onAddClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: '奖项名称' },
  { id: 'amount', numeric: false, disablePadding: false, label: '金额' },
  { id: 'number', numeric: false, disablePadding: false, label: '数量' },
];

function PrizeTableHead(props) {
  const { classes } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
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

PrizeTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
};

const paperProps = {
  style: {
    width: 300,
  },
};

const textProps = {
  style: {
    width: 200,
  },
};

function AddPrizeDialog(props) {
  const classes = useStyles();
  const { onClose, onConfirm, open } = props;
  const [name, setName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [number, setNumber] = React.useState('');

  const handleClickConfirm = () => {
    onConfirm(name, amount, number);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleChangeNumber = (e) => {
    setNumber(e.target.value);
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open} PaperProps={paperProps}>
      <Box mx="auto" p={1}>
        <DialogTitle id="simple-dialog-title">添加奖项</DialogTitle>
      </Box>

      <Box mx="auto" p={1} display="flex">
        <TextField
          id="outlined-basic"
          label="奖项名称"
          value={name}
          variant="outlined"
          onChange={handleChangeName}
          InputProps={textProps}
        />
      </Box>

      <Box mx="auto" p={1} display="flex">
        <TextField
          id="outlined-basic"
          label="金额"
          value={amount}
          variant="outlined"
          onChange={handleChangeAmount}
          InputProps={textProps}
        />
      </Box>

      <Box mx="auto" p={1} display="flex">
        <TextField
          id="outlined-basic"
          label="数量"
          value={number}
          variant="outlined"
          onChange={handleChangeNumber}
          InputProps={textProps}
        />
      </Box>

      <Box display="flex" mx="auto" p={1}>
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
