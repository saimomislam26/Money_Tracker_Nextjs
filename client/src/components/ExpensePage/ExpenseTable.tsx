'use client'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Typography, Card, CardContent, Button, Box, Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getExpense } from '@/lib/spendingApiClient';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Loading from '../Loading';
import ExpenseTableModal from './ExpenseTableModal';



interface Category {
    _id: string,
    category: string,
    amount: number
}

interface Expense {
    day: number;
    name: string;
    categories: Category[],
    totalSpending: number,
    totalCategory: number
}

interface ExpenseProps {
    expenses: Expense[];
}
const ExpenseTable: FC<ExpenseProps> = ({ expenses }) => {

    const date = new Date();

    // Get the current month (0-11, so we add 1 to make it 1-12)
    const currentMonth = date.getMonth() + 1;

    // Get the current year
    const currentYear = date.getFullYear();

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [filteredDate, setFilteredDate] = useState<{ month: number | null, year: number | null }>({ month: date.getMonth() + 1, year: date.getFullYear() })
    const [sortOrder, setSortOrder] = useState<string>("serial")
    const [open, setOpen] = useState(false);
    const [selectedToEditDay, setSelectedToEditDay] = useState<number | null>(null)

    const [spendingData, setSpendingData] = useState(expenses);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Handle editing the amount for each category
    const handleAmountChange = (dayIndex: number, categoryIndex: number, newAmount: number) => {
        const updatedData = [...spendingData];
        updatedData[dayIndex].categories[categoryIndex].amount = newAmount;
        updatedData[dayIndex].totalSpending = updatedData[dayIndex].categories.reduce((sum, cat) => sum + cat.amount, 0);
        setSpendingData(updatedData);
    };

    const handleDate = (date: Dayjs | null) => {
        if (date) {
            // setFilteredDate({ month: value.month() + 1, year: value.year() })
            // handleGetExpense(value.year(), value.month() + 1, sortOrder)
            const newMonth = date.month() + 1;  // Month is 0-indexed
            const newYear = date.year();

            // Update only if the month or year changes
            if (newMonth !== filteredDate.month || newYear !== filteredDate.year) {
                setFilteredDate({ month: newMonth, year: newYear })
            }
        }
    }

    const handleGetExpense = async (year: number, month: number, sort: string) => {
        setLoading(true)
        try {
            const data = await getExpense(year, month, sort)
            setSpendingData(data)

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
        finally {
            setLoading(false)
        }
    }

    // Get the Dayjs object for the selected month and year
    const getSelectedDate = () => {
        if (filteredDate.month && filteredDate.year) {
            // Create a Dayjs object using the selected year and month
            return dayjs().year(filteredDate.year).month(filteredDate.month - 1); // Adjust month (0-indexed)
        }
        return null;
    };

    useEffect(() => {
        if (!open) {
            handleGetExpense(filteredDate.year!, filteredDate.month!, sortOrder)
        }
    }, [open])

    if (loading) {
        return (
            <Loading />
        )
    }


    return (
        <Box sx={{ width: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>

            {/* Filter Option */}
            <Box sx={{ width: "90%", marginTop: "30px", display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']} sx={{ width: 200 }}>
                        <DatePicker
                            label={''} views={['month', 'year']}
                            value={getSelectedDate()}
                            onChange={(e) => { handleDate(e) }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => { handleGetExpense(filteredDate.year! || currentYear, filteredDate.month! || currentMonth, sortOrder) }}
                    sx={{ width: 200 }}
                >
                    Get Expense
                </Button>
                <FormControl sx={{ width: 200 }} >
                    <InputLabel id="demo-select-small-label">Sort</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={sortOrder}
                        label="Sort"
                        onChange={(e: SelectChangeEvent<string>) => {
                            setSortOrder(e.target.value)
                            handleGetExpense(filteredDate.year! || currentYear, filteredDate.month! || currentMonth, e.target.value)
                        }}
                    >
                        <MenuItem value={'serial'}>Serial</MenuItem>
                        <MenuItem value={'asc'}>Low - High</MenuItem>
                        <MenuItem value={'desc'}>High- Low</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Expense Table */}
            <Box sx={{ width: "90%", marginTop: "50px" }}>
                <h6 className='text-center font-mono font-bold font-black-800'>Summary of the Month</h6>
                {isMobile ? (
                    // Mobile view - Display as cards
                    <Grid container spacing={2}>
                        {spendingData.map((dayData, dayIndex) => (
                            <Grid item xs={12} key={dayData.day}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" component="div">Day: {dayData.day}</Typography>
                                        <Typography>Categories: {dayData.totalCategory}</Typography>
                                        <Typography>Total Spending: ${dayData.totalSpending}</Typography>
                                        <Typography component="div">
                                            <Box>
                                                {dayData.categories.map((category, categoryIndex) => (
                                                    <Box key={category.category} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                        <Typography sx={{ mr: 1 }}>{category.category}:</Typography>
                                                        <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            value={category.amount}
                                                            onChange={(e) => handleAmountChange(dayIndex, categoryIndex, parseFloat(e.target.value))}
                                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                            sx={{ width: '100px' }}
                                                        />
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                        <Button variant="contained" color="primary">Details</Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    // Desktop view - Display as table
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="spending table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Day</TableCell>
                                    <TableCell>Categories</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Total Spending</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    spendingData.map((dayData, dayIndex) => {

                                        return dayData.categories.length > 0 ?
                                            (
                                                <>
                                                    {
                                                        dayData.categories.map((category, categoryIndex) => {


                                                            return (

                                                                <TableRow key={`${dayData.day}-${category.category}`}>
                                                                    {categoryIndex === 0 && (
                                                                        <TableCell rowSpan={dayData.categories.length}>
                                                                            <Typography>{dayData.day}</Typography>
                                                                        </TableCell>
                                                                    )}
                                                                    <TableCell>{category.category}</TableCell>
                                                                    <TableCell>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            value={category.amount}
                                                                            onChange={(e) => handleAmountChange(dayIndex, categoryIndex, parseFloat(e.target.value))}
                                                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                                        />
                                                                    </TableCell>
                                                                    {categoryIndex === 0 && (
                                                                        <TableCell rowSpan={dayData.categories.length}>
                                                                            <Typography>{dayData.totalSpending}</Typography>
                                                                        </TableCell>
                                                                    )}
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </>
                                            ) :
                                            (
                                                <>
                                                    <TableRow key={`${dayData.day}`}>

                                                        <TableCell >
                                                            <Typography>{dayData.day}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                                No category Inputted
                                                                <Button
                                                                    size='small'
                                                                    variant='contained'
                                                                    sx={{ maxWidth: 138 }}
                                                                    onClick={() => {
                                                                        setOpen(true)
                                                                        setSelectedToEditDay(dayData.day)
                                                                    }}
                                                                >Edit
                                                                </Button>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            {/* <TextField
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={category.amount}
                                                                    onChange={(e) => handleAmountChange(dayIndex, categoryIndex, parseFloat(e.target.value))}
                                                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                                /> */}
                                                            No category Inputted
                                                        </TableCell>
                                                        <TableCell >
                                                            <Typography>{dayData.totalSpending}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            <ExpenseTableModal open={open} setOpen={setOpen} filteredDate={filteredDate} selectedToEditDay={selectedToEditDay} sort={sortOrder} />
        </Box>
    )
}

export default ExpenseTable