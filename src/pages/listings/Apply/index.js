import { Grid, TextField, Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/axios/apiRequest";
import SingleListingView from "../SingleView";
import { getBodyOfForm } from "../../../utils/form";

export default function ApplyListing({ constants, useParams, user, navUser, startLoading, stopLoading, centerStyle, demoData }) {

    const model = 'applications';
    const crudType = 'create';

    const { id } = useParams();
    const [listing, setListing] = useState({});
    const initialFormData = {
        instituteId: user.instituteId,
        aspirantId: user.aspirantId,
        listingId: id
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let body = getBodyOfForm(event);
        let responsesPayload = [];
        let applicationPayload = { ...initialFormData, status: 'APPLIED' };
        if (listing.stageIds && listing.stageIds.length > 0) {
            applicationPayload.currentStageId = listing.stageIds[0];
        }
        const applicationResponse = await apiRequest({ method: 'post', endPoint: `/${model}/${crudType}`, token: user.token, payload: applicationPayload, startLoading, stopLoading, notify: true });
        if (applicationResponse.success) {
            for (let key of Object.keys(body)) {
                responsesPayload.push({
                    "questionId": key,
                    "listingId": parseInt(id),
                    "aspirantId": user.aspirantId,
                    "response": body[key]
                });
            }
            let promises = []
            for (let responsePayload of responsesPayload) {
                promises.push(apiRequest({ method: 'post', endPoint: `/question-responses/${crudType}`, token: user.token, payload: responsePayload }));
            }
            await Promise.allSettled(promises);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const response = await apiRequest({ method: 'get', endPoint: `/common-services/listings/${id}}`, token: user.token, startLoading, stopLoading });
            setListing(response.data);
        }
        if (!navUser) {
            console.log(demoData.listings[id - 1]);
            // setListing(demoData.listings[id - 1]);
        } else {
            fetchData();
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid item md={6}>
                <SingleListingView user={{}} startLoading={startLoading} stopLoading={stopLoading} useParams={useParams} centerStyle={centerStyle} constants={constants} muiMd={12} demoData={demoData} navUser={navUser} />
            </Grid>
            <Grid item md={6}>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <Grid item md={12}>
                        {listing && Object.keys(listing).length > 0 && listing.questionDetails && listing.questionDetails.length > 0 &&
                            listing.questionDetails.map(question => {
                                return (
                                    <Grid item xs={12} md={12} style={{ margin: '20px' }} key={question.id}>
                                        <Typography>{question.text}</Typography>
                                        <TextField
                                            required
                                            fullWidth
                                            id={question.id.toString()}
                                            name={question.id.toString()}
                                        />
                                    </Grid>
                                )
                            }
                            )
                        }
                        {listing && Object.keys(listing).length > 0 && ((listing.questionDetails && listing.questionDetails.length === 0) || !listing.questionDetails) &&
                            <Grid style={{ padding: '20px' }}>
                                <Typography variant="h3">Verify the Listing Details and confirm your application!</Typography>
                            </Grid>
                        }
                    </Grid>
                    <Grid item md={12} style={centerStyle}>
                        <Grid item md={4}>
                            <Button fullWidth variant="contained" type="submit">Apply</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    )
}