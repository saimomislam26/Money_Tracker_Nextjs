'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Typography, List, ListItem, ListItemText, LinearProgress, Input, TextField } from '@mui/material';
import { RootState } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '@/app/loading';
import { setMonthlyIncome, updateUser, updateUserProfileImage } from '@/lib/api';
import { setProfileImage, setUserInfo } from '@/redux/slices/userSlice';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import PasswordIcon from '@mui/icons-material/Password';
import LockIcon from '@mui/icons-material/Lock';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InfoIcon from '@mui/icons-material/Info';
import { toast } from 'react-toastify';


type UserDataState = {
    income?: number | null,
    firstName?: string,
    lastName?: string,
    email?: string,
    currentMonthIncome?: number | null
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
    const [currentMonthIncome, setCurrentMonthIncome] = useState<Number | string>(0)
    const [isShowInfo, setIsShowInfo] = useState<boolean>(false)
    const [hover, setHover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMouseEnter = () => setHover(true);
    const handleMouseLeave = () => setHover(false);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Open the file upload dialog
        }
    };

    const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData()
            formData.append("myFile", file)
            // Handle the uploaded file (e.g., upload to the server)
            setLoading(true)
            try {
                const data = await updateUserProfileImage(formData)
                dispatch(setProfileImage(data.profileImageUrl))
                // toast.success(data.message)

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
                setHover(false)
            }
        }
    };

    const router = useRouter()

    const dispatch = useDispatch()

    const now = new Date();
    let month: string | number = String(now.getMonth() + 1).padStart(2, '0');
    month = Number(month)
    const year = Number(now.getFullYear());
    const currentDate = `${year}-${month}`;


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

    const setIncomeSpecificMonth = async () => {
        setLoading(true)
        try {
            const data = await setMonthlyIncome({ year, month, income: Number(currentMonthIncome) })
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
            userInfo.currentMonthIncome === null ? setCurrentMonthIncome(0) : setCurrentMonthIncome(userInfo.currentMonthIncome)
        }
    }, [userInfo])

    if (loading || userInfo.status === 'loading') {
        return (
            <Loading />
        )
    }
    return (
        <Box sx={{ mt: 3, height: "100%" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ boxShadow: '0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box
                                    sx={{ position: 'relative', width: 110, height: 110 }}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={handleAvatarClick}
                                >
                                    <Avatar
                                        src={userInfo?.profileImageUrl?userInfo?.profileImageUrl:"https://bootdey.com/img/Content/avatar/avatar6.png"}
                                        alt="Admin"
                                        sx={{
                                            width: 110,
                                            height: 110,
                                            // p: 1,
                                            bgcolor: 'primary.main',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            position: 'relative',
                                        }}
                                    />
                                    {hover && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                color: 'white',
                                                borderRadius: '50%',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            Upload Picture
                                        </Box>
                                    )}
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{ mt: 2, wordWrap: 'break-word', width: '100%', textAlign: 'center' }}
                                    className="font-mono"
                                >
                                    {userData && `${userData?.firstName} ${userData?.lastName}`}
                                </Typography>

                                {/* Hidden file input for uploading an image */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                            </Box>
                            <Divider sx={{ my: 2 }} />

                            <List>
                                <ListItem>
                                    <ListItemText sx={{ wordWrap: 'break-word', width: "100%" }} primary="First Name" secondary={userData?.firstName} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText sx={{ wordWrap: 'break-word', width: "100%" }} primary="Last Name" secondary={userData?.lastName} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText sx={{ wordWrap: 'break-word', width: "100%" }} primary="Email" secondary={userData?.email} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText sx={{ wordWrap: 'break-word', width: "100%" }} primary="General Income" secondary={userData?.income} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText sx={{ wordWrap: 'break-word', width: "100%" }} primary="Current Month Income" secondary={String(currentMonthIncome)} />
                                    {/* userData?.currentMonthIncome !== null ? userData?.currentMonthIncome : userData?.income */}
                                </ListItem>
                            </List>
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

                    {/* Update monthly base income */}
                    <Card sx={{ mt: 3, boxShadow: '0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%)' }}>
                        <CardContent>
                            <Typography sx={{ marginBottom: "10px" }}> Date: {currentDate}</Typography>
                            <Box sx={{ width: "100%", marginBottom: "10px", display: "flex", alignItems: "center" }}>
                                <InfoIcon
                                    sx={{ color: "red", cursor: "pointer" }}
                                    titleAccess='Show Info'
                                    onClick={() => { setIsShowInfo(!isShowInfo) }}
                                />
                                <Typography sx={{ marginLeft: "10px", color: "red", display: isShowInfo ? 'block' : 'none' }} > If your this month income is different from your general income you can set your this month income specifically. All the calculation for this month will be based on given amount</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="subtitle1">Month Specific Income</Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        className="form-control"
                                        name='currentPassword'
                                        defaultValue={userData?.currentMonthIncome || 0}
                                        value={currentMonthIncome}
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                            setCurrentMonthIncome(inputValue ? Number(inputValue) : '');
                                        }}
                                    // error={!!currentMonthIncome}
                                    // helperText={currentMonthIncome==='' && "Income is required"}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ textAlign: 'right', mt: 3 }}>
                                <Button variant="contained" onClick={setIncomeSpecificMonth} disabled={currentMonthIncome === '' || currentMonthIncome === 0}>Set Income</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
