import { Grid } from "@mui/material";
import Form from "../../../components/Form";
import { apiRequest } from '../../../lib/axios/apiRequest';

export default function AdminCrud({ constants, user, startLoading, stopLoading, useParams, centerStyle }) {

    const pathParams = useParams();
    const model = pathParams.model;
    const crudType = pathParams.type;

    const handleSubmit = async ({ event, formData, payload }) => {
        await apiRequest({ method: 'post', endPoint: `/${model}/${crudType}`, token: user.token, payload, startLoading, stopLoading, notify: true, formData });
    }

    return (
        <Grid style={centerStyle}>
            <Grid style={{ width: '80vw' }}>
                <Form fields={constants.FORM_FIELDS[crudType.toUpperCase()][model]} handleSubmit={handleSubmit} user={user} startLoading={startLoading} stopLoading={stopLoading} crudType={crudType} />
            </Grid>
        </Grid>
    )
}