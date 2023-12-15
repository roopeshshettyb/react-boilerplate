import { Grid } from "@mui/material";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/axios/apiRequest";
import PopUp from "../../../components/PopUpComponent";
import { ListingCard } from "../../../components/ListingCard";
const localizer = momentLocalizer(moment);

export default function ListingsCalendar({ user, startLoading, stopLoading, navUser, demoData, constants }) {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [listing, setListing] = useState(null);

    const handleNavigate = (newDate) => {
        const currentMonth = currentDate.getMonth() + 1;
        const newMonth = newDate.getMonth() + 1;
        if (newMonth !== currentMonth) setCurrentDate(newDate);
    };

    useEffect(() => {
        async function fetchData() {
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Add 1 to get one-based month
            const year = currentDate.getFullYear();
            const formattedDate = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}-${year}`;
            const response = await apiRequest({ method: 'get', endPoint: `/calendar?start=${formattedDate}`, token: user.token, startLoading, stopLoading });
            if (response.success) {
                let dbEvents = response.data;
                dbEvents.forEach(event => {
                    event.start = new Date(event.start);
                    event.end = new Date(event.end);
                });
                setEvents(dbEvents);
                stopLoading();
            }
        }
        if (navUser) {
            fetchData();
        } else {
            let demoEvents;
            if (user.role === constants.MODEL_DEFAULTS.ROLES.TPO) {
                demoEvents = [...demoData.calendarEvents, ...demoData.statisticEvents];
            } else {
                demoEvents = demoData.calendarEvents;
            }
            demoEvents.forEach(event => {
                event.start = new Date(event.start);
                event.end = new Date(event.end);
            });
            demoEvents.sort((a, b) => {
                if (a.start.getTime() === b.start.getTime()) {
                    return a.end.getTime() - b.end.getTime();
                }
                return a.start.getTime() - b.start.getTime();
            });
            setEvents(demoEvents);
        }
        // eslint-disable-next-line
    }, [currentDate]);

    function CustomEvent({ event }) {
        let gridStyle = {};
        if (event.title.includes('ASPIRANTS PLACED')) {
            gridStyle = { backgroundColor: 'green' }
        }
        return <Grid style={gridStyle}>
            <Grid style={{ fontSize: '10pt' }} >{event.title}</Grid>
        </Grid>
    };

    const handleEventClick = async (event) => {
        if (event.listingId && navUser) {
            const response = await apiRequest({ method: 'get', endPoint: `/common-services/listings/${event.listingId}`, token: user.token });
            if (response.success) setListing(response.data);
        } else if (event.listingId) {
            const index = events.findIndex(ele => { return event.listingId === ele.listingId });
            setListing(events[index].listingDetails);
        }
    };
    const handleEventClose = () => {
        setListing(null);
    };

    return (
        <Grid container spacing={2}>
            <Grid item md={12}>
                <Calendar
                    views={["day", "agenda", "work_week", "month"]}
                    selectable
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "88vh" }}
                    components={{
                        event: CustomEvent,
                    }}
                    onNavigate={handleNavigate}
                    onSelectEvent={handleEventClick}
                />
            </Grid>
            <Grid style={{ zIndex: 9999 }}>
                {listing && <PopUp CustomContent={<ListingCard listing={listing} />} handleClose={handleEventClose} />}
            </Grid>
        </Grid>
    )
}