import { Grid } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

export default function PopUp({ CustomContent, handleClose }) {
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
    return (
        <Grid item xs={12} md={12} style={popupGridStyle}>
            <Grid style={popupStyle}>
                <Grid item xs={1} md={12} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'right', paddingBottom: '2vh' }}>
                    <CancelIcon onClick={handleClose} />
                </Grid>
                {CustomContent}
            </Grid>
        </Grid>
    )
}