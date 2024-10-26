'use server'
import CategoryChip from "@/components/HomePage/CategoryChip";
import CategoryFieldAmount from "@/components/HomePage/CategoryFieldAmount";
// import dynamic from 'next/dynamic';
// For avoiding Hydration error
// Only render in client side
// const CategoryChip = dynamic(() => import('@/components/HomePage/CategoryChip'), { ssr: false })
// const CategoryFieldAmount = dynamic(() => import('@/components/HomePage/CategoryFieldAmount'), { ssr: false })
import HomeModal from "@/components/HomePage/HomeModal";
import { Box, Grid2 as Grid } from "@mui/material";
// import { getAllCategory } from "@/lib/categoryApiServer";

// import { revalidatePath } from "next/cache";


export default async function Home() {

  // let categories = []

  // try {
  //   categories = await getAllCategory();

  //   revalidatePath('/');
  // } catch (error) {
  //   console.log('An unexpected error occurred:', error);
  // }

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0'); // Local date
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Local month (January is 0)
  const year = now.getFullYear(); // Local year
  const currentDate = `${day}-${month}-${year}`;

  return (
    <div className="flex flex-col items-center gap-y-5 h-dvh bg-white dark:bg-gray-900 text-black dark:text-white"
      style={{ height: "calc(100vh - 70px)" }}
    >
      <h6 className="text-center mb-5 font-bold font-mono text-lg mt-8">Save Your Daily Expense</h6>
      <Box sx={{ width: { md: "80vw", lg: "70vw" }, marginTop: "15px", maxWidth: "1700px" }}>
        <h1 className="font-bold text-center mb-14 font-mono text-lg">Date: {currentDate}</h1>
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={{ sm: 2, xs: 1, md: 6 }} columns={{ xs: 4, sm: 8, md: 12 }} >
            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
              <h3 className="text-center mb-5 font-bold font-mono text-lg">Category List</h3>
              {<CategoryChip  />}
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <h3 className="text-center mb-5 font-bold font-mono text-lg">Provide Spent Amount on Selected categories</h3>
              <CategoryFieldAmount />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <HomeModal />
    </div>
  );
}


