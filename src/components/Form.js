import {
    TextField, Grid, Button, MenuItem, Box, FormControlLabel, Checkbox, Typography, Table,
    TableBody,
    TableCell,
    TableContainer, InputLabel,
    TableHead,
    TableRow, Paper, FormControl, Select
} from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";
import { getBodyOfForm, getHumanTime } from "../utils/form";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import apiConstants from '../config/apiConstants.json';
import { apiRequest } from "../lib/axios/apiRequest";
import Papa from 'papaparse';
import CancelIcon from '@mui/icons-material/Cancel';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const FileUpload = ({ onFileUpload, acceptedFileTypes, multiple, labelKey, label }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);

    const onDrop = (acceptedFiles) => {
        const uploadedImagesArray = [];
        const fileNamesArray = [];

        if (!multiple) {
            acceptedFiles = [acceptedFiles[0]];
        }

        for (let file of acceptedFiles) {
            if (!acceptedFileTypes.some(type => file.type.includes(type))) {
                toast.error(`${file.path} is of invalid type. Please provide only ${acceptedFileTypes.join(', ')} files`);
                continue;
            }
            uploadedImagesArray.push(URL.createObjectURL(file));
            fileNamesArray.push(file.path);
        }

        setFileNames(fileNamesArray);
        setUploadedFiles(uploadedImagesArray);
        onFileUpload(acceptedFiles, labelKey);
    };

    const removeFile = (index) => {
        const updatedFiles = [...uploadedFiles];
        const updatedNames = [...fileNames];
        updatedFiles.splice(index, 1);
        updatedNames.splice(index, 1);
        setUploadedFiles(updatedFiles);
        setFileNames(updatedNames);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop
    });

    return (
        <div>
            <Box>
                <div {...getRootProps()} style={dropzoneStyle}>
                    <input {...getInputProps()} />
                    <Grid container>
                        <Grid style={{ paddingRight: '1vh' }}>
                            <CloudUploadIcon sx={{ fontSize: 24 }} />
                        </Grid>
                        <Grid item xs={10} md={10}>
                            <Typography variant="body1">Drag & Drop or Click to Upload <b>{label}</b></Typography>
                        </Grid>
                    </Grid>
                </div>
                {acceptedFileTypes.includes('image') && uploadedFiles && (
                    uploadedFiles.map((uploadedImage, idx) => {
                        return (<div style={imagePreviewStyle} key={idx}>
                            <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        </div>)
                    })
                )}
                <ul>
                    {fileNames.map((file, index) => (
                        <li key={index}>{file}
                            <Button onClick={() => removeFile(index)}>Remove</Button></li>
                    ))}
                </ul>
            </Box>
        </div>
    );
};

const dropzoneStyle = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

const imagePreviewStyle = {
    margin: '10px',
    display: 'inline-block',
    position: 'relative',
};

const ChildForm = ({ fields = [], handleSubmit, popupLabelDetails, startLoading, stopLoading }) => {
    return (
        <Form fields={fields} handleSubmit={(e) => handleSubmit(e, popupLabelDetails)} childForm={true} startLoading={startLoading} stopLoading={stopLoading} crudType={'create'} />
    )
}

