// import dynamic from 'next/dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expense Viewer',
  description: 'See Your all expenses and summary here',
};
// For avoiding Hydration error
// Only render in client side
// export const dynamic = "force-dynamic";
// const ExpenseTable =  dynamic(()=> import('@/components/ExpensePage/ExpenseTable'), { ssr: false })
import ExpenseTable from '@/components/ExpensePage/ExpenseTable';
// import { getAllExpense } from '@/lib/spendingApiServer';


const SpendingTable = async () => {
  // let expenses = []
  // const date = new Date();

  // // Get the current month (0-11, so we add 1 to make it 1-12)
  // const month = date.getMonth() + 1;

  // // Get the current year
  // const year = date.getFullYear();
  // try {
  //   // console.log("Entered");
  //   expenses = await getAllExpense(year, month);

  // } catch (error) {
  //   console.log('An unexpected error occurred:', error);
  // }
  // expenses={expenses}
  return (
      <ExpenseTable  />
  );
};

export default SpendingTable;
