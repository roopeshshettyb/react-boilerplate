import { Grid } from "@mui/material"

export default function Footer() {
    return (
        <Grid container sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: { xs: '3vh', md: '1vh' },
            backgroundColor: '#333',
            color: 'white',
            textAlign: 'center',
            position: 'fixed',
            marginTop: 'auto',
            bottom: 0
        }}>
            <Grid item xs={12} md={12} style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                FLASH PACT
            </Grid>
            <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                {/* COPYRIGHT © 2023 FLASH PACT - ALL RIGHTS RESERVED. */}
                UPGRADE YOUR PLACEMENT EXPERIENCE NOW!
            </Grid>
        </Grid>
    )
}