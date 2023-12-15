import { useState, useEffect } from 'react';
import { Grid, MenuItem, Menu, Typography, IconButton, Avatar, ListItemIcon, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import Settings from '@mui/icons-material/Settings';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Logout from '@mui/icons-material/Logout';
import apiConstants from '../../config/apiConstants.json';
import './NavigationBar.css';

export default function NavigationBar({ constants, navUser, centerStyle, navigate, location }) {
    const user = navUser && navUser.name === 'Ramesh Suresh' ? null : navUser;
    const [navigationTabs, setNavigationTabs] = useState([]);
    const tabSpacing = navUser && navUser.name === 'Ramesh Suresh' ? 1 : navUser ? 2 : 1;
    const [anchorEl, setAnchorEl] = useState({});
    const [open, setOpen] = useState({});

    const handleClick = (event, tabName) => {
        setAnchorEl({ ...anchorEl, [tabName]: event.currentTarget });
        setOpen({ ...open, [tabName]: true });
    };


    const handleClose = (tabName) => {
        setAnchorEl({ ...anchorEl, [tabName]: null });
        setOpen({ ...open, [tabName]: false });
    };

    const logout = () => {
        localStorage.removeItem('user');
        navigate(`/${appRoutes.USERS.DEFAULT}/${appRoutes.USERS.LOGIN}`);
    }

    const appRoutes = constants.ROUTES;

    let accountTab = {
        name: user ? user.name : 'Account',
        avatar: true,
        subTabs: [
            {
                name: 'Update Profile',
                path: `/${appRoutes.USERS.DEFAULT}/${appRoutes.USERS.UPDATE}`,
                icon: <Settings fontSize="small" />,
                below: <Divider />
            }, {
                name: 'Logout',
                onClick: logout,
                path: `/${appRoutes.USERS.DEFAULT}/${appRoutes.USERS.LOGIN}`,
                icon: <Logout fontSize="small" />
            },
        ]
    };

    let homeTab = {
        name: 'Home',
        path: '/'
    };

    let dashboardTab = {
        name: 'Dashboard',
        path: '/'
    };

    let guestTabs = [
        homeTab,
        {
            name: 'Demo',
            path: '/demo'
        },
        {
            name: 'About',
            id: '/#introduction'
        },
        {
            name: 'Features',
            id: '/#features'
        },
        {
            name: 'Contact',
            id: '/#contact-us'
        }, {
            name: 'Login',
            path: `/${appRoutes.USERS.DEFAULT}/${appRoutes.USERS.LOGIN}`
        }];

    const userTabs = [
        dashboardTab,
        accountTab
    ];

    let aspirantTab = {
        name: 'Aspirants',
        subTabs: [
            {
                name: 'Manage Aspirants',
                path: `/${appRoutes.INSTITUTES.DEFAULT}/${appRoutes.INSTITUTES.MANAGE_ASPIRANTS}`,
                icon: <Settings fontSize="small" />
            }, {
                name: 'Upload Aspirants',
                path: `/${appRoutes.INSTITUTES.DEFAULT}/${appRoutes.INSTITUTES.UPLOAD_ASPIRANTS}`,
                icon: <FileUploadIcon fontSize="small" />
            },
        ]
    };

    let calendarTab = {
        name: 'Calendar',
        path: `/${appRoutes.LISTINGS.DEFAULT}/${appRoutes.LISTINGS.CALENDAR}`,
    };

    const tpoTabs = [
        dashboardTab,
        calendarTab,
        {
            name: 'Analysis',
            path: `/${appRoutes.LISTINGS.DEFAULT}/${appRoutes.LISTINGS.ANALYSIS}`,
        },
        aspirantTab,
        accountTab
    ];

    const aspirantTabs = [
        dashboardTab,
        calendarTab,
        {
            name: 'Applied Listings',
            path: `/${appRoutes.LISTINGS.DEFAULT}/${appRoutes.LISTINGS.APPLIED_LISTINGS}`,
        },
        accountTab
    ];

    let operations = ['Create', 'Update'];

    let models = constants.MODEL_DEFAULTS.UNIQUE_KEYS;

    const tabStyle = {
        ...centerStyle,
        alignItems: 'center'
    };
    const tabTextStyle = {
        textDecoration: 'none',
        color: 'black'
    };

    useEffect(() => {

        const adminTabs = [];

        if (user && user.role === constants.MODEL_DEFAULTS.ROLES.ADMIN) {
            for (let operation of operations) {
                let tab = {
                    name: operation,
                    subTabs: []
                }
                for (let key of Object.keys(models)) {
                    tab.subTabs.push({
                        name: key,
                        path: `/admin/crud/${operation.toLowerCase()}/${models[key]}`
                    });
                }
                adminTabs.push(tab);
            }
        }

        let navigationTabs = user && user.id ? userTabs : guestTabs;

        if (user && user.role) {
            switch (user.role) {
                case apiConstants.MODEL_DEFAULTS.ROLES.TPO:
                    navigationTabs = tpoTabs;
                    break;
                case apiConstants.MODEL_DEFAULTS.ROLES.ASPIRANT:
                    navigationTabs = aspirantTabs;
                    break;

                case apiConstants.MODEL_DEFAULTS.ROLES.ADMIN:
                    navigationTabs = [...navigationTabs, ...adminTabs];
                    break;
                default:
                    break;
            }
        }
        setOpen({});
        setAnchorEl({});
        setNavigationTabs(navigationTabs);
        // eslint-disable-next-line
    }, [user])

    return (
        <Grid container justifyContent={'center'} sx={{
            display: { xs: 'none', md: 'flex' }, height: '55px', border: '1px solid #e0e0e0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            position: 'fixed',
            background: 'white',
            zIndex: 9999999
        }} spacing={0} >
            <Grid item xs={4} md={2} onClick={() => { navigate('/') }} style={{ ...tabStyle, cursor: 'pointer' }} key={'home'} className="tab-item">
                <Typography style={{ fontSize: '18pt', fontWeight: 'bold' }}>FLASH PACT</Typography>
            </Grid>
            {navigationTabs.map((tab) => {
                if (!tab.subTabs && !tab.id) {
                    return (
                        <Grid item xs={4} md={tabSpacing} style={tabStyle} key={tab.name}>
                            <Grid key={tab.name} style={{ paddingBottom: '6px', paddingTop: '6px' }} className="tab-item">
                                {tab.path && (
                                    <Link to={tab.path} style={tabTextStyle}>
                                        {tab.name.toUpperCase()}
                                    </Link>
                                )}
                                {tab.onClick && (
                                    <Typography onClick={() => tab.onClick()} style={tabTextStyle}>
                                        {tab.name.toUpperCase()}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    )
                } else if (tab.subTabs) {
                    return (
                        <Grid item xs={4} md={tabSpacing} style={{ ...tabStyle }} key={tab.name} >
                            <IconButton
                                onMouseOver={(event) => handleClick(event, tab.name)}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={Object.keys(open).length > 0 && open[tab.name] ? open[tab.name] : false}
                                aria-haspopup="true"
                                aria-expanded={Object.keys(open).length > 0 && open[tab.name] ? open[tab.name] : false}
                            >
                                <Grid sx={{ paddingRight: '7px' }} >
                                    {tab.avatar && <Avatar sx={{ width: 27, height: 27 }}><Typography style={{ fontFamily: 'Gabarito, sans-serif' }}>{user && user.name.slice(0, 1).toUpperCase()}</Typography></Avatar>}
                                </Grid>
                                <Grid>
                                    <Typography style={tabTextStyle}>{tab.name.toUpperCase()}</Typography>
                                </Grid>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl[tab.name]}
                                id={tab.name}
                                open={Object.keys(open).length > 0 && open[tab.name] ? open[tab.name] : false}
                                onClose={() => handleClose(tab.name)}
                                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                style={{ zIndex: 99999999 }}
                                disableScrollLock={true}
                            >
                                <Grid onMouseLeave={() => { handleClose(tab.name) }}>
                                    {tab.subTabs.map((subTab) => {
                                        return (
                                            <Grid key={subTab.name} onClick={subTab.onClick ? () => subTab.onClick() : undefined}>
                                                <Link to={subTab.path} style={{ ...tabTextStyle, color: 'black' }}>
                                                    <MenuItem>
                                                        {subTab.icon && <ListItemIcon>
                                                            {subTab.icon}
                                                        </ListItemIcon>}
                                                        <Typography>
                                                            {subTab.name.toUpperCase()}
                                                        </Typography>
                                                    </MenuItem>
                                                </Link>
                                                {subTab.below ? subTab.below : null}
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </Menu>
                        </Grid>)
                } else {
                    return (
                        <Grid item xs={4} md={tabSpacing} style={tabStyle} key={tab.name}>
                            <Grid key={tab.name} style={{ paddingBottom: '6px', paddingTop: '6px' }} className="tab-item">
                                {tab.id && (
                                    <a href={tab.id} style={tabTextStyle}>
                                        {tab.name.toUpperCase()}
                                    </a>
                                )}
                            </Grid>
                        </Grid>
                    )
                }
            })}

        </Grid>
    );
}