import {
    Grid, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Paper, Checkbox, Button
} from "@mui/material";
import { getHumanTime } from "../../../utils/form";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/axios/apiRequest";
import CustomPagination from "../../../components/CustomPagination";
import Form from "../../../components/Form";
import { toast } from "react-toastify";
import CancelIcon from '@mui/icons-material/Cancel';
import { Link } from "react-router-dom";
import demoData from "../../../config/demo";

export default function UpdateAspirantStages({ constants, user, centerStyle, startLoading, stopLoading, useParams, navUser }) {

    const model = 'applications';
    const crudType = 'update';
    const defaultFields = constants.FORM_FIELDS[crudType.toUpperCase()][model];
    const [fields, setFields] = useState(defaultFields);
    const [aspirants, setAspirants] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [displayUpdateStagePopup, setDisplayUpdateStagePopup] = useState(false);
    const [displayEmailUploadPopUp, setDisplayEmailUploadPopUp] = useState(false);
    const [aspirantEmails, setAspirantEmails] = useState([]);
    const [listingDetails, setListingDetails] = useState({});
    const [reRender, setReRender] = useState(false);
    const { id: listingId } = useParams();
    const perPage = 40;
    const initialFormData = {
        listingId
    };

    const popupStyle = {
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        position: 'relative',
        width: '50vw'
    }
    const popupGridStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: '2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const CustomTable = ({ data, setSelectedIds, selectedIds }) => {
        let keysToDelete = ['createdAt', 'updatedAt', 'userDetails', 'instituteId', 'gradeIds', 'userId', 'listingId', 'aspirantId', 'currentStageId'];
        const allFields = constants.FORM_FIELDS.CREATE;
        let timeStampKeys = ['stage-scheduledAt'];
        for (let model of Object.keys(allFields)) {
            for (let field of allFields[model]) {
                if (field.componentType === 'DateTimePicker') {
                    timeStampKeys.push(field.key);
                }
            }
        }
        for (let row of data) {
            if (row.userDetails) {
                let displayKeys = ['name', 'email'];
                for (let key of displayKeys) {
                    row[key] = row.userDetails[key];
                }
            }
            if (row.currentStageDetails) {
                let displayKeys = ['name', 'scheduledAt'];
                for (let key of displayKeys) {
                    row[`stage-${key}`] = row.currentStageDetails[key];
                }
            }
            for (let key of Object.keys(row)) {
                if (keysToDelete.includes(key) || key.includes('Details')) delete row[key];
            }
        }
        const handleSelect = (id, selected) => {
            if (selected) {
                selectedIds.push(id);
                setSelectedIds(JSON.parse(JSON.stringify(selectedIds)));
            } else {
                let idx = selectedIds.findIndex(ele => { return id === ele });
                selectedIds.splice(idx, 1);
                setSelectedIds(JSON.parse(JSON.stringify(selectedIds)));
            }
        }
        const headers = Object.keys(data[0]);
        return <TableContainer component={Paper}>
            <Table aria-label="simple table" >
                <TableHead>
                    <TableRow>
                        <TableCell> Select </TableCell>
                        {headers.map(header => (
                            <TableCell key={header}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, idx) => (
                        <TableRow
                            key={idx}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" >
                                <Checkbox checked={selectedIds.includes(row.id)} onClick={(event) => handleSelect(row.id, event.target.checked)} />
                            </TableCell>
                            {Object.keys(row).map(key => {
                                let cellContent = row[key];
                                if (timeStampKeys.includes(key)) {
                                    cellContent = getHumanTime(row[key]);
                                }
                                if (key === 'offerLetter') {
                                    cellContent = <Button
                                        component={Link}
                                        to={row[key]}
                                        target="_blank"
                                        variant="outlined"
                                        color="primary"
                                    >
                                        View & Download
                                    </Button>;
                                }
                                return (<TableCell component="th" scope="row" key={key}>
                                    {cellContent !== null && cellContent}
                                </TableCell>)
                            })}
                        </TableRow>)
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    }

    const handleStageUpdatePopUp = () => {
        setDisplayUpdateStagePopup(true);
    }

    const handleEmailUploadPopUp = () => {
        setDisplayEmailUploadPopUp(true);
    }

    const handleSubmit = async ({ event, payload, formData }) => {
        let formPayload = event.body;
        formPayload = { aspirantUserEmails: aspirantEmails, ...formPayload };
        if (formPayload.stageName) {
            formPayload.currentStageId = listingDetails.stageDetails[listingDetails.stageDetails.findIndex(ele => { return ele.name === formPayload.stageName })].id;
        }
        if (selectedIds) {
            formPayload.applicationIds = selectedIds;
        }
        if (formData) {
            payload.set('body', JSON.stringify(formPayload));
        } else {
            payload = formPayload;
        }
        const response = await apiRequest({ method: 'post', endPoint: `/${model}/bulk/${crudType}`, token: user.token, payload, startLoading, stopLoading, notify: true, formData });
        if (response.success) {
            setDisplayUpdateStagePopup(false);
            setReRender(true);
        }
    }

    const handleAspirantEmailSubmit = async ({ event, payload, formData }) => {
        let emails = [];
        if (event.fileMetaData) {
            if (!event.fileMetaData.aspirantEmails[0].email) {
                toast.error('Please upload csv with column name as "email"');
                return
            }
            emails = event.fileMetaData.aspirantEmails.map(aspirant => { return aspirant.email });
            setAspirantEmails(emails);
            toast.success('Emails Uploaded! Please click on update stage to update stages of all these aspirants!');
            setDisplayEmailUploadPopUp(false);
        }
    }

    const handleDataDownload = async () => {
        await apiRequest({ method: 'get', endPoint: `/export/applicants/${listingId}`, token: user.token, startLoading, stopLoading, notify: true });
    }

    useEffect(() => {
        async function fetchData() {
            const response = await apiRequest({ method: 'get', endPoint: `/common-services/applications/all?listingId=${listingId}&page=${page}&perPage=${perPage}&order=${JSON.stringify([['currentStageId', 'asc']])}`, startLoading });
            const listingResponse = await apiRequest({ method: 'get', endPoint: `/common-services/listings/${listingId}` });
            setListingDetails(listingResponse.data);
            if (listingResponse.data.stageDetails && !fields.some(field => { return field.key === 'stageName' })) {
                fields.push({
                    "required": true,
                    "label": "New Stage",
                    "key": "stageName",
                    "options": listingResponse.data.stageDetails.map(stage => { return stage.name }),
                    "componentType": "Select"
                });
                setFields(JSON.parse(JSON.stringify(fields)));
            }
            setAspirants(response.data.data);
            setCount(response.data.pages);
            stopLoading();
        }
        if (navUser) {
            fetchData();
        } else {
            setAspirants(demoData.aspirants);
            setCount(1);
        }
        // eslint-disable-next-line
    }, [page, reRender])

    return (
        <Grid style={{ ...centerStyle, paddingTop: '10px' }}>
            <Grid container style={{ ...centerStyle, width: '80vw' }} spacing={2}>
                <Grid item md={2}>
                    <Button variant="contained" onClick={handleStageUpdatePopUp}>Update Stage</Button>
                </Grid>
                <Grid item md={5}>
                    <Button variant="contained" onClick={handleEmailUploadPopUp}>Upload Applicants Emails To Change Stage</Button>
                </Grid>
                <Grid item md={4}>
                    <Button variant="contained" onClick={handleDataDownload}>Export Applicants Data</Button>
                </Grid>
                <Grid item md={12}>
                    {aspirants.length > 0 && <CustomTable data={aspirants} setSelectedIds={setSelectedIds} selectedIds={selectedIds} />}
                </Grid>
                <Grid item md={12}>
                    {aspirants.length > 0 && <CustomPagination page={page} count={count} onChange={handlePageChange} />}
                </Grid>
            </Grid>
            {displayUpdateStagePopup && <Grid item xs={12} md={12} style={popupGridStyle}>
                <Grid style={popupStyle}>
                    <Grid container style={{ margin: '10px' }}>
                        <Grid item xs={11} md={11} style={{
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'left',
                            alignItems: 'center',
                        }}>
                            Update Aspirant Stages
                        </Grid>
                        <Grid item xs={1} md={1} style={{ cursor: 'pointer' }}>
                            <CancelIcon onClick={() => { setDisplayUpdateStagePopup(false) }} />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Form crudType={crudType} fields={fields} user={user} restrictedFields={[...Object.keys(initialFormData), 'aspirantId', 'currentStageId']} initialFormData={initialFormData} handleSubmit={handleSubmit} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>}
            {displayEmailUploadPopUp && <Grid item xs={12} md={12} style={popupGridStyle}>
                <Grid style={popupStyle}>
                    <Grid container style={{ margin: '10px' }}>
                        <Grid item xs={11} md={11} style={{
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'left',
                            alignItems: 'center',
                        }}>
                            Update Aspirant Emails
                        </Grid>
                        <Grid item xs={1} md={1} style={{ cursor: 'pointer' }}>
                            <CancelIcon onClick={() => { setDisplayEmailUploadPopUp(null) }} />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Form crudType={'create'} fields={[
                                {
                                    "required": false,
                                    "label": "Aspirant Emails",
                                    "key": "aspirantEmails",
                                    "componentType": "File",
                                    "multiple": false,
                                    "subType": [
                                        "csv"
                                    ]
                                }]} user={user} handleSubmit={handleAspirantEmailSubmit} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>}
        </Grid>
    )
}