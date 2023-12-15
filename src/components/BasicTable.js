import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Paper, Button
} from "@mui/material";
import { getHumanTime } from "../utils/form";
import constants from '../config/apiConstants.json';
import { Link } from "react-router-dom";

export default function BasicTable({ data, keysToDelete = [] }) {
    const allFields = constants.FORM_FIELDS.CREATE;
    let timeStampKeys = [];
    let s3Keys = ['resume', 'offerLetter', 'failedRecords'];
    for (let model of Object.keys(allFields)) {
        for (let field of allFields[model]) {
            if (field.componentType === 'DateTimePicker') {
                timeStampKeys.push(field.key);
            }
        }
    }
    for (let row of data) {
        for (let key of Object.keys(row)) {
            if (keysToDelete.includes(key) || key.includes('Details')) delete row[key];
        }
    }
    const headers = Object.keys(data[0]);
    return <TableContainer component={Paper}>
        <Table aria-label="simple table" >
            <TableHead>
                <TableRow>
                    {headers.map(header => (
                        <TableCell key={header}>{header}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row, idx) => (
                    <TableRow
                        key={idx}
                    >
                        {Object.keys(row).map(key => {
                            let cellContent = row[key];
                            if (timeStampKeys.includes(key)) {
                                cellContent = getHumanTime(row[key]);
                            }
                            if (s3Keys.includes(key)) {
                                cellContent = <Button
                                    component={Link}
                                    to={row[key]}
                                    target="_blank"
                                    variant="outlined"
                                    color="primary"
                                >
                                    View & Download
                                </Button>
                            }

                            return (
                                <TableCell key={key}>
                                    {cellContent}
                                </TableCell>
                            );
                        })}
                    </TableRow>)
                )}
            </TableBody>
        </Table>
    </TableContainer>
}