import {
    Avatar,
    Grid,
    Box,
    Typography,
    Container
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { apiRequest } from '../../../lib/axios/apiRequest';
import Form from '../../../components/Form';
import { useEffect, useState } from 'react';

export default function ResetPassword({ centerStyle, startLoading, stopLoading, navigate, queryParams }) {

    const emailField = {
        "required": true,
        "label": "Email",
        "key": "email",
        "type": "text",
        "componentType": "TextField"
    };

    const passwordField = {
        "required": true,
        "label": "New Password",
        "key": "password",
        "type": "password",
        "componentType": "TextField"
    };

    const [fields, setFields] = useState([emailField]);
    const { token } = queryParams;

    const handleSubmit = async ({ payload }) => {
        if (token) {
            payload.resetPwdToken = token;
            await apiRequest({ method: 'post', endPoint: '/users/update', payload, notify: true, startLoading, stopLoading });
        } else {
            await apiRequest({ method: 'post', endPoint: '/users/reset-password', payload, notify: true, startLoading, stopLoading });
        }
    };

    useEffect(() => {
        console.log(token);
        if (token) {
            setFields(JSON.parse(JSON.stringify([emailField, passwordField])));
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Grid container spacing={2} sx={centerStyle}>
            <Grid item xs={10} md={7} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: { xs: 'none', md: 'center' }, maxHeight: '80vh' }}>
                <img alt={"login-pic"} src="https://flash-pact-public.s3.ap-south-1.amazonaws.com/assets/login.png" width="80%" />
            </Grid>
            <Grid item xs={12} md={5}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlined />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Reset Password
                        </Typography>
                        <Form fields={fields} handleSubmit={handleSubmit} submitButtonText='Submit' crudType={'create'} />
                    </Box>
                </Container>
            </Grid>
        </Grid>
    )
}