import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/axios/apiRequest";
import { ListingCard } from "../../../components/ListingCard";
import CustomPagination from "../../../components/CustomPagination";

export default function AppliedListings({ user, constants, startLoading, stopLoading, demoData, location }) {

    const [listings, setListings] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const perPage = 10;

    const handlePageChange = (event, value) => {
        setPage(value);
    }

    useEffect(() => {
        async function fetchData() {
            const response = await apiRequest({ method: 'get', endPoint: `/common-services/applications/all?aspirantId=${user.aspirantId}ACTIVE&page=${page}&perPage=${perPage}&order=${JSON.stringify([['createdAt', 'DESC']])}`, startLoading, stopLoading });
            if (response.success) {
                let applications = response.data.data;
                let applicationListings = applications.map(application => {
                    application.listingDetails.status = application.status
                    return application.listingDetails
                });
                setListings(applicationListings);
                setCount(response.data.pages);
            };
        }
        if (location && location.pathname.includes('demo')) {
            setListings(demoData.listings);
        } else {
            fetchData();
        }
        // eslint-disable-next-line
    }, [page])

    return (
        <Grid container style={{ padding: '2vh' }}>
            <Grid item xs={12} md={12} style={{ padding: '1vh', display: 'flex', justifyContent: 'right' }}>
                <Grid item xs={12} md={12} style={{ padding: '1vh', display: 'flex', justifyContent: 'left', fontSize: '28pt' }}>
                    Below are the listings you have applied for!
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {listings.map(listing => {
                    return <Grid item xs={12} md={6} key={listing.id} ><ListingCard listing={listing} /></Grid>
                })}
                <Grid item md={12}>
                    {listings.length > 0 && <CustomPagination page={page} count={count} onChange={handlePageChange} />}
                </Grid>
            </Grid>
        </Grid>
    )
}