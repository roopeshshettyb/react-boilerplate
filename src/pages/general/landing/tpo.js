import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/axios/apiRequest";
import { ListingCard } from "../../../components/ListingCard";
import { Link } from "react-router-dom";
import CustomPagination from "../../../components/CustomPagination";

export default function TpoLanding({ user, constants, navUser, startLoading, stopLoading, demoListings = [] }) {

    const [listings, setListings] = useState(demoListings);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const perPage = 10;

    const linkTextStyle = {
        textDecoration: 'none',
        fontSize: '18pt',
        color: '#1976d2'
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    }

    useEffect(() => {
        async function fetchData() {
            const response = await apiRequest({ method: 'get', endPoint: `/common-services/listings/all?instituteIds=${JSON.stringify([user.instituteId])}&page=${page}&perPage=${perPage}&order=${JSON.stringify([['deadline', 'ASC'], ['startTakingApplicationsAt', 'ASC']])}`, startLoading, stopLoading });
            if (response.success) setListings(response.data.data);
            setCount(response.data.pages);
        }
        if (navUser) { fetchData() }
        // eslint-disable-next-line
    }, [])

    return (
        <Grid container>
            <Grid item xs={12} md={12} style={{ padding: '1vh', display: 'flex', justifyContent: 'right' }}>
                <Grid item xs={6} md={11} style={{ padding: '1vh', display: 'flex', justifyContent: 'left', fontSize: '28pt' }}>
                    Hello {user.name}!
                </Grid>
                <Grid item xs={6} md={2} style={{ padding: '1vh', display: navUser ? 'none' : 'flex', justifyContent: 'right' }} >
                    <Button variant="outlined"><Link style={linkTextStyle} to={`${constants.ROUTES.LISTINGS.DEFAULT}/${constants.ROUTES.LISTINGS.ANALYSIS}`}>Analysis</Link></Button>
                </Grid>
                <Grid item xs={6} md={2} style={{ padding: '1vh', display: navUser ? 'none' : 'flex', justifyContent: 'right' }} >
                    <Button variant="outlined"><Link style={linkTextStyle} to={`${constants.ROUTES.LISTINGS.DEFAULT}/${constants.ROUTES.LISTINGS.CALENDAR}`}>Calendar</Link></Button>
                </Grid>
                <Grid item xs={6} md={3} style={{ padding: '1vh', display: 'flex', justifyContent: 'right' }}>
                    <Button variant="outlined"><Link style={linkTextStyle} to={`${constants.ROUTES.LISTINGS.DEFAULT}/${constants.ROUTES.LISTINGS.CREATE}`}>+ Add Listing</Link></Button>
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