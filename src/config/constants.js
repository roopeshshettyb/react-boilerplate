const environmentData = process.env;

const constants = {
    ROUTES: {
        USERS: {
            DEFAULT: "users",
            RESET_PASSWORD: "reset-password",
            LOGIN: "login",
            REGISTER: "register",
            LOGOUT: "logout",
            UPDATE: "update"
        },
        INSTITUTES: {
            DEFAULT: "institutes",
            CREATE: "create",
            MANAGE_ASPIRANTS: "manage/aspirants",
            EDIT_ASPIRANTS: "edit/aspirant",
            UPLOAD_ASPIRANTS: "upload/aspirants"
        },
        LISTINGS: {
            DEFAULT: "listings",
            VIEW: "view",
            CREATE: "create",
            APPLIED_LISTINGS: "view/applied",
            APPLY: "apply",
            UPDATE: "update",
            UPDATE_ASPIRANT_STAGES: "update/stages",
            CALENDAR: "calendar",
            ANALYSIS: "analysis"
        }
    },
    API_URL: environmentData.REACT_APP_API_URL
}

export default constants;