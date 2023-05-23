import React, { useEffect, useState } from 'react'
import './App.css'
import { NavBar } from './components/NavBar'
import { StockList } from './components/StockList'
import { WatchList } from './components/WatchList'
import { Login } from './components/Login'
import { userAtom } from '../src/configurations'
import { useRecoilState } from 'recoil'

export const App = () => {
    const [user, setUser] = useRecoilState(userAtom);
    return (
        <div className='App'>
            {user.loggedIn ? (
                <>
                    <NavBar />
                    <div className='body-container'>
                        <WatchList />
                    </div>
                </>
            ) : (
                <Login />
            )}
        </div>
    )
}
