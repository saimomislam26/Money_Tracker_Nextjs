'use client'

import { RootState } from '@/redux/store/store';
import { loadUserFromCookies } from '@/utils/auth';
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, TextField, Button, Fade, Backdrop, Typography } from '@mui/material';
import { getUserInfo, updateUser } from '@/lib/api';
import { AxiosError } from 'axios';
import { setUserInfo } from '@/redux/slices/userSlice';
import { getCategory } from '@/lib/categoryApiClient';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2, // space between input and button
};

interface ExpenseTableModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpenseTableModal: FC<ExpenseTableModalProps> = ({ open, setOpen }) => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(true)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const getAllCategory = async () => {
        try {
            const data = await getCategory()
            console.log({ data });

        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    router.push('/login');
                }
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    useEffect(() => {
        if (open) {
            getAllCategory
        }
    }, [open])


    return (
        <div>
            {/* <Button variant="contained" onClick={handleOpen}>
        Open Modal
      </Button> */}
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Enter Your Monthly Income
                        </Typography>

                        {/* Input field */}
                        <TextField
                            type="number"
                            label="Input Field"
                            variant="outlined"
                            fullWidth

                        />

                        {/* Submit button */}
                        <Button
                            variant="contained"
                            color="primary"
                        //   onClick={updateIncome}
                        //   disabled={!inputValue} 
                        >
                            Submit
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default ExpenseTableModal