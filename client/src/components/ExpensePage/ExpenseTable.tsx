'use client'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Typography, Card, CardContent, Button, Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    IconButton,
    Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getExpense, getSummaryOfSpendingSpecificMonth, updateExpense } from '@/lib/spendingApiClient';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Loading from '../Loading';
import ExpenseTableModal from './ExpenseTableModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { IconButtonProps } from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));


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

interface SummaryCategory {
    category: string,
    totalAmount: number
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
    const [isEdit, setIsEdit] = useState<Boolean>(false)
    const [tempDataStore, setTempDataStore] = useState<Array<Expense>>([])

    const [spendingData, setSpendingData] = useState(expenses);
    const income = useSelector((state: RootState) => state.user.income)

    console.log({ income });


    const [summaryCategories, setSummaryCategories] = useState<Array<SummaryCategory>>([])
    const [totalAmountExpenseSummary, setTotalAmountExpenseSummary] = useState<number>(0)

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Handle editing the amount for each category
    const handleAmountChange = (dayIndex: number, categoryIndex: number, newAmount: number) => {
        const updatedData = [...spendingData];
        updatedData[dayIndex].categories[categoryIndex].amount = newAmount;
        updatedData[dayIndex].totalSpending = updatedData[dayIndex].categories.reduce((sum, cat) => sum + cat.amount, 0);
        setSpendingData(updatedData);
    };

