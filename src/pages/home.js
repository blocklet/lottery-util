import React from 'react';
import UserTable from './userTable';
import PrizeTable from './prizeTable';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { SessionProvider, useSessionContext } from '../contexts/session';
import get from 'lodash/get';
import Divider from '@material-ui/core/Divider';

import axios from 'axios';

// import each module individually
import DidAddress from '@arcblock/did-connect/lib/Address';
import DidConnect from '@arcblock/did-connect/lib/Connect';
import DidAvatar from '@arcblock/did-connect/lib/Avatar';
import DidButton from '@arcblock/did-connect/lib/Button';
import DidLogo from '@arcblock/did-connect/lib/Logo';
import SessionManager from '@arcblock/did-connect/lib/SessionManager';

function createUserData(name, address) {
  return { name, address };
}

function createPrizeData(name, amount, number) {
  return { name, amount, number };
}

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}

var userRows = [
  createUserData('David', 'z1aU69jJBst6kajCdvpxJ87exNUneKNUT1x'),
  createUserData('Petter', 'zNKtNT5wZFGUeMAbyyL9qLXgMdcvSy7AdhQt'),
  createUserData('Tony', 'z1YDp1sfLjYbe9YRnGge6VVspwANA2DY19e'),
  createUserData('Linda', 'z1ZCfeN5hTAKqqB2ghv7KfP74jKZvbczXQX'),
  createUserData('Join', 'z1oefFSpVMGBFkgXFebBrrc3SeAF9jejLFJ'),
  createUserData('Steven', 'z1oW4r4dmUDECWhCFjpH3ssgDX64wZShNte'),
  createUserData('Keven', 'z1fZA74z1bbdSPC4tW58LiFuWHSWgHiihsU'),
  createUserData('Snow', 'z1jXrkzqQCGCBHjJs4papw1UGB1mm7LJrFr'),
  createUserData('White', 'z1cQvqLWXsJ8JwxbgZ2GYn2atLJhKTqGjvB'),
];

var prizeRows = [
  createPrizeData('?????????', '100', '1'),
  createPrizeData('?????????', '50', '2'),
  createPrizeData('?????????', '20', '5'),
];

var winUsers = [];
var sendedUsers = [];

