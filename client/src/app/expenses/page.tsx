'use client'
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Typography, Card, CardContent, Button, Box, Grid
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const data = [
  {
    day: 1,
    categories: [
      { category: "Food", amount: 50 },
      { category: "Transport", amount: 20 }
    ],
    totalSpending: 70,
    totalCategories: 2
  },
  {
    day: 2,
    categories: [
      { category: "Entertainment", amount: 100 }
    ],
    totalSpending: 100,
    totalCategories: 1
  },
  {
    day: 3,
    categories: [
      { category: "Groceries", amount: 60 },
      { category: "Utilities", amount: 40 },
      { category: "Rent", amount: 500 }
    ],
    totalSpending: 600,
    totalCategories: 3
  }
];

const SpendingTable = () => {
  const [spendingData, setSpendingData] = useState(data);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is mobile

  // Handle editing the amount for each category
  const handleAmountChange = (dayIndex: number, categoryIndex: number, newAmount: number) => {
    const updatedData = [...spendingData];
    updatedData[dayIndex].categories[categoryIndex].amount = newAmount;
    updatedData[dayIndex].totalSpending = updatedData[dayIndex].categories.reduce((sum, cat) => sum + cat.amount, 0);
    setSpendingData(updatedData);
  };

  return (
    <Box sx={{ p: 2 }}>
      {isMobile ? (
        // Mobile view - Display as cards
        <Grid container spacing={2}>
          {spendingData.map((dayData, dayIndex) => (
            <Grid item xs={12} key={dayData.day}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">Day: {dayData.day}</Typography>
                  <Typography>Categories: {dayData.totalCategories}</Typography>
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
              {spendingData.map((dayData, dayIndex) => (
                <>
                  {dayData.categories.map((category, categoryIndex) => (
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
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SpendingTable;
