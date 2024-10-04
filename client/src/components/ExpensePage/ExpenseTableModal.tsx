'use client'

import { RootState } from '@/redux/store/store';
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, TextField, Button, Fade, Backdrop, Typography, Grid2 as Grid } from '@mui/material';
import { AxiosError } from 'axios';
import { getCategory } from '@/lib/categoryApiClient';
import CategoryChip from '../HomePage/CategoryChip';
import { clearSavedCategory } from '@/redux/slices/categorySlice';
import CategoryFieldAmount from './CreateFieldAmount';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2, // space between input and button
    overflowY: 'auto'
};


interface ExpenseTableModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    filteredDate: {month:number | null, year:number | null};
    selectedToEditDay: number | null;
    sort: string
}

const ExpenseTableModal: FC<ExpenseTableModalProps> = ({ open, setOpen, filteredDate,selectedToEditDay,sort }) => {
    const dispatch = useDispatch()

    const router = useRouter()

    const [allCategories, setAllCategories] = useState([])
    const handleClose = () => setOpen(false);


    const getAllCategory = async () => {
        try {
            const data = await getCategory()
            setAllCategories(data)
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
        if (open === true) {
            console.log(open)
            getAllCategory()
        }
    }, [open])


    return (
        <div>
            {/* <Button variant="contained" onClick={handleOpen}>
        Open Modal
      </Button> */}
            <Modal
                open={open}
                onClose={() => {
                    handleClose()
                    dispatch(clearSavedCategory())
                }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    {allCategories &&
                        <Box sx={style}>
                            <Box sx={{ border: "2px soliod red" }}>
                                <Grid container spacing={{ sm: 2, xs: 1, md: 6 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                                        <p className="text-center mb-5 font-bold font-mono text-lg">Category List</p>
                                        {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width:"100%" }}> */}
                                        <CategoryChip categories={allCategories} />
                                        {/* </Box> */}
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <p className="text-center mb-5 font-bold font-mono text-lg">Provide Spent Amount on Selected categories</p>
                                        <CategoryFieldAmount date={{day:String(selectedToEditDay),month:String(filteredDate.month), year:String(filteredDate.year)}} setOpen={setOpen} sort={sort}/>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    }
                </Fade>
            </Modal>
        </div>
    )
}

export default ExpenseTableModal