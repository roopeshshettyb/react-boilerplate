import {
    Grid, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Paper
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { getHumanTime } from "../../../utils/form";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/axios/apiRequest";
import { Link } from "react-router-dom";
import CustomPagination from "../../../components/CustomPagination";

export default function ManageAspirants({ constants, user, centerStyle, startLoading, stopLoading }) {

    const [aspirants, setAspirants] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const perPage = 40;

    const CustomTable = ({ data, setSelectedIds, selectedIds }) => {
        let keysToDelete = ['createdAt', 'updatedAt', 'userDetails', 'instituteId', 'gradeIds', 'userId', 'gradeDetails'];
        const allFields = constants.FORM_FIELDS.CREATE;
        let timeStampKeys = [];
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
            for (let key of keysToDelete) {
                delete row[key];
            }
        }
        // const handleSelect = (id, selected) => {
        //     if (selected) {
        //         setSelectedIds((prev) => [...prev, id]);
        //     } else {
        //         let idx = selectedIds.findIndex(ele => { return id === ele });
        //         selectedIds.splice(idx, 1);
        //         setSelectedIds(selectedIds);
        //     }
        // }
        const headers = Object.keys(data[0]);
        return <TableContainer component={Paper}>
            <Table aria-label="simple table" >
                <TableHead>
                    <TableRow>
                        <TableCell key={'remove'}>Edit</TableCell>
                        {/* <TableCell key={'remove'}> <Checkbox />Select All</TableCell> */}
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
                                <Link to={`/${constants.ROUTES.INSTITUTES.DEFAULT}/${constants.ROUTES.INSTITUTES.EDIT_ASPIRANTS}/${row.id}`}> <EditIcon variant="contained"></EditIcon></Link>
                            </TableCell>
                            {/* <TableCell component="th" scope="row" key={idx}>
                                <Checkbox checked={selectedIds.includes(row.id)} onClick={(event) => handleSelect(row.id, event.target.checked)} />
                            </TableCell> */}
                            {Object.keys(row).map(key => (
                                <TableCell component="th" scope="row" key={key}>
                                    {row[key] !== null && (timeStampKeys.includes(key) ? getHumanTime(row[key]) : `${row[key]}`)}
                                </TableCell>
                            ))}
                        </TableRow>)
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    }

    useEffect(() => {
        async function fetchData() {
            const response = await apiRequest({ method: 'get', endPoint: `/common-services/aspirants/all?instituteId=${user.instituteId}&page=${page}&perPage=${perPage}&order=${JSON.stringify([['rollNo', 'asc']])}`, startLoading, stopLoading });
            setAspirants(response.data.data);
            setCount(response.data.pages);
        }
        fetchData();
        // eslint-disable-next-line
    }, [page])

    return (
        <Grid style={centerStyle}>
            <Grid container style={{ ...centerStyle, width: '91vw' }} spacing={2}>
                <Grid item md={12}>
                    {aspirants.length > 0 && <CustomTable data={aspirants} setSelectedIds={setSelectedIds} selectedIds={selectedIds} />}
                </Grid>
                <Grid item md={12}>
                    {aspirants.length > 0 && <CustomPagination page={page} count={count} onChange={handlePageChange} />}
                </Grid>
            </Grid>
        </Grid>
    )
}