import ExpenseTable from '@/components/ExpensePage/ExpenseTable';
import { getAllExpense } from '@/lib/spendingApiServer';


const SpendingTable = async () => {
  let expenses = []
  const date = new Date();

  // Get the current month (0-11, so we add 1 to make it 1-12)
  const month = date.getMonth() + 1;

  // Get the current year
  const year = date.getFullYear();
  try {
    // console.log("Entered");
    expenses = await getAllExpense(year, month);

  } catch (error) {
    console.log('An unexpected error occurred:', error);
  }

  return (
    <ExpenseTable expenses={expenses} />
  );
};

export default SpendingTable;
