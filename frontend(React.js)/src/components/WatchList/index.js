import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { IconButton } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import axios from 'axios'
import { HOST } from '../../constants/constants'
import { useEffect, useState } from 'react'
import { userAtom } from '../../configurations'
import { useRecoilState } from 'recoil'
import { StockList } from '../StockList'
import Loader from '../Loader'

export const WatchList = ({ width = '50%' }) => {
    const [user, setUser] = useRecoilState(userAtom);
    const [stocksInWatchlist, setStocksInWatchlist] = useState([])
    const [stocksNotInWatchlist, setStocksNotInWatchlist] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setStocksInWatchlist(user.stocksInWatchlist);
        setStocksNotInWatchlist(user.stocksNotInWatchlist);
    }, [user]);

    const getLatestData = () => {
        setLoading(true);
        const url =
            HOST +
            'users/stock/?username=' +
            user.username +
            '&stock_refresh=true';
        axios
            .get(url)
            .then((response) => {
                if (response.status === 200) {
                    setUser(prev => {
                        return {...prev, stocksInWatchlist: response.data.data.stocks_in_watchlist, stocksNotInWatchlist: response.data.data.stocks_not_in_watchlist}                        
                    })
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    const handleRefresh = () => {
        getLatestData();
    }
    useEffect(() => {
        getLatestData()
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            getLatestData()
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    const removeStock = (stock) => {
        const url = HOST + 'users/stock/';
        axios
            .patch(url, {
                username: user.username,
                stock_name: stock,
            })
            .then((response) => {
                if (response.status === 200) {
                    const temp1 = stocksNotInWatchlist; 
                    const temp2 = stocksInWatchlist;
                    const temp3 = temp2.filter((item) => item.stock_name !== stock.stock_name);
                    setStocksInWatchlist(temp3);
                    const temp4 = temp1.concat(stock);
                    setStocksNotInWatchlist(temp4);
                    alert('stock removed from watchlist')
                    getLatestData()
                }
            })
            .catch((error) => {
                console.log(error);
            })
            
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                <TableContainer
                    component={Paper}
                    sx={{
                        width,
                        margin: 'auto',
                        marginTop: '5%',
                        borderStyle: 'solid',
                        borderColor: 'black',
                        borderWidth: 1,
                    }}
                >
                    <Table aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align='center'
                                    sx={{ color: 'green', fontWeight: 'bold' }}
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    align='center'
                                    sx={{ color: 'green', fontWeight: 'bold' }}
                                >
                                    Symbol
                                </TableCell>
                                <TableCell
                                    align='center'
                                    sx={{ color: 'green', fontWeight: 'bold' }}
                                >
                                    Price (in $)
                                </TableCell>
                                <TableCell
                                    align='center'
                                    sx={{ color: 'green', fontWeight: 'bold' }}
                                >
                                    Change
                                </TableCell>
                                <TableCell align='left'>
                                    <IconButton
                                        aria-label='refresh'
                                        onClick={handleRefresh}
                                    >
                                        <RefreshIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocksInWatchlist.map((row) => (
                                <TableRow
                                    key={row.stock_name}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell
                                        component='th'
                                        scope='row'
                                        align='center'
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {row.stock_name}
                                        <br />
                                        <img
                                            src={row.stock_image}
                                            style={{ width: 100 }}
                                        />
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row.stock_symbol}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {row.price}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        sx={{
                                            color:
                                                row.stock_diff > 0
                                                    ? 'green'
                                                    : 'red',
                                        }}
                                    >
                                        {row.stock_diff} ({row.stock_delta} %)
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            aria-label='delete'
                                            onClick={() => {
                                                removeStock(row.stock_name)
                                            }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            <StockList />
            </>
            )}

        </>
    )
}
