'use client'
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Typography, List, ListItem, ListItemText, LinearProgress, Input, TextField } from '@mui/material';
import { RootState } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '@/app/loading';
import { updateUser } from '@/lib/api';
import { setUserInfo } from '@/redux/slices/userSlice';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

type UserDataState = {
    income?: number | null,
    firstName?: string,
    lastName?: string,
    email?: string
}

type Password = {
    currentPassword: string,
    // new password
    password: string
}

const Profile = () => {
    const userInfo = useSelector((state: RootState) => state.user)
    // console.log("From Profile", userInfo);

    const [userData, setUserData] = useState<UserDataState | null>(null)
    // {firstName:"",lastName:"",email:"",income:0}
    const [password, setPassword] = useState<Password>({ currentPassword: "", password: "" })
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()

    const dispatch = useDispatch()


    let name
    let value
    const handleUserDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        name = e.target.name
        value = e.target.value
        setUserData({ ...userData, [name]: value })
    }

    const updateUserData = async () => {
        setLoading(true)
        try {
            const data = await updateUser(userData!)

            dispatch(setUserInfo(data.updateUser))

        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    router.push('/login');
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        } finally {
            setLoading(false)
        }
    }

    const updatePassword = async () => {
        if (validateFields()) {
            setLoading(true)
            try {
                const data = await updateUser(password)
                setPassword({ currentPassword: "", password: "" })
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        router.push('/login');
                    }
                } else {
                    console.error('An unexpected error occurred:', error);
                }
            } finally {
                setLoading(false)
            }
        }
    }

    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: ''
    });

    // Function to validate fields
    const validateFields = () => {
        let valid = true;
        const newErrors = { currentPassword: '', newPassword: '' };

        // Check for empty fields and set error messages
        if (!password.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
            valid = false;
        }

        if (!password.password) {
            newErrors.newPassword = 'New password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };


    useEffect(() => {
        if (userInfo.status === 'succeeded') {
            setUserData(userInfo)
        }
    }, [userInfo])

    if (loading || userInfo.status === 'loading') {
        return (
            <Loading />
        )
    }
    return (
        <Box sx={{ backgroundColor: '#f7f7ff', mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ boxShadow: '0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    src="https://bootdey.com/img/Content/avatar/avatar6.png"
                                    alt="Admin"
                                    sx={{ width: 110, height: 110, p: 1, bgcolor: 'primary.main', borderRadius: '50%' }}
                                />
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    {userData && `${userData?.firstName} ${userData?.lastName}`}
                                </Typography>

                            </Box>
                            <Divider sx={{ my: 2 }} />
                            {/* <List>
                <ListItem>
                  <ListItemText primary="Website" secondary="https://bootdey.com" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Github" secondary="bootdey" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Twitter" secondary="@bootdey" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Instagram" secondary="bootdey" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Facebook" secondary="bootdey" />
                </ListItem>
              </List> */}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card sx={{ boxShadow: '0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%)' }}>
                        <CardContent>
                            {/* First Name */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="subtitle1">First Name</Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        className="form-control"
                                        name='firstName'
                                        value={userData?.firstName}
                                        onChange={handleUserDataChange}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />
                            {/* Last Name */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="subtitle1">Last Name</Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        className="form-control"
                                        name='lastName'
                                        value={userData?.lastName}
                                        onChange={handleUserDataChange}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="subtitle1">Email</Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        type="text"
                                        fullWidth
                                        className="form-control"
                                        name='email'
                                        value={userData?.email}
                                        onChange={handleUserDataChange}
                                    />
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="subtitle1">Income</Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        className="form-control"
                                        name='income'
                                        value={userData?.income}
                                        onChange={handleUserDataChange}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ textAlign: 'right', mt: 3 }}>
                                <Button variant="contained" onClick={updateUserData}>Save Changes</Button>
                            </Box>
                        </CardContent>
                    </Card>
{/* Password Card */}
                    <Card sx={{ mt: 3, boxShadow: '0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%)' }}>
                        <CardContent>
                            {/* Current Password */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="subtitle1">Current Password</Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        className="form-control"
                                        name='currentPassword'
                                        value={password.currentPassword}
                                        onChange={(e) => { setPassword({ ...password, currentPassword: e.target.value }) }}
                                        error={!!errors.currentPassword} 
                                        helperText={errors.currentPassword}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />
                            {/* Last Name */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="subtitle1">New Password</Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        className="form-control"
                                        name='newPassword'
                                        value={password.password}
                                        onChange={(e) => { setPassword({ ...password, password: e.target.value }) }}
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ textAlign: 'right', mt: 3 }}>
                                <Button variant="contained" onClick={updatePassword}>Update Password</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
