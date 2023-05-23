import Add from '@mui/icons-material/Add'
import { IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { HOST } from '../../constants/constants'
import axios from 'axios'
import { userAtom } from '../../configurations'
import { useRecoilState } from 'recoil'
import { useEffect, useState } from 'react'

export const StockList = () => {
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [user, setUser] = useRecoilState(userAtom)
    const [stocksInWatchlist, setStocksInWatchlist] = useState([])
    const [stocksNotInWatchlist, setStocksNotInWatchlist] = useState([])

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#e7ebf0',
        border: '2px solid',
        borderColor: 'primary.main',
        boxShadow: 24,
        p: 4,
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }))

    useEffect(() => {
        setStocksInWatchlist(user.stocksInWatchlist)
        setStocksNotInWatchlist(user.stocksNotInWatchlist)
    }, [user])

    return (
        <div>
            <Button variant='contained' color='primary' onClick={handleOpen}>
                Add to watchlist
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box sx={style} flexGrow={1}>
                    <List handleClose={handleClose} />
                </Box>
            </Modal>
        </div>
    )
}
const List = ({ width = '100%', handleClose }) => {
    const [user, setUser] = useRecoilState(userAtom)
    const [stocksInWatchlist, setStocksInWatchlist] = useState([])
    const [stocksNotInWatchlist, setStocksNotInWatchlist] = useState([])

    useEffect(() => {
        setStocksNotInWatchlist(user.stocksNotInWatchlist)
        setStocksInWatchlist(user.stocksInWatchlist)
    }, [user])

    function createData(name, price, change) {
        return { name, price, change }
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
    ]
    const getLatestData = () => {
        const url = HOST + 'users/stock/?username=' + user.username + '&stock_refresh=true';
        axios
            .get(url)
            .then((response) => {
                if (response.status === 200) {
                    setUser((prev) => {
                        return {
                            ...prev,
                            stocksInWatchlist:
                                response.data.data.stocks_in_watchlist,
                            stocksNotInWatchlist:
                                response.data.data.stocks_not_in_watchlist,
                        }
                    })
                }
            })
            .catch((error) => {
                alert('user does not exist')
            })
    }
    const addStock = (stock) => {
        const url = HOST + 'users/stock/'
        axios
            .post(url, {
                username: user.username,
                stock_name: stock,
            })
            .then((response) => {
                if (response.status === 200) {
                    const temp1 = stocksNotInWatchlist
                    const temp2 = stocksInWatchlist
                    const temp3 = temp1.filter(
                        (item) => item.stock_name !== stock.stock_name
                    )
                    setStocksNotInWatchlist(temp3)
                    const temp4 = temp2.concat(stock)
                    setStocksInWatchlist(temp4)
                    setUser((prev) => {
                        return {
                            ...prev,
                            stocksInWatchlist: temp4,
                            stocksNotInWatchlist:temp3,
                        }
                    })
                    alert('Stock added to watchlist!')
                    getLatestData();
                }
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    alert('user does not exist')
                } else if (error.response.status === 409) {
                    alert('stock already exists in watchlist')
                }
            })
    }
    return (
        <>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
                Add to watchlist
            </Typography>
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
                    <TableBody>
                        {stocksNotInWatchlist.map((row) => (
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
                                >
                                    {row.stock_symbol}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-label='add'
                                        onClick={() => {
                                            addStock(row.stock_name)
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
