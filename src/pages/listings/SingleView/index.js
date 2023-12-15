import { Typography, Paper, Grid, Button, Card, CardContent } from "@mui/material"
import { apiRequest } from "../../../lib/axios/apiRequest"
import { useEffect, useState } from "react";
import { getHumanTime } from "../../../utils/form";
import BasicTable from "../../../components/BasicTable";
import { Link } from "react-router-dom";

export default function SingleListingView({ user, navUser, startLoading, stopLoading, useParams, centerStyle, muiMd = 10, location, demoData, constants }) {
    const { id } = useParams();
    const [listing, setListing] = useState({});
    const [application, setApplication] = useState(null);
    const [listingMd, setListingMd] = useState(muiMd);
    const [reRender, setReRender] = useState(false);

    useEffect(() => {
        async function fetchData() {
            startLoading();
            let response;
            if (user.role === constants.MODEL_DEFAULTS.ROLES.ASPIRANT) {
                response = await apiRequest({ method: 'get', endPoint: `/common-services/applications/all?aspirantId=${user.aspirantId}`, token: user.token, });
                if (response.success) setApplication(response.data.data[0]); setListingMd(7);
            }
            response = await apiRequest({ method: 'get', endPoint: `/common-services/listings/${id}`, token: user.token });
            if (response.success) setListing(response.data);
            stopLoading();
        }
        if (!navUser) {
            if (parseInt(id) === 2 && user.role === constants.MODEL_DEFAULTS.ROLES.ASPIRANT) {
                setApplication(demoData.application);
                setListingMd(7);
            }
            setListing(demoData.listings[id - 1]);
        } else {
            fetchData();
        }
        // eslint-disable-next-line
    }, [reRender])

    const style = {
        paper: {
            padding: '16px',
            margin: 'auto',
        },
        button: {
            marginTop: '16px',
        },
    };

    const updateApplication = async (status) => {
        let payload = { status, id: application.id };
        await apiRequest({ method: 'post', endPoint: `/applications/update`, token: user.token, payload, startLoading, stopLoading, notify: true });
        setReRender(true);
    }

    const ListingView = ({ listing, role }) => {

        const defaultApplyRoute = `/${constants.ROUTES.LISTINGS.DEFAULT}/${constants.ROUTES.LISTINGS.APPLY}/${listing.id}`;
        const applyRoute = location && location.pathname.includes('demo') ? `/demo${defaultApplyRoute}` : defaultApplyRoute;

        const defaultUpdateRoute = `/${constants.ROUTES.LISTINGS.DEFAULT}/${constants.ROUTES.LISTINGS.UPDATE}/${listing.id}`;
        const updateRoute = location && location.pathname.includes('demo') ? `/demo${defaultUpdateRoute}` : defaultUpdateRoute;

        const defaultUpdateAspirantRoute = `/${constants.ROUTES.LISTINGS.DEFAULT}/${constants.ROUTES.LISTINGS.UPDATE_ASPIRANT_STAGES}/${listing.id}`;
        const updateAspirantRoute = location && location.pathname.includes('demo') ? `/demo${defaultUpdateAspirantRoute}` : defaultUpdateAspirantRoute;

        const Actions = ({ role }) => {
            if (role === 'ASPIRANT') {
                if (!application) {
                    if (listing && listing.careerPageApplicationLink && listing.careerPageApplicationLink.length > 0) {
                        return (
                            <Button
                                style={style.button}
                                variant="contained"
                                color="primary"
                                href={listing.careerPageApplicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Apply Now
                            </Button>
                        )
                    } else {
                        return (
                            <Button
                                style={style.button}
                                variant="contained"
                                color="primary"
                            >
                                <Link style={{ textDecoration: 'none', color: 'white' }} to={applyRoute}>Apply Now</Link>
                            </Button>
                        )
                    }
                }
            } else if (['ADMIN', 'TPO'].includes(role)) {
                return (
                    <Grid container spacing={2}>
                        <Grid item md={2}>
                            <Button
                                style={style.button}
                                variant="contained"
                                color="primary"
                            >
                                <Link style={{ textDecoration: 'none', color: 'white' }} to={updateRoute}>Update Listing</Link>
                            </Button>
                        </Grid>
                        <Grid item md={4}>
                            <Button
                                style={style.button}
                                variant="contained"
                                color="primary"
                            >
                                <Link style={{ textDecoration: 'none', color: 'white' }} to={updateAspirantRoute}>Update Aspirant Stages</Link>
                            </Button>
                        </Grid>
                    </Grid>
                )
            }
        }


        return (
            <Grid>
                <Paper style={style.paper}>
                    <Typography variant="h5" gutterBottom>
                        Job Listing Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Role:</Typography>
                            <Typography>{listing.role}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Position Type:</Typography>
                            <Typography>{listing.positionType}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Min CTC:</Typography>
                            <Typography>{listing.minCtc}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Max CTC:</Typography>
                            <Typography>{listing.maxCtc}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Courses Allowed:</Typography>
                            <Typography>{listing.coursesAllowed}</Typography>
                        </Grid>
                        {listing.jobDescription && <Grid item xs={12}>
                            <Typography variant="subtitle1">Job Descripiton:</Typography>
                            <div
                                dangerouslySetInnerHTML={{ __html: listing.jobDescription }}
                            />
                        </Grid>}
                        {listing.jobDescriptionPdfLink && (
                            <Grid style={{ padding: '10px' }}>
                                <Button
                                    component={Link}
                                    to={listing.jobDescriptionPdfLink} // Assuming offerLetter is a valid link
                                    target="_blank"
                                    variant="outlined"
                                    color="primary"
                                >
                                    View & Download Job Description
                                </Button>
                            </Grid>
                        )}
                        {listing.stageDetails && <Grid item xs={12}>
                            <Typography variant="subtitle1">Stages:</Typography>
                            <BasicTable data={listing.stageDetails} keysToDelete={['createdAt', 'updatedAt', 'id']} />
                        </Grid>}
                        {listing.eligibilityDetails && <Grid item xs={12}>
                            <Typography variant="subtitle1">Eligibility:</Typography>
                            <BasicTable data={listing.eligibilityDetails} keysToDelete={['createdAt', 'updatedAt', 'id']} />
                        </Grid>}
                        {listing.questionDetails && <Grid item xs={12}>
                            <Typography variant="subtitle1">Questions:</Typography>
                            <BasicTable data={listing.questionDetails} keysToDelete={['createdAt', 'updatedAt']} />
                        </Grid>}
                        {listing.companyDetails && <Grid item xs={12}>
                            <Typography variant="subtitle1">Company:</Typography>
                            <BasicTable data={[listing.companyDetails]} keysToDelete={['createdAt', 'updatedAt', 'id', 'listingIds', 'logo']} />
                        </Grid>}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Institute Name:</Typography>
                            <Typography>{listing.instituteDetails[0].name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Deadline:</Typography>
                            <Typography>{getHumanTime(listing.deadline)}</Typography>
                        </Grid>
                    </Grid>
                    <Actions role={role} />
                </Paper>
            </Grid>
        )
    }

    const StatusView = ({ application }) => {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h4" >
                        Application Status: {application.status}
                    </Typography>
                    {application.currentStageDetails && (
                        <>
                            <Typography variant="h5" component="div">
                                Current Stage Details -
                            </Typography>
                            {application.currentStageDetails.name && (
                                <Typography variant="h6" component="div">
                                    Name: {application.currentStageDetails.name}
                                </Typography>
                            )}
                            {application.currentStageDetails.description && (
                                <Typography variant="h6" component="div">
                                    Description: {application.currentStageDetails.description}
                                </Typography>
                            )}
                            {application.currentStageDetails.venue && (
                                <Typography variant="h6" component="div">
                                    Venue: {application.currentStageDetails.venue}
                                </Typography>
                            )}
                            {application.currentStageDetails.scheduledAt && (
                                <Typography variant="h6" component="div">
                                    Scheduled At: {getHumanTime(application.currentStageDetails.scheduledAt)}
                                </Typography>
                            )}
                        </>
                    )}
                    {application.offerExpiry && (
                        <Typography variant="h6" >
                            Offer Expiry: {getHumanTime(application.offerExpiry)}
                        </Typography>
                    )}
                    {application.offerLetter && (
                        <Grid style={{ padding: '10px' }}>
                            <Button
                                component={Link}
                                to={application.offerLetter} // Assuming offerLetter is a valid link
                                target="_blank"
                                variant="outlined"
                                color="primary"
                            >
                                View & Download Offer Letter
                            </Button>
                        </Grid>
                    )}
                    {application.status === constants.MODEL_DEFAULTS.APPLICATION.STATUS.OFFERED && (
                        <Grid>
                            <Grid style={{ padding: '10px' }}>
                                <Button
                                    onClick={() => { updateApplication(constants.MODEL_DEFAULTS.APPLICATION.STATUS.ACCEPTED) }}
                                    variant="contained"
                                    color="primary"
                                >
                                    Accept Offer
                                </Button>
                            </Grid>
                            <Grid style={{ padding: '10px' }}>
                                <Button
                                    onClick={() => { updateApplication(constants.MODEL_DEFAULTS.APPLICATION.STATUS.OFFER_REJECTED) }}
                                    variant="contained"
                                    color="primary"
                                >
                                    Reject Offer
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Grid container style={{ ...centerStyle, padding: '1vh' }} columnSpacing={2}>
            <Grid item md={listingMd}>
                {listing && Object.keys(listing).length > 0 && <ListingView listing={listing} role={user.role} />}
            </Grid>
            {application && <Grid item md={12 - listingMd}>
                {Object.keys(application).length > 0 && <StatusView application={application} />}
            </Grid>}
        </Grid>
    )
}