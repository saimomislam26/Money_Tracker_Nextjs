'use client'
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Typography
} from '@mui/material';

// Example data format
const data = [
  {
    day: 1,
    categories: [
      { category: "Food", amount: 50 },
      { category: "Transport", amount: 20 }
    ],
    totalSpending: 70
  },
  {
    day: 2,
    categories: [
      { category: "Entertainment", amount: 100 }
    ],
    totalSpending: 100
  },
  {
    day: 3,
    categories: [
      { category: "Groceries", amount: 60 },
      { category: "Utilities", amount: 40 },
      { category: "Rent", amount: 500 }
    ],
    totalSpending: 600
  }
];

const SpendingTable = () => {
  // Track the amounts for editing
  const [spendingData, setSpendingData] = useState(data);

  // Handle editing the amount for each category
  const handleAmountChange = (dayIndex: number, categoryIndex: number, newAmount: number) => {
    const updatedData = [...spendingData];
    updatedData[dayIndex].categories[categoryIndex].amount = newAmount;
    updatedData[dayIndex].totalSpending = updatedData[dayIndex].categories.reduce((sum, cat) => sum + cat.amount, 0);
    setSpendingData(updatedData);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="spending table" responsive="true">
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
  );
};

export default SpendingTable;