export default function Form({ fields = [], handleSubmit, submitButtonText = "Submit", user = {}, restrictedFields = [], CustomFormComponent = null, childForm = false, startLoading = null, stopLoading = null, initialFormData = {}, existingValues = {}, crudType, containerStyle = {} }) {

    const formItemStyle = { margin: '10px' };
    const popupStyle = {
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        position: 'relative',
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
    const [files, setFiles] = useState({});
    const [popupLabelDetails, setPopupLabelDetails] = useState(null);

    let nonMuiFields = ['RichText', 'DateTimePicker', 'File'];
    let addedDataTemp = {};
    let nonMuiDataTemp = {};
    if (existingValues) {
        for (let field of fields) {
            if (nonMuiFields.includes(field.componentType) || field.key.includes('Id')) {
                if (existingValues[field.key]) {
                    nonMuiDataTemp[field.key] = existingValues[field.key];
                    if (field.key.includes('Id')) {
                        addedDataTemp[field.key] = existingValues[`${field.key.replace('Ids', '').replace('Id', '')}Details`]
                    } else {
                        addedDataTemp[field.key] = existingValues[field.key];
                    }
                }
            }
        }
    }
    const [nonMuiData, setNonMuiData] = useState(JSON.parse(JSON.stringify(nonMuiDataTemp)));
    const [addedData, setAddedData] = useState(JSON.parse(JSON.stringify(addedDataTemp)));

    const validateForm = (fields, body, crudType) => {
        for (let field of fields) {
            if (field.required && !body[field.key] && crudType === 'create') {
                toast.error(`Please fill ${field.label} as it is a required field`);
                return false;
            }
        }
        return true;
    }

    const parseCSV = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true, // Treat the first row as headers
                skipEmptyLines: true,
                complete: (result) => {
                    resolve(result.data);
                },
                error: (error) => {
                    resolve([])
                },
            });
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let body = getBodyOfForm(event);
        body = { ...nonMuiData, ...initialFormData, ...body };
        if (!validateForm(fields, body, crudType)) return;
        let filesInPayload = false;
        let formData = null;
        const fileData = {};
        if (Object.keys(files).length > 0) {
            filesInPayload = true;
            formData = new FormData();
            for (let key of Object.keys(files)) {
                body[key] = [];
                for (let file of files[key]) {
                    formData.append(file.name, file);
                    body[key].push(file.name);
                    if (file.type === 'text/csv') {
                        filesInPayload = false;
                        body[key] = await parseCSV(file);
                        body.fileName = file.name;
                    }
                }
            };
            formData.append('body', JSON.stringify(body));
        }
        event.body = body;
        event.fileMetaData = fileData;
        let payload = filesInPayload ? formData : body;
        handleSubmit({ event, payload, formData: filesInPayload });
    }

    const handleChildFormSubmit = async ({ payload }, field) => {
        let model = apiConstants.MODEL_DEFAULTS.FOREIGN_KEY_MODEL_MAPPING[popupLabelDetails.key];
        let crudType = 'create';
        const response = await apiRequest({ method: 'post', endPoint: `/${model}/${crudType}`, payload, stopLoading, startLoading, token: user ? user.token : null, notify: false });
        if (response.success) {
            const valueKey = Object.keys(response.data)[0];
            let newId = response.data[valueKey].id;
            let existing = [];
            if (field.key.includes('Ids')) {
                if (nonMuiData[field.key]) {
                    existing.push(...nonMuiData[field.key]);
                }
                if (existingValues[field.key]) {
                    existing.push(...existingValues[field.key]);
                }
                if (Array.isArray(existing) && existing.length > 0) {
                    existing.push(newId);
                } else {
                    existing = [newId];
                }
            } else {
                existing = newId;
            }
            if (addedData[field.key]) {
                addedData[field.key].push(response.data[valueKey]);
            } else {
                addedData[field.key] = [response.data[valueKey]];
            }
            setAddedData(addedData)
            setNonMuiData({ ...nonMuiData, [field.key]: existing });
            setPopupLabelDetails(null);
        } else {
            toast.error('Internal Server Error');
        }
    }

    const handleFileUpload = (uploadedFiles, key) => {
        files[key] = uploadedFiles;
        setFiles(files);
    };

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const getNonMuiLabel = (field) => {
        if (field.label.toLowerCase().includes('id')) field.label = capitalizeFirstLetter(field.key.replace('Ids', '').replace('Id', ''));
        if (field.required) return `${field.label} *`;
        return field.label
    }

    // const handleNonMuiChange = (fieldName, e) => {
    //     if (e && e.target && e.target.value) {
    //         setNonMuiData({
    //             ...nonMuiData,
    //             [fieldName]: e.target.value
    //         });
    //     }
    // }

    const handleDirectChange = (fieldName, e) => {
        setNonMuiData({
            ...nonMuiData,
            [fieldName]: e
        });
    }

    const removeForeignData = (fieldKey, idx) => {
        if (nonMuiData[fieldKey] && addedData[fieldKey] && nonMuiData[fieldKey].length > 0 && addedData[fieldKey].length > 0) {
            let idxToRemove = nonMuiData[fieldKey].findIndex(ele => { return ele.id === addedData[fieldKey][idx].id });
            nonMuiData[fieldKey].splice(idxToRemove, 1);
            addedData[fieldKey].splice(idx, 1);
            setAddedData(JSON.parse(JSON.stringify(addedData)));
            setNonMuiData(JSON.parse(JSON.stringify(nonMuiData)));
        }
    }

    const CustomTable = ({ data, fieldKey }) => {
        let keysToDelete = ['id', 'createdAt', 'updatedAt'];
        const allFields = apiConstants.FORM_FIELDS.CREATE;
        let timeStampKeys = [];
        for (let model of Object.keys(allFields)) {
            for (let field of allFields[model]) {
                if (field.componentType === 'DateTimePicker') {
                    timeStampKeys.push(field.key);
                }
            }
        }
        for (let row of data) {
            for (let key of keysToDelete) {
                delete row[key];
            }
        }
        const headers = Object.keys(data[0]);
        return <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                <TableHead>
                    <TableRow>
                        <TableCell key={'remove'}>Remove</TableCell>
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
                            <TableCell component="th" scope="row" key={idx}>
                                <Button onClick={() => { removeForeignData(fieldKey, idx) }}>X</Button>
                            </TableCell>
                            {Object.keys(row).map(key => (
                                <TableCell component="th" scope="row" key={key}>
                                    {timeStampKeys.includes(key) ? getHumanTime(row[key]) : row[key]}
                                </TableCell>
                            ))}
                        </TableRow>)
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    }

    return (
        <Grid container style={containerStyle}>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 1, width: '100%' }}>
                {fields.map((field) => {
                    if (!restrictedFields.includes(field.key)) {
                        if (!field.key.toLowerCase().includes('id')) {
                            if (field.componentType === 'TextField') {
                                return (
                                    <Grid item xs={12} md={12} style={formItemStyle} key={field.key}>
                                        <TextField
                                            required={crudType === 'create' && field.required}
                                            fullWidth
                                            id={field.key}
                                            label={field.label}
                                            name={field.key}
                                            type={field.type}
                                            defaultValue={existingValues[field.key]}
                                            InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                                        />
                                    </Grid>)
                            } else if (field.componentType === 'DateTimePicker') {
                                return (
                                    <Grid item xs={12} md={12} style={formItemStyle} key={field.key}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                                                <DateTimePicker
                                                    id={field.key}
                                                    label={getNonMuiLabel(field)}
                                                    name={field.key}
                                                    onChange={(e) => { handleDirectChange(field.key, e.toISOString()) }}
                                                // defaultValue={existingValues[field.key]}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                )
                            } else if (field.componentType === 'Select') {
                                return (
                                    <Grid item xs={12} md={12} style={formItemStyle} key={field.key}>
                                        <TextField
                                            variant="outlined"
                                            select
                                            fullWidth
                                            id={field.key}
                                            required={crudType === 'create' && field.required}
                                            label={field.label}
                                            name={field.key}
                                            defaultValue={existingValues[field.key]}
                                        >
                                            {field.options.map(option => {
                                                return <MenuItem key={option} value={option}>{option}</MenuItem>
                                            })}
                                        </TextField>
                                    </Grid>
                                )
                            } else if (field.componentType === 'MultipleSelect') {
                                return (
                                    <Grid item xs={12} md={12} style={formItemStyle} key={field.key}>
                                        <FormControl fullWidth>
                                            <InputLabel >{field.label}</InputLabel>
                                            <Select
                                                multiple
                                                value={nonMuiData[field.key] ? nonMuiData[field.key] : []}
                                                onChange={(event) => handleDirectChange(field.key, event.target.value)}
                                                renderValue={(selected) => selected.join(', ')}
                                                MenuProps={MenuProps}
                                                fullWidth
                                                label={field.label}
                                                style={{ color: 'black' }}
                                            >
                                                {field.options.map(option => {
                                                    return <MenuItem key={option} value={option}>{option}</MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )
                            } else if (field.componentType === 'CheckBox') {
                                return (
                                    <Grid item xs={12} md={12} style={formItemStyle} key={field.key}>
                                        <FormControlLabel
                                            id={field.key}
                                            required={crudType === 'create' && field.required}
                                            label={field.label}
                                            name={field.key}
                                            control={<Checkbox defaultChecked={existingValues[field.key]} onChange={(event) => handleDirectChange(field.key, event.target.checked)} />}
                                            style={{ color: 'black' }}
                                            defaultValue={existingValues[field.key]}
                                        />
                                    </Grid>
                                )
                            } else if (field.componentType === 'File') {
                                return (
                                    <Grid item xs={12} md={12} style={formItemStyle} key={field.key}>
                                        <FileUpload
                                            onFileUpload={handleFileUpload}
                                            label={getNonMuiLabel(field)}
                                            labelKey={field.key}
                                            required={crudType === 'create' && field.required}
                                            acceptedFileTypes={field.subType}
                                            multiple={field.multiple}
                                        />
                                    </Grid>
                                )
                            } else if (field.componentType === 'RichText') {
                                return (
                                    <Grid item xs={12} md={12} style={formItemStyle} key={field.key}>
                                        <ReactQuill theme="snow"
                                            id={field.key}
                                            placeholder={getNonMuiLabel(field)}
                                            onChange={(e) => { handleDirectChange(field.key, e) }}
                                            defaultValue={existingValues[field.key]}
                                        />
                                    </Grid>
                                )
                            } else {
                                return <div key={field.key}></div>;
                            }
                        } else if (!childForm) {
                            return (
                                <Grid item xs={12} md={12} style={formItemStyle} key={field.key}>
                                    <Button onClick={() => { setPopupLabelDetails(field) }}>Add {getNonMuiLabel(field)}</Button>
                                    {addedData[field.key] && addedData[field.key].length > 0 && <CustomTable data={addedData[field.key]} fieldKey={field.key} />}
                                </Grid>
                            );
                        } else {
                            return <div key={field.key}></div>;
                        }
                    } else {
                        return <div key={field.key}></div>;
                    }
                })}
                {CustomFormComponent && <CustomFormComponent />}
                <Grid item xs={6} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid item xs={6} md={3}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {submitButtonText}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {popupLabelDetails &&
                <Grid item xs={12} md={12} style={popupGridStyle} key={popupLabelDetails.key}>
                    <Grid style={popupStyle}>
                        <Grid container style={{ margin: '10px' }}>
                            <Grid item xs={9} md={10} style={{
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'left',
                                alignItems: 'center',
                            }}>
                                Add {getNonMuiLabel(popupLabelDetails)}
                            </Grid>
                            <Grid item xs={1} md={1} style={{ cursor: 'pointer' }}>
                                <CancelIcon onClick={() => { setPopupLabelDetails(null) }} />
                            </Grid>
                        </Grid>
                        <ChildForm fields={apiConstants.FORM_FIELDS.CREATE[apiConstants.MODEL_DEFAULTS.FOREIGN_KEY_MODEL_MAPPING[popupLabelDetails.key]]} handleSubmit={handleChildFormSubmit} popupLabelDetails={popupLabelDetails} startLoading={startLoading} stopLoading={stopLoading} />
                    </Grid>
                </Grid>
            }
        </Grid >
    )

}