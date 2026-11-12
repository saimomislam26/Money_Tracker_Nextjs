'use client'

const dateGeneration = ():string=>{
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // Local date
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Local month (January is 0)
    const year = now.getFullYear(); // Local year
    const currentDate = `${day}-${month}-${year}`;

    return currentDate
}

export default dateGeneration