    const handleUpdateExpense = async (dayIndex: number) => {
        try {
            const data = await updateExpense(filteredDate.year!, filteredDate.month!, selectedToEditDay!, spendingData[dayIndex].categories!)
            // console.log({ data });
            setIsEdit(false)
            setTempDataStore([])

        } catch (error) {
            setIsEdit(false)
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
            getSummaryMonthly(filteredDate.year!, filteredDate.month!)

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

    const getSummaryMonthly = async (year: number, month: number) => {
        setLoading(true)
        try {
            const data = await getSummaryOfSpendingSpecificMonth(year, month)
            // console.log("Spending Data", data);
            setSummaryCategories(data?.summary.categories)
            setTotalAmountExpenseSummary(data?.summary?.totalMonthlyAmount)
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
        getSummaryMonthly(filteredDate.year!, filteredDate.month!)
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (

        <Box sx={{ width: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >

            <Grid container spacing={2} sx={{ width: "90%", marginTop: "30px" }}>
                {/* Filter Option */}
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Box sx={{ width: "90%", display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: { sm: 'center', xs: 'center', md: 'flex-start' } }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']} sx={{ width: 200 }}>
                                <DatePicker
                                    label={''}
                                    views={['month', 'year']}
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
                            sx={{
                                width: 200,
                                height: '56px',  // Set Button height to match DatePicker height
                                padding: 0,      // Adjust padding to better match DatePicker styling
                                fontSize: '0.875rem'  // Optional: Adjust font size to match DatePicker text size
                            }}
                        >
                            Get Expense
                        </Button>
                        <FormControl sx={{ width: 200 }}>
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
                                <MenuItem value={'desc'}>High - Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                {/* Summary Box */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: "flex-end" }}>
                    <Card sx={{ maxWidth: 600, width: 600 }}>
                        <CardHeader
                            title="Summary of Expense"
                            subheader={`${filteredDate.year} / ${filteredDate.month}`}
                        />
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Income:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {income}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Expense:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {totalAmountExpenseSummary}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                    Savings:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {income! - totalAmountExpenseSummary}
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardActions disableSpacing>
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="Show Detail"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography sx={{ marginBottom: 2 }}>Detail</Typography>
                                {summaryCategories &&
                                    summaryCategories.map((category, index) => (
                                        <Box key={index} display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {category.category}:
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {category.totalAmount}
                                            </Typography>
                                        </Box>
                                    ))}
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>

            {/* Expense Table */}
            <Box sx={{ width: "90%", marginTop: "50px" }}>
                <h6 className='text-center font-mono font-bold font-black-800 mb-3'>Expense of the Month</h6>
                {isMobile ? (
                    // Mobile view - Display as cards
                    <Grid container spacing={2}>
                        {spendingData.map((dayData, dayIndex) => (
                            <Grid item xs={12} key={dayData.day}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="h6" component="div">Day: {dayData.day}</Typography>
                                            <Box>
                                                {
                                                    (isEdit && selectedToEditDay === dayData.day) ? (
                                                        <>
                                                            <IconButton>
                                                                <UpdateIcon titleAccess='Update' sx={{}} onClick={() => { handleUpdateExpense(dayIndex) }} />
                                                            </IconButton>
                                                            <IconButton>
                                                                <CancelIcon titleAccess='Cancel' onClick={() => {
                                                                    setIsEdit(false)
                                                                    setSpendingData([...tempDataStore])
                                                                    setTempDataStore([])
                                                                }} />
                                                            </IconButton>
                                                        </>

                                                    ) :
                                                        (
                                                            <>
                                                                <IconButton
                                                                    disabled={(isEdit && selectedToEditDay !== dayData.day)}
                                                                    onClick={() => {
                                                                        setOpen(true)
                                                                        setSelectedToEditDay(dayData.day)
                                                                    }}
                                                                >
                                                                    <AddIcon titleAccess='Add New Category' />
                                                                </IconButton>
                                                                <IconButton
                                                                    disabled={(isEdit && selectedToEditDay !== dayData.day)}
                                                                    onClick={() => {
                                                                        setIsEdit(true)
                                                                        setSelectedToEditDay(dayData.day)
                                                                        setTempDataStore(structuredClone(spendingData))
                                                                    }}
                                                                >
                                                                    <EditIcon titleAccess='Edit Existing'
                                                                    />
                                                                </IconButton>
                                                                <IconButton>
                                                                    <DeleteIcon titleAccess='Delete' />
                                                                </IconButton>

                                                            </>
                                                        )


                                                }
                                            </Box>

                                        </Box>
                                        <Typography>Categories: {dayData.totalCategory}</Typography>
                                        <Typography>Total Spending: ${dayData.totalSpending}</Typography>
                                        <Typography component="div">
                                            <Box>
                                                {dayData.categories.map((category, categoryIndex) => (
                                                    <Box key={category.category} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                        <Typography sx={{ mr: 1 }}>{category.category}:</Typography>
                                                        {
                                                            (isEdit && selectedToEditDay === dayData.day) ? <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                value={category.amount}
                                                                onChange={
                                                                    (e) => handleAmountChange(dayIndex, categoryIndex, parseFloat(e.target.value))
                                                                }
                                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                            /> :
                                                                <Typography>{category.amount}</Typography>
                                                        }
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Typography>
                                    </CardContent>

                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    // Desktop view - Display as table
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="spending table">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#2176D2" }}>
                                    <TableCell>Day</TableCell>
                                    <TableCell>Categories</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Total Category</TableCell>
                                    <TableCell>Total Spending</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    spendingData && spendingData.map((dayData, dayIndex) => {

                                        // Days which have data

                                        return dayData.categories.length > 0 ?
                                            (
                                                <React.Fragment key={dayIndex}>
                                                    {
                                                        dayData.categories && dayData.categories.map((category, categoryIndex) => {
                                                            return (
                                                                <TableRow
                                                                    key={`${dayData.day}-${category.category}`}
                                                                    sx={{
                                                                        backgroundColor: dayIndex % 2 === 0 ? 'grey.100' : 'white',
                                                                    }}
                                                                >
                                                                    {categoryIndex === 0 && (
                                                                        <TableCell rowSpan={dayData.categories.length}>
                                                                            <Typography>{dayData.day}</Typography>
                                                                        </TableCell>
                                                                    )}
                                                                    <TableCell>{category.category}</TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            (isEdit && selectedToEditDay === dayData.day) ? <TextField
                                                                                variant="outlined"
                                                                                size="small"
                                                                                value={category.amount}
                                                                                onChange={
                                                                                    (e) => handleAmountChange(dayIndex, categoryIndex, parseFloat(e.target.value))
                                                                                }
                                                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                                            /> :
                                                                                <Typography>{category.amount}</Typography>
                                                                        }
                                                                    </TableCell>
                                                                    {categoryIndex === 0 && (
                                                                        <TableCell rowSpan={dayData.categories.length}>
                                                                            <Typography>{dayData.totalCategory}</Typography>
                                                                        </TableCell>
                                                                    )}
                                                                    {categoryIndex === 0 && (
                                                                        <TableCell rowSpan={dayData.categories.length}>
                                                                            <Typography>{dayData.totalSpending}</Typography>
                                                                        </TableCell>
                                                                    )}
                                                                    {
                                                                        categoryIndex === 0 && (
                                                                            <TableCell rowSpan={dayData.categories.length}>
                                                                                {
                                                                                    (isEdit && selectedToEditDay === dayData.day) ? (
                                                                                        <>
                                                                                            <IconButton>
                                                                                                <UpdateIcon titleAccess='Update' onClick={() => { handleUpdateExpense(dayIndex) }} />
                                                                                            </IconButton>
                                                                                            <IconButton>
                                                                                                <CancelIcon titleAccess='Cancel' onClick={() => {
                                                                                                    setIsEdit(false)
                                                                                                    setSpendingData([...tempDataStore])
                                                                                                    setTempDataStore([])
                                                                                                }} />
                                                                                            </IconButton>
                                                                                        </>

                                                                                    ) :
                                                                                        (
                                                                                            <>
                                                                                                <IconButton
                                                                                                    disabled={(isEdit && selectedToEditDay !== dayData.day)}
                                                                                                    onClick={() => {
                                                                                                        setOpen(true)
                                                                                                        setSelectedToEditDay(dayData.day)
                                                                                                    }}
                                                                                                >
                                                                                                    <AddIcon titleAccess='Add new Category' />
                                                                                                </IconButton>
                                                                                                <IconButton
                                                                                                    disabled={(isEdit && selectedToEditDay !== dayData.day)}
                                                                                                    sx={{}} onClick={() => {
                                                                                                        setIsEdit(true)
                                                                                                        setSelectedToEditDay(dayData.day)
                                                                                                        setTempDataStore(structuredClone(spendingData))
                                                                                                    }}
                                                                                                >
                                                                                                    <EditIcon titleAccess='Edit Existing'
                                                                                                    />
                                                                                                </IconButton>
                                                                                                <IconButton
                                                                                                    disabled={(isEdit && selectedToEditDay !== dayData.day)}
                                                                                                >
                                                                                                    <DeleteIcon titleAccess='Delete' />
                                                                                                </IconButton>

                                                                                            </>
                                                                                        )


                                                                                }
                                                                            </TableCell>
                                                                        )
                                                                    }

                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </React.Fragment>
                                            ) :
                                            // days Which don't have data
                                            (
                                                <React.Fragment key={dayIndex}>
                                                    <TableRow key={`${dayData.day}`} sx={{
                                                        backgroundColor: dayIndex % 2 === 0 ? 'grey.100' : 'white',
                                                    }}>

                                                        <TableCell >
                                                            <Typography>{dayData.day}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                                No Expense Created
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell >
                                                            <Typography>{dayData.totalCategory}</Typography>
                                                        </TableCell>
                                                        <TableCell >
                                                            <Typography>{dayData.totalSpending}</Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                (isEdit && selectedToEditDay === dayData.day) ? (
                                                                    <>
                                                                        <IconButton>
                                                                            <UpdateIcon titleAccess='Update' onClick={() => { handleUpdateExpense(dayIndex) }} />
                                                                        </IconButton>
                                                                        <IconButton>
                                                                            <CancelIcon titleAccess='Cancel' onClick={() => {
                                                                                setIsEdit(false)
                                                                                setSpendingData([...tempDataStore])
                                                                                setTempDataStore([])
                                                                            }} />
                                                                        </IconButton>
                                                                    </>

                                                                ) :
                                                                    (
                                                                        <>
                                                                            <IconButton
                                                                                disabled={(isEdit && selectedToEditDay !== dayData.day)}
                                                                                onClick={() => {
                                                                                    setOpen(true)
                                                                                    setSelectedToEditDay(dayData.day)
                                                                                }}
                                                                            >
                                                                                <AddIcon titleAccess='Add new Category' />
                                                                            </IconButton>
                                                                            <IconButton
                                                                                disabled={(isEdit && selectedToEditDay !== dayData.day)}
                                                                                sx={{}} onClick={() => {
                                                                                    setIsEdit(true)
                                                                                    setSelectedToEditDay(dayData.day)
                                                                                    setTempDataStore(structuredClone(spendingData))
                                                                                }}
                                                                            >
                                                                                <EditIcon titleAccess='Edit Existing'
                                                                                />
                                                                            </IconButton>
                                                                            <IconButton
                                                                                disabled={(isEdit && selectedToEditDay !== dayData.day)}
                                                                            >
                                                                                <DeleteIcon titleAccess='Delete' />
                                                                            </IconButton>

                                                                        </>
                                                                    )
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            <ExpenseTableModal open={open} setOpen={setOpen} filteredDate={filteredDate} selectedToEditDay={selectedToEditDay} sort={sortOrder} handleGetExpense={handleGetExpense} />
        </Box>
    )
}

export default ExpenseTable