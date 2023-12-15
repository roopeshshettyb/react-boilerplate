import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import Form from "../../../components/Form";
import { apiRequest } from "../../../lib/axios/apiRequest";
import { useParams } from 'react-router-dom';
import BasicTable from "../../../components/BasicTable";


export default function EditAspirant({ constants, user, startLoading, stopLoading, centerStyle }) {

    let props = useParams();
    const crudType = 'update';
    const aspirantModel = 'aspirants';
    const aspirantFields = constants.FORM_FIELDS[crudType.toUpperCase()][aspirantModel];

    const [aspirantExistingValues, setAspirantExistingValues] = useState({});
    const [userDetails, setUserDetails] = useState({});

    const fetchAspirantExistingValues = async () => {
        const response = await apiRequest({ method: 'get', endPoint: `/common-services/${aspirantModel}/${props.id}`, startLoading, stopLoading });
        setAspirantExistingValues(response.data);
        if (response.data.userDetails) setUserDetails(response.data.userDetails);
    }

    const handleAspirantUpdateSubmit = async ({ event, payload, formData }) => {
        payload.id = props.id;
        const response = await apiRequest({ method: 'post', endPoint: `/${aspirantModel}/${crudType}`, token: user.token, payload, startLoading, stopLoading, notify: true, formData });
        setAspirantExistingValues(response.data.dbAspirant);
    }

    useEffect(() => {
        fetchAspirantExistingValues();
        // eslint-disable-next-line
    }, [])

    return (
        <Grid container style={centerStyle}>
            <Grid item md={9}>
                {Object.keys(userDetails).length > 0 && <BasicTable data={[userDetails]} keysToDelete={['password']} />}
            </Grid>
            <Grid item md={9} style={centerStyle}>
                {Object.keys(aspirantExistingValues).length > 0 && <Form fields={aspirantFields} handleSubmit={handleAspirantUpdateSubmit} existingValues={aspirantExistingValues} submitButtonText="Update Aspirant" crudType={crudType} restrictedFields={['userId', 'instituteId']} />}
            </Grid>
        </Grid>
    )

}