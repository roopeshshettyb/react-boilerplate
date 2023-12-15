import { Grid } from "@mui/material";
import Form from "../../../components/Form";
import { apiRequest } from "../../../lib/axios/apiRequest";

export default function CreateListing({ constants, user, startLoading, stopLoading }) {

    const model = 'listings';
    const crudType = 'create';
    const fields = constants.FORM_FIELDS[crudType.toUpperCase()][model];
    const initialFormData = {
        instituteIds: [user.instituteId],
        listerIds: [user.id],
    };

    const handleSubmit = async ({ event, payload, formData }) => {
        await apiRequest({ method: 'post', endPoint: `/${model}/${crudType}`, token: user.token, payload, startLoading, stopLoading, notify: true, formData });
    }

    return (
        <Grid container justifyContent={'center'}>
            <Grid item xs={12} md={7}>
                <Form fields={fields} handleSubmit={handleSubmit} user={user} restrictedFields={Object.keys(initialFormData)} startLoading={startLoading} stopLoading={stopLoading} initialFormData={initialFormData} crudType={crudType} />
            </Grid>
        </Grid>
    )

}