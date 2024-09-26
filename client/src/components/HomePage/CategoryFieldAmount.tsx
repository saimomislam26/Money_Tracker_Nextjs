'use client'
import { setCategoriesWithAmount } from '@/redux/slices/categorySlice'
import { RootState } from '@/redux/store/store'
import { Box, Button, Grid2 as Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const CategoryFieldAmount = () => {
    const savedCategories = useSelector((state: RootState) => state.category.selectedCategory)
    const dispatch = useDispatch()

    const setAmountWithCategoryInfo = (categoryId: string, amount: number) => {
        dispatch(setCategoriesWithAmount({ categoryId, amount }))
    }


    const isAmountFieldEmpty =(savedCategories:Array<{ category: string, name: string, amount?: number }>)=>{
        return savedCategories.some(category => !category.hasOwnProperty('amount') || category.amount === 0);
    }

    console.log({ savedCategories });


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

                {savedCategories.length > 0 && <Button variant="contained" >Save</Button>}
            </Box>


        </div>
    )
}

export default CategoryFieldAmount