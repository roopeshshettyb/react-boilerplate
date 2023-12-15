
import { CircularProgress, Grid } from "@mui/material";

export default function LoadingOverlay() {
    return (
        <Grid
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <CircularProgress color="success" thickness={7} size="14rem" />
        </Grid>
    );
};