export default function Home() {
  const [users, setUsers] = React.useState(userRows);
  const [prizes, setPrizes] = React.useState(prizeRows);
  const [winDialogOpen, setWinDialogOpen] = React.useState(false);
  const [curWinUser, setCurWinUser] = React.useState(createUserData('', ''));
  const [curPrize, setCurPrize] = React.useState(createPrizeData('', '', ''));
  const [prizeDialogOpen, setPrizeDialogOpen] = React.useState(false);
  const [openConnect, setOpenConnect] = React.useState(false);
  const { session } = useSessionContext();

  const handleClickCheck = (name) => {
    const prize = prizes.find((item) => item.name == name);
    setCurPrize(prize);
    setPrizeDialogOpen(true);
  };

  const handleClickLottery = (name) => {
    /// ???????????????????????????????????????????????????
    const totalWinNum = prizes.reduce(function (prev, cur, index, arr) {
      return prev + Number(cur.number);
    }, 0);
    if (users.length < totalWinNum) {
      alert('????????????????????????????????????,????????????');
    }

    /// ??????????????????????????????
    const prize = prizes.find((item) => item.name == name);
    var oldWinUsers = winUsers[name];

    if (typeof oldWinUsers != 'undefined' && Number(prize.number) <= oldWinUsers.length) {
      alert(name + '?????????');
      return;
    }
    /// ??????
    var oldAllWinUsers = [];
    for (var key in winUsers) {
      const wins = winUsers[key];
      if (typeof wins != 'undefined') {
        oldAllWinUsers.push(...wins);
      }
    }
    const qualifiedUsers = users.filter((item) => !oldAllWinUsers.map((item) => item.address).includes(item.address));
    const winIndex = randomNum(0, qualifiedUsers.length - 1);
    const winUser = qualifiedUsers[winIndex];
    /// ?????????????????????
    if (typeof oldWinUsers == 'undefined') {
      winUsers[name] = [winUser];
    } else {
      oldWinUsers = [winUser, ...oldWinUsers];
      winUsers[name] = oldWinUsers;
    }
    setCurWinUser(winUser);
    setCurPrize(prize);
    setWinDialogOpen(true);
  };

  const handleDeleteUser = (address) => {
    var array = users;
    const newUsers = array.filter((item) => !address.includes(item.address));
    setUsers(newUsers);
  };

  const handleAddUser = (name, address) => {
    if (users.map((item) => item.address).includes(address)) {
      alert('????????????????????????');
      return;
    }
    const newUsers = [createUserData(name, address), ...users];
    setUsers(newUsers);
  };

  const handleDeletePrize = (name) => {
    var array = prizes;
    const nePrizes = array.filter((item) => item.name != name);
    setPrizes(nePrizes);
  };

  const handleAddPrize = (name, amount, number) => {
    if (prizes.map((item) => item.name).includes(name)) {
      alert('??????????????????');
      return;
    }

    const newPrizes = [...prizes, createPrizeData(name, amount, number)];
    setPrizes(newPrizes);
  };

  const handleWinDialogConfirm = () => {
    setWinDialogOpen(false);
  };

  const handlePrizeDialogConfirm = () => {
    setPrizeDialogOpen(false);
  };

  const handleSend = (user) => {
    if (sendedUsers.map((item) => item.address).includes(user.address)) {
      alert('????????????????????????????????????');
      return;
    }

    setOpenConnect(true);
  };

  const handleSendSuccess = (user) => {
    sendedUsers = [user, ...sendedUsers];
  };

  const handleCloseSend = (event) => {
    setOpenConnect(false);
  };

  return (
    <div>
      <Box mx="auto" display="flex" justifyContent={'space-between'} alignItems={'center'}>
        <Box p={1}>
          <h2>WeLucky</h2>
        </Box>

        <Box p={1}>
          <SessionProvider>
            <SessionManager session={session} showRole />
          </SessionProvider>
        </Box>
      </Box>

      <PrizeTable
        prizes={prizes}
        onCheck={handleClickCheck}
        onLottery={handleClickLottery}
        onAddClick={handleAddPrize}
        onDeleteClick={handleDeletePrize}
      />
      <UserTable users={users} onAddClick={handleAddUser} onDeleteClick={handleDeleteUser} />
      <LotteryDialog open={winDialogOpen} user={curWinUser} prize={curPrize} onConfirm={handleWinDialogConfirm} />
      <PrizeDialog
        open={prizeDialogOpen}
        winUsers={winUsers[curPrize.name]}
        prize={curPrize}
        onConfirm={handlePrizeDialogConfirm}
        onSend={handleSend}
      />
      <DidConnect
        popup
        open={openConnect}
        action="sendPrize"
        extraParams={{ amount: curPrize.amount, toAddress: curWinUser.address, winName: curWinUser.name }}
        checkFn={axios.get}
        onClose={() => handleCloseSend()}
        onSuccess={() => handleSendSuccess(curWinUser)}
        messages={{
          title: 'login',
          scan: 'Scan QR code with DID Wallet',
          confirm: 'Confirm Send Prize',
          success: 'You have successfully send prize!',
        }}
        cancelWhenScanned={() => {}}
      />
    </div>
  );
}

const paperProps = {
  style: {
    width: 500,
  },
};

function LotteryDialog(props) {
  const { user, prize, onConfirm, open } = props;

  const handleClickConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open} maxWidth={false} PaperProps={paperProps}>
      <Box mx="auto" p={1}>
        <DialogTitle id="simple-dialog-title">{prize.name}????????????</DialogTitle>
      </Box>

      <Box p={1}>
        <div>????????? : {user.name}</div>
      </Box>

      <Box p={1}>
        <div>???????????? : {user.address}</div>
      </Box>

      <Box p={1} mx="auto">
        <Button variant="contained" color="primary" onClick={handleClickConfirm}>
          ??????
        </Button>
      </Box>
    </Dialog>
  );
}

function PrizeDialog(props) {
  const { winUsers, prize, onConfirm, onSend, open } = props;
  const handleClickConfirm = () => {
    onConfirm();
  };

  const handleClickSend = (user) => {
    onSend(user);
  };

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open} maxWidth={false} PaperProps={paperProps}>
      <Box mx="auto" p={1}>
        <DialogTitle id="simple-dialog-title">{prize.name}</DialogTitle>
      </Box>

      <Box p={1}>
        <div>?????? : {prize.amount}</div>
      </Box>

      <Box p={1}>
        <div>?????? : {prize.number}</div>
      </Box>

      {typeof winUsers != 'undefined' ? (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>??????</TableCell>
                <TableCell align="left">????????????</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {winUsers.map((row) => (
                <TableRow key={row.address}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.address}</TableCell>
                  <TableCell align="left">
                    <Button color="primary" onClick={(e) => handleClickSend(row)}>
                      ??????
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box p={1}></Box>
      )}

      <Box p={1} mx="auto">
        <Button variant="contained" color="primary" onClick={handleClickConfirm}>
          ??????
        </Button>
      </Box>
    </Dialog>
  );
}
