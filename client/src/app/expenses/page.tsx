import ExpenseTable from '@/components/ExpensePage/ExpenseTable';
import { getAllExpense } from '@/lib/spendingApiServer';


const SpendingTable = async () => {
  let expenses = []
  try {
    // console.log("Entered");
    expenses = await getAllExpense();

  } catch (error) {
    console.log('An unexpected error occurred:', error);
  }

  return (
    <ExpenseTable expenses={expenses} />
  );
};

export default SpendingTable;
