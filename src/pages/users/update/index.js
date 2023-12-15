import { Grid } from "@mui/material";
import Form from "../../../components/Form";
import { apiRequest } from "../../../lib/axios/apiRequest";
import { useEffect, useState } from "react";

export default function UserUpdate({ constants, user, startLoading, stopLoading, centerStyle }) {

    const [instituteExistingValues, setInstituteExistingValues] = useState({});
    const [aspirantExistingValues, setAspirantExistingValues] = useState({});

    const crudType = 'update';
    const userModel = 'users';
    const userFields = constants.FORM_FIELDS[crudType.toUpperCase()][userModel];
    const instituteModel = 'institutes'
    const instituteFields = constants.FORM_FIELDS[crudType.toUpperCase()][instituteModel];
    const aspirantModel = 'aspirants'
    const aspirantFields = constants.FORM_FIELDS[crudType.toUpperCase()][aspirantModel];

    const handleUserUpdateSubmit = async ({ event, payload, formData }) => {
        if (payload.password.length === 0) delete payload.password;
        payload.email = user.email;
        if (payload.dateOfBirth.length === 0) payload.dateOfBirth = null;
        const response = await apiRequest({ method: 'post', endPoint: `/${userModel}/${crudType}`, token: user.token, payload, startLoading, stopLoading, notify: true, formData });
        if (response.success) {
            const updatedUser = response.data.dbUser;
            updatedUser.token = response.data.token;
            const keysToDelete = ['permissions'];
            for (let key of keysToDelete) {
                delete updatedUser[key];
            }
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload();
        }
    }

    const handleInstituteUpdateSubmit = async ({ event, payload, formData }) => {
        const response = await apiRequest({ method: 'post', endPoint: `/${instituteModel}/${crudType}`, token: user.token, payload, startLoading, stopLoading, notify: true, formData });
        if (response.success) setInstituteExistingValues(response.data.dbInstitute);
    }

    const handleAspirantUpdateSubmit = async ({ event, payload, formData }) => {
        const response = await apiRequest({ method: 'post', endPoint: `/${aspirantModel}/${crudType}`, token: user.token, payload, startLoading, stopLoading, notify: true, formData });
        if (response.success) setAspirantExistingValues(response.data.dbAspirant);
    }

    const fetchInstituteExistingValues = async () => {
        const response = await apiRequest({ method: 'get', endPoint: `/common-services/${instituteModel}/${user.instituteId}`, startLoading, stopLoading });
        if (response.success) setInstituteExistingValues(response.data);
    }

    const fetchAspirantExistingValues = async () => {
        const response = await apiRequest({ method: 'get', endPoint: `/common-services/${aspirantModel}/${user.aspirantId}`, startLoading, stopLoading });
        if (response.success) setAspirantExistingValues(response.data);
    }

    useEffect(() => {
        if (user.role === constants.MODEL_DEFAULTS.ROLES.TPO) {
            fetchInstituteExistingValues();
        }
        if (user.role === constants.MODEL_DEFAULTS.ROLES.ASPIRANT) {
            fetchAspirantExistingValues();
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Grid container style={centerStyle}>
            <Grid item xs={10} md={10}>
                <Form fields={userFields} handleSubmit={handleUserUpdateSubmit} existingValues={user} submitButtonText="Save changes to user profile" crudType={crudType} />
            </Grid>
            {user.role === constants.MODEL_DEFAULTS.ROLES.TPO && Object.keys(instituteExistingValues).length > 0 &&
                <>
                    <Grid item xs={12} md={12}>
                        <hr />
                    </Grid>
                    <Grid item xs={10} md={10}>
                        <Form fields={instituteFields} handleSubmit={handleInstituteUpdateSubmit} existingValues={instituteExistingValues} submitButtonText="Save changes to institute details" crudType={crudType} initialFormData={{ instituteId: instituteExistingValues.id }} restrictedFields={['listingIds', 'userId']} />
                    </Grid>
                </>
            }
            {user.role === constants.MODEL_DEFAULTS.ROLES.ASPIRANT && Object.keys(aspirantExistingValues).length > 0 &&
                <>
                    <Grid item xs={12} md={12}>
                        <hr />
                    </Grid>
                    <Grid item xs={10} md={10}>
                        <Form fields={aspirantFields} restrictedFields={['userId', 'instituteId', 'allowedForPlacement']} handleSubmit={handleAspirantUpdateSubmit} existingValues={aspirantExistingValues} initialFormData={{ userId: user.id, id: user.aspirantId }} submitButtonText="Save changes to academic profile" crudType={crudType} />
                    </Grid>
                </>
            }
        </Grid>
    )

}