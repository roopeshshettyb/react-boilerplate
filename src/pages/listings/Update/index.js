import { Grid } from "@mui/material";
import Form from "../../../components/Form";
import { apiRequest } from "../../../lib/axios/apiRequest";
import { useEffect, useState } from "react";

export default function UpdateListing({ constants, user, startLoading, stopLoading, useParams, demoData, navUser }) {

    const [listingExistingValues, setListingExistingValues] = useState({});
    const listingModel = 'listings';
    const crudType = 'update';
    const fields = constants.FORM_FIELDS[crudType.toUpperCase()][listingModel];
    const { id } = useParams();
    const initialFormData = {
        listerIds: [user.id],
        id: id
    };

    const handleListingUpdateSubmit = async ({ event, payload, formData }) => {
        const response = await apiRequest({ method: 'post', endPoint: `/${listingModel}/${crudType}`, token: user.token, payload, startLoading, stopLoading, notify: true, formData });
        if (response.success) setListingExistingValues(response.data.dbListing);
    }

    const fetchListingExistingValues = async () => {
        const response = await apiRequest({ method: 'get', endPoint: `/common-services/${listingModel}/${id}`, startLoading, stopLoading });
        if (response.success) setListingExistingValues(response.data);
    }

    useEffect(() => {
        if (navUser) {
            fetchListingExistingValues();
        } else {
            setListingExistingValues(demoData.listings[id - 1]);
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Grid container justifyContent={'center'}>
            <Grid item xs={12} md={7}>
                {Object.keys(listingExistingValues).length > 0 && <Form fields={fields} handleSubmit={handleListingUpdateSubmit} user={user} restrictedFields={[...Object.keys(initialFormData), 'instituteIds', 'stageIds', 'companyId']} startLoading={startLoading} stopLoading={stopLoading} initialFormData={initialFormData} crudType={crudType} existingValues={listingExistingValues} />}
            </Grid>
        </Grid>
    )
}