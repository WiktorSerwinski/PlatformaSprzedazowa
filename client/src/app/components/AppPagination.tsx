import { Box, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";

interface Props{
    metaData: MetaData;
    ChangePage: (pageNr: number) => void;
}



export default function AppPagination({ChangePage,metaData}:Props)
{
    return(
        <Box>
        <Pagination
          color="standard"
          size = 'large'
          count={metaData?.totalPages}
          page = {metaData?.currentPage}
          onChange={(_,page)=> ChangePage(page)}
          sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
        />
      </Box>
    )



}