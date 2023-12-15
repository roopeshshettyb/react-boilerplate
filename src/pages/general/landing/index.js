import GuestLanding from "./guest";
import UserLanding from "./user";

export default function LandingPage(props) {
    return (
        <div>
            {(!props.user || props.user.name === 'Ramesh Suresh') && <GuestLanding {...props} />}
            {props.user && props.user.name !== 'Ramesh Suresh' && <UserLanding {...props} />}
        </div>
    )
}