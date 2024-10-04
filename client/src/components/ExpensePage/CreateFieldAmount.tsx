'use client'
import { createExpense, getExpense } from '@/lib/spendingApiClient'
import { clearSavedCategory, setCategoriesWithAmount } from '@/redux/slices/categorySlice'
import { RootState } from '@/redux/store/store'
import { Box, Button, Grid2 as Grid, TextField } from '@mui/material'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Loading from '../Loading'

interface DateProps {
    date: {
        day: string;
        month: string;
        year: string;
    };
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sort:string
}

const CategoryFieldAmount: FC<DateProps> = ({ date,setOpen,sort }) => {
  
    const router = useRouter()
    const savedCategories = useSelector((state: RootState) => state.category.selectedCategory)
    const dispatch = useDispatch()


    const [loading, setLoading] = useState(false)

    const setAmountWithCategoryInfo = (categoryId: string, amount: number) => {
        dispatch(setCategoriesWithAmount({ categoryId, amount }))
    }


    const isAmountFieldEmpty = (savedCategories: Array<{ category: string, name: string, amount?: number }>) => {
        return savedCategories.some(category => !category.hasOwnProperty('amount') || category.amount === 0);
    }

    const handleCreateExpense = async () => {
        setLoading(true)
        if (isAmountFieldEmpty(savedCategories)) {
            setLoading(false)
            return toast.warning("Amount should not be blank or 0");
        }
        try {
            const data = await createExpense({ ...date, categories: savedCategories })
            dispatch(clearSavedCategory())
            setOpen(false)
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

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div>
            <Grid container className='items-center justify-center' spacing={{ sm: 1, xs: 1, md: 2 }} >
                {
                    savedCategories.length > 0 && savedCategories.map((category: { name: string, category: string }) => {
                        return (
                            <>
                                <Grid size={{ xs: 6, sm: 6, md: 6 }} >
                                    <Box className="font-mono font-semibold break-words rounded-lg" sx={{ width: "100%", backgroundColor: '#C4D7FF', padding: "3px", minHeight: "40px" }}>
                                        {category.name}
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                    <TextField
                                        type="number"
                                        label="Enter Amount"
                                        variant="outlined"
                                        fullWidth
                                        size='small'
                                        // value={inputValue}
                                        onChange={(e) => setAmountWithCategoryInfo(category.category, Number(e.target.value))}
                                    />
                                </Grid>


                            </>
                        )
                    })
                }
            </Grid>

            <Box sx={{ display: "flex", justifyContent: 'center', marginTop: "15px" }}>

                {savedCategories.length > 0 && <Button variant="contained" onClick={handleCreateExpense}>Save</Button>}
            </Box>


        </div>
    )
}

export default CategoryFieldAmount