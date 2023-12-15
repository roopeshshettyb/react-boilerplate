import { Card, CardActions, CardContent, Button, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import constants from "../config/constants";
import { getHumanTime } from "../utils/form";

function ListingCard({ listing }) {
    const linkTextStyle = {
        textDecoration: 'none',
        color: 'white'
    };
    const location = useLocation();
    let defaultOpenLink = `/${constants.ROUTES.LISTINGS.DEFAULT}/${constants.ROUTES.LISTINGS.VIEW}/${listing.id}`;
    if (location && location.pathname.includes('demo')) {
        defaultOpenLink = '/demo' + defaultOpenLink;
    }
    return <Card key={listing.id} style={{ padding: '1vh' }}>
        <CardContent >
            <Typography variant="h4" gutterBottom>
                {listing.companyDetails && `Company - ${listing.companyDetails.name}`}
            </Typography>
            <Typography variant="h5" component="div">
                {listing.role}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {listing.positionType}
            </Typography>
            <Typography sx={{ mb: 1.5 }}>
                Deadline - {getHumanTime(listing.deadline)}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Applications Open at  {getHumanTime(listing.startTakingApplicationsAt)}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.primary">
                Status - {listing.status}
            </Typography>
            <Typography variant="h5" sx={{ mb: 1.5 }} >
                ₹{listing.minCtc} {listing.maxCtc && `- ₹${listing.maxCtc}`}
            </Typography>
            <Typography variant="h6">
                {listing.coursesAllowed}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" variant="contained">
                <Link style={linkTextStyle} to={defaultOpenLink}>Open</Link>
            </Button>
        </CardActions>
    </Card>
}

export { ListingCard }