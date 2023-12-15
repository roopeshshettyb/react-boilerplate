import {
    Route, Routes, useNavigate
} from 'react-router-dom';
import { Grid, Paper, Typography } from '@mui/material';
import constants from './config/constants';
import LandingPage from './pages/general/landing';
import NavigationBar from './components/Navigation/NavigationBar';
import Login from './pages/users/login';
// import Footer from './components/Footer';
import frontendConstants from "./config/constants";
import backendConstants from './config/apiConstants.json';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import queryString from 'query-string';
import LoadingOverlay from './components/LoadingOverlay';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useParams, useLocation } from 'react-router-dom';
import AdminCrud from './pages/admin/crud';
import CreateListing from './pages/listings/create';
import UserUpdate from './pages/users/update';
import ManageAspirants from './pages/institutes/ManageAspirants';
import EditAspirant from './pages/institutes/EditAspirant';
import SingleListingView from './pages/listings/SingleView';
import ApplyListing from './pages/listings/Apply';
import UpdateListing from './pages/listings/Update';
import UpdateAspirantStages from './pages/listings/AspirantStages';
import AppliedListings from './pages/listings/AppliedListings';
import UploadAspirants from './pages/institutes/UploadAspirants';
import ResetPassword from './pages/users/Reset-Password';
import Demo from './pages/Demo';
import demoData from './config/demo';
import ListingsCalendar from './pages/listings/Calendar';
import Analysis from './pages/Analysis';

const userRoutes = constants.ROUTES.USERS;
const listingRoutes = constants.ROUTES.LISTINGS;
const instituteRoutes = constants.ROUTES.INSTITUTES;

