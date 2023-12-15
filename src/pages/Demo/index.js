import { Button, Fab, Grid } from "@mui/material";
import { useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import AspirantLanding from "../general/landing/aspirant";
import TpoLanding from "../general/landing/tpo";

export default function Demo({ centerStyle, constants, startLoading, stopLoading, demoData, user }) {

    const listings = demoData.listings;

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

    const [popupLabelDetails, setPopupLabelDetails] = useState(true);
    const [guestRole, setGuestRole] = useState(null);

    const chooseRole = (role) => {
        setGuestRole(role);
        user.role = role;
        setPopupLabelDetails(null);
    }

    const RolePopUp = () => {
        return <Grid>
            {popupLabelDetails &&
                <Grid item xs={12} md={12} style={popupGridStyle} key={popupLabelDetails.key}>
                    <Grid style={popupStyle}>
                        <Grid container style={centerStyle} spacing={2}>
                            <Grid item xs={9} md={11} style={{
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'left',
                                alignItems: 'center'
                            }}>
                                What role would you like to use Flash Pact as?
                            </Grid>
                            <Grid item md={1} style={{ cursor: 'pointer', ...centerStyle }}>
                                <CancelIcon onClick={() => { setPopupLabelDetails(null); }} />
                            </Grid>
                            <Grid item md={12} style={{ ...centerStyle, paddingBottom: '20px' }}>
                                <Button variant="contained" onClick={() => { chooseRole(constants.MODEL_DEFAULTS.ROLES.ASPIRANT) }}>
                                    Job Aspirant
                                </Button>
                                <Grid style={{ paddingLeft: '10px' }}>
                                    <Button variant="contained" onClick={() => { chooseRole(constants.MODEL_DEFAULTS.ROLES.TPO) }}>
                                        Placement Officer
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        * Please note that only limited functionality is enabled in the demo and some buttons will not work.
                    </Grid>
                </Grid>
            } </Grid>
    }

    const ChangeRoleFab = () => {
        return <Fab variant="extended" onClick={() => { setPopupLabelDetails(true); }} style={{
            position: 'absolute',
            bottom: 40,
            right: 40, backgroundColor: '#1976d2', borderRadius: '12px', color: 'white'
        }}>
            Change Role
        </Fab>
    }

    return (
        <Grid>
            <RolePopUp />
            <ChangeRoleFab />
            {guestRole === constants.MODEL_DEFAULTS.ROLES.ASPIRANT &&
                <AspirantLanding user={user} constants={constants} startLoading={startLoading} stopLoading={stopLoading} demoListings={listings} />
            }
            {guestRole === constants.MODEL_DEFAULTS.ROLES.TPO &&
                <TpoLanding user={user} constants={constants} startLoading={startLoading} stopLoading={stopLoading} demoListings={listings} />
            }
        </Grid>
    )
}