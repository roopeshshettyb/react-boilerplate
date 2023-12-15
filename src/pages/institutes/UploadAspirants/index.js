import { Button, Grid, Typography } from "@mui/material";
import Form from "../../../components/Form";
import { apiRequest } from "../../../lib/axios/apiRequest";
import { useEffect, useState } from "react";
import Papa from 'papaparse';
import { toast } from "react-toastify";
import BasicTable from "../../../components/BasicTable";

export default function UploadAspirants({ user, startLoading, stopLoading, centerStyle, constants }) {

    const model = 'aspirants';
    const [csvData, setCSVData] = useState('');
    const [existingJob, setExistingJob] = useState(null);
    const [reRender, setReRender] = useState(false);
    // const modelFields = [...constants.FORM_FIELDS.CREATE["users"], ...constants.FORM_FIELDS.CREATE["aspirants"]];

    const fields = [{
        "required": false,
        "label": "Aspirants Data",
        "key": "data",
        "componentType": "File",
        "convertToJson": true,
        "multiple": false,
        "subType": [
            "csv"
        ]
    },];

    const jsonData = [
        {
            rollNo: 101,
            name: "John Doe",
            email: "john@example.com",
            phone: "5551234567",
            degree: "Bachelor of Science",
            branch: "Computer Science",
            allowedForPlacement: true,
            resume: "https://drive.google.com/file/d/your_drive_link_here/view?usp=sharing",
            gender: "MALE",
            dateOfBirth: "1990-05-15",
        },
        {
            rollNo: 102,
            name: "Alice Smith",
            email: "alice@example.com",
            phone: "5559876543",
            degree: "Bachelor of Arts",
            branch: "English",
            allowedForPlacement: false,
            resume: "https://drive.google.com/file/d/your_drive_link_here/view?usp=sharing",
            gender: "FEMALE",
            dateOfBirth: "1992-08-20",
        },
        {
            rollNo: 103,
            name: "Bob Jones",
            email: "bob@example.com",
            phone: "5555555555",
            degree: "Master of Engineering",
            branch: "Mechanical Engineering",
            allowedForPlacement: true,
            resume: "https://drive.google.com/file/d/your_drive_link_here/view?usp=sharing",
            gender: "MALE",
            dateOfBirth: "1988-12-10",
        },
        {
            rollNo: 104,
            name: "Susan Lee",
            email: "susan@example.com",
            phone: "5552223333",
            degree: "Bachelor of Science",
            branch: "Biology",
            allowedForPlacement: true,
            resume: "https://drive.google.com/file/d/your_drive_link_here/view?usp=sharing",
            gender: "FEMALE",
            dateOfBirth: "1991-03-25",
        },
        {
            rollNo: 105,
            name: "Michael Smith",
            email: "michael@example.com",
            phone: "5557778888",
            degree: "Master of Business Administration",
            branch: "Business Management",
            allowedForPlacement: true,
            resume: "https://drive.google.com/file/d/your_drive_link_here/view?usp=sharing",
            gender: "MALE",
            dateOfBirth: "1987-06-05",
        },
    ];

    const handleSubmit = async ({ event, payload, formData }) => {
        if (payload && payload.data && payload.data.length > 0) {
            let submittedHeaders = Object.keys(payload.data[0]);
            let permittedHeaders = Object.keys(jsonData[0]);
            for (let header of submittedHeaders) {
                if (!permittedHeaders.includes(header)) {
                    toast.error(`${header} is an invalid column. Please check file format and reupload with given column names`);
                    return
                }
            }
            payload.instituteId = user.instituteId;
            await apiRequest({ method: 'post', endPoint: `/common-services/${model}/bulk-create`, token: user.token, payload, startLoading, stopLoading, notify: true, formData });
            setReRender(true);
        } else {
            toast.error('Please check your file and reupload');
        }
    }

    const handleConvertToCSV = () => {
        const csv = Papa.unparse(jsonData);
        setCSVData(csv);
    };


    const DownloadCSV = ({ filename }) => {

        const handleDownload = () => {
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        };
        return (
            <Button variant="contained" onClick={handleDownload}>Download File Format for Upload</Button>
        );
    };

    const fetchExistingJobs = async () => {
        const response = await apiRequest({ method: 'get', endPoint: `/common-services/redis/${user.id}:${model}`, startLoading });
        if (response.success && response.data) {
            delete response.data.s3Prefix;
            response.data.fileName = response.data.complete.split('/')[3];
            delete response.data.complete;
            delete response.data.chunkKeys;
            if (response.data.status === constants.CSV_BATCHING.STATUS.COMPLETED) {
                const fileResponse = await apiRequest({ method: 'post', endPoint: `/common-services/get/s3`, stopLoading, payload: { s3Key: response.data.failedRecordsKey } });
                if (fileResponse.success) response.data.failedRecords = fileResponse.data.s3Link;
            }
            setExistingJob(response.data);
        }
    }

    useEffect(() => {
        handleConvertToCSV();
        fetchExistingJobs();
        // eslint-disable-next-line
    }, [reRender])

    return (
        <Grid container style={centerStyle} spacing={2}>
            {existingJob &&
                <>
                    <Grid item md={8} style={centerStyle}>
                        <Typography>Existing Upload Jobs</Typography>
                    </Grid>
                    <Grid item md={8} style={centerStyle}>
                        <BasicTable data={[existingJob]} />
                    </Grid>
                </>
            }
            <Grid item md={8} style={centerStyle}>
                <DownloadCSV filename="headers.csv" />
            </Grid>
            <Grid item md={8}>
                <Form crudType={'create'} fields={fields} user={user} handleSubmit={handleSubmit} />
            </Grid>
        </Grid>
    )
}