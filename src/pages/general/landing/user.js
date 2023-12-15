import { Grid } from "@mui/material";
import TpoLanding from "./tpo";
import AspirantLanding from "./aspirant";

export default function UserLanding(props) {

    const superContainerStyle = {
        padding: '2vh'
    }

    return (
        <Grid container style={superContainerStyle}>
            {props.user.role === props.constants.MODEL_DEFAULTS.ROLES.TPO && <TpoLanding {...props} />}
            {props.user.role === props.constants.MODEL_DEFAULTS.ROLES.ASPIRANT && <AspirantLanding {...props} />}
        </Grid>
    )
}