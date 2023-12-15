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
import { Link } from 'react-router-dom';

export default function Login({ centerStyle, startLoading, stopLoading, navigate }) {

    const fields = [{
        "required": true,
        "label": "Email",
        "key": "email",
        "type": "text",
        "componentType": "TextField"
    }, {
        "required": true,
        "label": "Password",
        "key": "password",
        "type": "password",
        "componentType": "TextField"
    }]

    const handleSubmit = async ({ payload }) => {
        const response = await apiRequest({ method: 'post', endPoint: '/users/login', payload, notify: true, startLoading, stopLoading });
        if (response.success) {
            const user = response.data.dbUser;
            user.token = response.data.token;
            const keysToDelete = ['permissions'];
            for (let key of keysToDelete) {
                delete user[key];
            }
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
        }
    };

    return (
        <Grid container spacing={2} sx={centerStyle}>
            <Grid item xs={10} md={7} sx={{ ...centerStyle, maxHeight: '80vh' }}>
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
                            Login
                        </Typography>
                        <Form fields={fields} handleSubmit={handleSubmit} submitButtonText='Login' crudType={'create'} />
                        <Grid container>
                            <Grid item xs>
                                <Link to="/users/reset-password" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Grid>
        </Grid>
    )
}