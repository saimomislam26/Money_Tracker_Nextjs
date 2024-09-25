'use client'

import { RootState } from '@/redux/store/store';
import { loadUserFromCookies } from '@/utils/auth';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { updateUser } from '@/lib/api';
import { AxiosError } from 'axios';

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
};

const HomeModal = () => {
const router = useRouter()

  const income = useSelector((state: RootState) => state.user.income)
  const firstName = useSelector((state: RootState) => state.user.firstName)


  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const updateIncome = async () => {
    try {
      const data = await updateUser({income:50000})
      console.log(data);
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
    console.log({income});
    
    if(open === false && (income === undefined || income === null)){
      setOpen(true)
    }
    loadUserFromCookies(dispatch)
  }, [income])

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Input Your Monthly Income
          </Typography>
          <div className="w-full max-w-sm min-w-[200px]">
            <input type='number' className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Type here..."/>
          </div>
          <Button onClick={updateIncome}>Submit</Button>
        </Box>
      </Modal>
    </div>
  )
}

export default HomeModal