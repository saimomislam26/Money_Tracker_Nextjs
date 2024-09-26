
import { RootState } from "@/redux/store/store";
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import HomeModal from "@/components/HomePage/HomeModal";
import { getUserInfo } from "@/lib/api";
import { Box, Chip, Grid2 as Grid } from "@mui/material";
import { getAllCategory } from "@/lib/categoryApiServer";
import CategoryChip from "@/components/HomePage/CategoryChip";
import CategoryFieldAmount from "@/components/HomePage/CategoryFieldAmount";

export default async function Home() {

  let categories = []
  try {
    categories = await getAllCategory();
  } catch (error) {
    console.log('An unexpected error occurred:', error);
  }

  function getUTCDate() {
    const now = new Date();
    const day = String(now.getUTCDate()).padStart(2, '0');
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = now.getUTCFullYear();
    
    return `${day}-${month}-${year}`;
}

console.log(getUTCDate());

  return (
    <main className="flex flex-col items-center gap-y-5 h-dvh bg-white dark:bg-gray-900 text-black dark:text-white" style={{ height: "calc(100vh - 70px)" }}>
        <h6 className="text-center mb-5 font-bold font-mono text-lg mt-8">Save Your Daily Expense</h6>
      <Box sx={{ width: {md:"80vw", lg:"70vw"}, marginTop: "15px", maxWidth:"1700px" }}>
        <h1 className="font-bold text-center mb-14 font-mono text-lg">Date: {getUTCDate()}</h1>
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={{sm:2, xs:1, md: 6 }} columns={{ xs: 4, sm: 8, md: 12 }} >
            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
              <p className="text-center mb-5 font-bold font-mono text-lg">Category List</p>
              {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width:"100%" }}> */}
                <CategoryChip categories={categories} />
              {/* </Box> */}
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <p className="text-center mb-5 font-bold font-mono text-lg">Provide Spent Amount on Selected categories</p>
            <CategoryFieldAmount/>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <HomeModal />
    </main>
  );
}
