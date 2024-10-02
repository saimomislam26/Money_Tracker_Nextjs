'use client'
import { filterSelectedCategory, setAllCategories, setAllCategoriesAfterDelete, setInitialCategoriesFetch, setSelectedCategory } from '@/redux/slices/categorySlice';
import { RootState } from '@/redux/store/store';
import { Box, Button, Chip, Fade, Modal, Stack, TextField, Typography, Backdrop } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { createCategory, deleteCategory } from '@/lib/categoryApiClient';


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

interface Category {
    _id: string;
    name: string;
}

interface CategoryChipProps {
    categories: Category[]; // Array of Category objects
}

const CategoryChip: FC<CategoryChipProps> = ({ categories }) => {

    const router = useRouter()

    const [inputValue, setInputValue] = useState<string>("");
    const [tempDeleteCategoryId, setTempDeleteCategoryId] = useState<string>("")

    // For Add Category Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // For Delete Category Modal
    const [deleteOpen, setDeleteOpen] = useState(false);
    const handleDeleteOpen = () => setDeleteOpen(true);
    const handleDeleteClose = () => setDeleteOpen(false);

    const savedCategories = useSelector((state: RootState) => state.category.selectedCategory)
    const allCategories = useSelector((state: RootState) => state.category.allCategories)

    const dispatch = useDispatch();

    // dispatch(setAllCategoriesAfterDelete(categories))

    const handleClick = (selectedCategory: { category: string, name: string }) => {
        let isExist = checkCategoryExist(selectedCategory.category)
        if (isExist) {
            dispatch(filterSelectedCategory({ categoryId: selectedCategory.category }))
        } else {
            dispatch(setSelectedCategory(selectedCategory))
        }
    }

    const checkCategoryExist = (categoryId: string): boolean => {

        return savedCategories.some(category => category.category === categoryId)
    }

    const createNewCategory = async () => {
        try {
            const data = await createCategory({ name: inputValue })
            dispatch(setAllCategories(data.saveCategory))
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
        setInputValue("")
    }

    const handleDelete = async (categoryId: string) => {
        try {
            const data = await deleteCategory(categoryId)
            dispatch(setAllCategoriesAfterDelete({ afterDeletedAllCategory: data.afterDeletedAllCategory, categoryId }))
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
        handleDeleteClose()
        setTempDeleteCategoryId("")
    }

    useEffect(() => {
        if (JSON.stringify(allCategories) !== JSON.stringify(categories)) {
            router.refresh()
            // Initially set all categories to redux
            // Then after delete and add operation handle categories from redux value
            dispatch(setInitialCategoriesFetch(categories))
        }
    }, [categories])


    return (
        <div>
            <Stack direction="row" flexWrap="wrap" spacing={1} gap={1}>
                {allCategories.length > 0 && allCategories.map((val: { _id: string, name: string }) => {
                    return (
                        <Chip
                            key={val._id}
                            label={val?.name}
                            onClick={() => handleClick({ category: val?._id, name: val?.name })}
                            color={checkCategoryExist(val._id) ? "primary" : "default"}
                            variant="outlined"
                            onDelete={() => {
                                setTempDeleteCategoryId(val?._id)
                                handleDeleteOpen()
                            }}
                            // deleteIcon={<DeleteIcon />}
                            sx={{ maxWidth: "150px" }}
                        />
                    )
                })}
                <AddIcon titleAccess='Add Category' sx={{ cursor: "pointer" }} onClick={handleOpen} />
            </Stack>

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
                            Create New Category
                        </Typography>

                        {/* Input field */}
                        <TextField
                            type="text"
                            label="Enter Category Name"
                            variant="outlined"
                            fullWidth
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />

                        {/* Submit button */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={createNewCategory}
                            disabled={!inputValue}
                        >
                            Create
                        </Button>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={deleteOpen}
                onClose={handleDeleteClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={deleteOpen}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Are you Sure Want to Delete This Category
                        </Typography>


                        {/* Submit button */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { handleDelete(tempDeleteCategoryId) }}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDeleteClose}
                        >
                            No
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default CategoryChip