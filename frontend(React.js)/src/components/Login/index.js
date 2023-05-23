import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from 'axios';
import { HOST } from '../../constants/constants';
import { userAtom } from "../../configurations";
import { useRecoilState } from "recoil";

export const Login = () => {

    const [justifyActive, setJustifyActive] = useState('1');
    const [user, setUser] = useRecoilState(userAtom);

    const handleJustifyClick = (value) => {
        if (value === justifyActive) {
            return;
        }
        setJustifyActive(value);
    };

    const handleLoginClick = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget)
        setUser(prev => {
            return {...prev, username: data.get('username'), loggedIn: true}
        })
        const url = HOST + 'users/login'
        axios
            .post(url, {
                username: data.get('username'),
                password: data.get('password'),
            })
            .then((response) => {
                if (response.status === 200) {
                    setUser((prev) => {
                        return {
                            ...prev,
                            username: data.get('username'),
                            loggedIn: true,
                        }
                    })
                }
            })
            .catch((error) => {
             if (error.response.status === 401) {
                    alert('Username and password do not match');
                }
            })
    }
    const LoginForm = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    rowGap: '30px',
                }}
                component={'form'}
                onSubmit={handleLoginClick}
            >
                <TextField
                    id='username'
                    name='username'
                    label='Username'
                    variant='outlined'
                    size='small'
                />
                <TextField
                    id='password'
                    name='password'
                    label='Password'
                    type='password'
                    variant='outlined'
                    size='small'
                />
                <Button
                    variant='contained'
                    type={'submit'}
                    sx={{ minWidth: '100px', padding: '0 20px', height: '3em' }}
                >
                    Submit
                </Button>
            </Box>
        )
    }

    const handleRegisterClick = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget)
        const url = HOST + 'users/register';
        axios
            .post(url, {
                username: data.get('username'),
                password: data.get('password'),
                confirm_password: data.get('cpassword'),
            })
            .then((response) => {
                if (response.status === 200) {
                    alert('User created successfully!')
                    setUser((prev) => {
                        return {
                            ...prev,
                            username: data.get('username'),
                            loggedIn: true,
                        }
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                if(error.response.data.username) {
                    alert('Length of username must be greater than 3 and less than 20');
                } else if(error.response.data.password) {
                    alert('Password length must be between 8 to 20 characters and contain one small alphabet, one capital alphabet, one digit and one special character');
                } else if (error.response.status === 401) {
                    alert('Password and confirm password do not match');
                }else if (error.response.status === 412) {
                    alert('Username already exists. Please pick a different username.');
                }

            })
    }

    const RegisterForm = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    rowGap: '30px',
                }}
                component={'form'}
                onSubmit={handleRegisterClick}
            >
                <TextField
                    id='username'
                    name='username'
                    label='Username'
                    variant='outlined'
                    size='small'
                />
                <TextField
                    id='password'
                    name='password'
                    label='Password'
                    type='password'
                    variant='outlined'
                    size='small'
                />
                <TextField
                    id='cpassword'
                    name='cpassword'
                    label='Confirm Password'
                    type='password'
                    variant='outlined'
                    size='small'
                />
                <Button
                    variant='contained'
                    type={'submit'}
                    sx={{ minWidth: '100px', padding: '0 20px', height: '3em' }}
                >
                    Submit
                </Button>
            </Box>
        )
    }

    return (
        <Box width="50%" margin="40px auto">
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                columnGap: '10px',
            }}>
                <Button variant="contained" onClick={() => handleJustifyClick('1')} sx={{
                    minWidth: "40%", padding: "10px 20px",
                    backgroundColor: (justifyActive !== '1') && "whitesmoke",
                    color: (justifyActive !== '1') && "#646566",
                    boxShadow: (justifyActive !== '1') && "none",
                }}>
                    Login
                </Button>
                <Button variant="contained" onClick={() => handleJustifyClick('2')} sx={{
                    minWidth: "40%", padding: "10px 20px",
                    backgroundColor: (justifyActive !== '2') && "whitesmoke",
                    color: (justifyActive !== '2') && "#646566",
                    boxShadow: (justifyActive !== '2') && "none",
                }}>
                    Register
                </Button>
            </Box>
            <Box sx={{ marginTop: "50px" }}>
                {justifyActive === '1' ? <LoginForm /> : <RegisterForm />}
            </Box>
        </Box >

    );
}

