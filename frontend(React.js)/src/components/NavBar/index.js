import React from 'react'
import styles from './NavBar.module.css'
import { HOST } from '../../constants/constants';
import axios from 'axios';
import { userAtom } from '../../configurations';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react'

export const NavBar = () => {
    const [user, setUser] = useRecoilState(userAtom);

    const onLogout = () => {
        setUser((prev) => {
            return {
                ...prev,
                username: '',
                loggedIn: false,
                stocksInWatchlist: [],
                stocksNotInWatchlist: [],
            }
        })
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
            <span className={styles.username}>Hello, {user.username}!</span>
            </div>
            <div>
                <span className={styles.title}>Stock Dashboard</span>
            </div>
            <div className={styles.navbarRight}>
                <button className={styles.logoutButton} onClick={onLogout}>
                    Logout
                </button>
            </div>
        </nav>
    )
}