export default function AppRoutes() {

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = queryString.parse(location.search);

    const centerStyle = { justifyContent: 'center', display: 'flex' };

    const stringifiedUser = localStorage.getItem('user');

    const user = stringifiedUser ? JSON.parse(stringifiedUser) : demoData.user;

    const navUser = location.pathname.includes('demo') ? null : user;

    let constants = { ...frontendConstants, ...backendConstants };

    const startLoading = () => {
        setLoading(true);
    };

    const stopLoading = () => {
        setLoading(false);
    };

    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);

    const customProps = {
        dispatch, useSelector, centerStyle, constants, user, startLoading, stopLoading, navigate, isMobile, useParams, queryParams, location, demoData, navUser
    };

    if (!isMobile) {
        return (
            <>
                <Grid style={{ paddingBottom: '55px' }}>
                    <NavigationBar {...customProps} />
                </Grid>
                <Grid>
                    <Routes>
                        <Route path='/' element={<LandingPage {...customProps} />} />
                    </Routes>
                </Grid>
                <Grid sx={{ padding: { xs: '0px 2px 0px 2px', md: '20px 15px 2vh 15px' } }}>
                    {loading && <LoadingOverlay />}
                    <ToastContainer
                        position="top-right"
                        theme="colored"
                        style={{ padding: isMobile ? '4vh' : '0', zIndex: 999999999 }}
                    />
                    <Routes>
                        <Route path={`/${userRoutes.DEFAULT}`}>
                            <Route path={userRoutes.LOGIN} element={<Login {...customProps} />}></Route>
                            <Route path={userRoutes.UPDATE} element={<UserUpdate {...customProps} />}></Route>
                            <Route path={userRoutes.RESET_PASSWORD} element={<ResetPassword {...customProps} />}></Route>z
                        </Route>
                        {user && user.role === constants.MODEL_DEFAULTS.ROLES.ADMIN &&
                            <Route path={'/admin/crud/:type/:model'} element={<AdminCrud {...customProps} />}></Route>
                        }
                        <Route path={`/${listingRoutes.DEFAULT}`}>
                            <Route path={listingRoutes.CREATE} element={<CreateListing {...customProps} />}></Route>
                            <Route path={`${listingRoutes.VIEW}/:id`} element={<SingleListingView {...customProps} />}></Route>
                            <Route path={`${listingRoutes.APPLY}/:id`} element={<ApplyListing {...customProps} />}></Route>
                            <Route path={`${listingRoutes.UPDATE}/:id`} element={<UpdateListing {...customProps} />}></Route>
                            <Route path={`${listingRoutes.UPDATE_ASPIRANT_STAGES}/:id`} element={<UpdateAspirantStages {...customProps} />}></Route>
                            <Route path={`${listingRoutes.APPLIED_LISTINGS}`} element={<AppliedListings {...customProps} />}></Route>
                            <Route path={`${listingRoutes.CALENDAR}`} element={<ListingsCalendar {...customProps} />}></Route>
                            <Route path={`${listingRoutes.ANALYSIS}`} element={<Analysis {...customProps} />}></Route>
                        </Route>
                        <Route path={`/${instituteRoutes.DEFAULT}`}>
                            <Route path={`${instituteRoutes.MANAGE_ASPIRANTS}`} element={<ManageAspirants {...customProps} />}></Route>
                            <Route path={`${instituteRoutes.EDIT_ASPIRANTS}/:id`} element={<EditAspirant {...customProps} />}></Route>
                            <Route path={`${instituteRoutes.UPLOAD_ASPIRANTS}`} element={<UploadAspirants {...customProps} />}></Route>
                        </Route>

                        {/* DEMO ROUTES START */}

                        <Route path='/demo'>
                            <Route path='' element={<Demo {...customProps} />} />
                            <Route path={`${listingRoutes.DEFAULT}`}>
                                <Route path={listingRoutes.CREATE} element={<CreateListing {...customProps} />}></Route>
                                <Route path={`${listingRoutes.VIEW}/:id`} element={<SingleListingView {...customProps} />}></Route>
                                <Route path={`${listingRoutes.APPLY}/:id`} element={<ApplyListing {...customProps} />}></Route>
                                <Route path={`${listingRoutes.UPDATE}/:id`} element={<UpdateListing {...customProps} />}></Route>
                                <Route path={`${listingRoutes.UPDATE_ASPIRANT_STAGES}/:id`} element={<UpdateAspirantStages {...customProps} />}></Route>
                                <Route path={`${listingRoutes.APPLIED_LISTINGS}`} element={<AppliedListings {...customProps} />}></Route>
                                <Route path={`${listingRoutes.CALENDAR}`} element={<ListingsCalendar {...customProps} />}></Route>
                                <Route path={`${listingRoutes.ANALYSIS}`} element={<Analysis {...customProps} />}></Route>
                            </Route>
                        </Route>

                        {/* DEMO ROUTES END */}

                    </Routes>
                </Grid>
                {/* <Grid sx={{ paddingTop: { xs: '3vh', md: '25px' } }}>
                    <Footer />
                </Grid> */}

            </>
        )
    } else {
        const backgroundImageStyle = {
            backgroundImage: 'url("/under_construction.png")', // Replace with your image path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            opacity: '0.8'
        };

        const transparentPaperStyle = {
            background: 'rgba(255, 255, 255, 0.6)', // Transparent background with 0.5 opacity
            padding: '20px',
            width: '80vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'black',
            fontFamily: 'Gabarito, sans-serif'
        };
        return (
            <Grid container justifyContent="center" alignItems="center" style={backgroundImageStyle} id="introduction">
                <Grid item>
                    <Paper elevation={10} style={{ ...transparentPaperStyle, ...centerStyle }}>
                        <Typography variant="h4">
                            {'The future of placements in your college with a click!'}
                        </Typography>
                        <Typography variant="h6" style={{ ...centerStyle }}>
                            More companies, more jobs, more offers in a Flash
                        </Typography>
                        <Typography variant="h7" style={{ ...centerStyle }}>
                            Site is under construction for mobile. Please check us out on your desktop!
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}