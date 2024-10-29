'use client'

import { RootState } from '@/redux/store/store';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, TextField, Button, Fade, Backdrop, Typography } from '@mui/material';
import { getUserInfo, updateUser } from '@/lib/api';
import { AxiosError } from 'axios';
import { setUserInfo } from '@/redux/slices/userSlice';

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

const HomeModal = () => {
  const router = useRouter()

  const income = useSelector((state: RootState) => state.user.income)
  // console.log({income});


  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState<Number|string>();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);


  const updateIncome = async () => {
    try {
      const data = await updateUser({ income: inputValue })
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
    handleClose()
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUserInfo();
        dispatch(setUserInfo(res))
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            router.push('/login');
          }
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [])

  useEffect(() => {
    // console.log({income});
    if (!isLoading && (income === undefined || income === null)) {
    setOpen(true);
    } 
  }, [isLoading, income])

  return (
    <div>
      {/* <Button variant="contained" onClick={handleOpen}>
        Open Modal
      </Button> */}
      <Modal
        open={open}
        // onClose={handleClose}
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
              label="Monthly Income"
              variant="outlined"
              fullWidth
              value={inputValue}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/[^0-9]/g, '');
                // setCurrentMonthIncome(inputValue ? Number(inputValue) : '');
                setInputValue(inputValue ? Number(inputValue) : '')
              }}
            />

            {/* Submit button */}
            <Button
              variant="contained"
              color="primary"
              onClick={updateIncome}
              disabled={!inputValue}
            >
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default HomeModal