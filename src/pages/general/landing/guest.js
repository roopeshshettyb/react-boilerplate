import SmoothScroll from "smooth-scroll";
import { Grid, Typography, Paper, Button, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InsightsIcon from '@mui/icons-material/Insights';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 1000,
    speedAsDuration: true,
});
export default function GuestLanding({ centerStyle, navigate }) {

    const backgroundImageStyle = {
        backgroundImage: 'url("/introduction3.jpg")', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '92vh',
        opacity: '0.8'
    };

    const transparentPaperStyle = {
        background: 'rgba(255, 255, 255, 0.3)', // Transparent background with 0.5 opacity
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

    const Introduction = () => {
        return <Grid container justifyContent="center" alignItems="center" style={backgroundImageStyle} id="introduction">
            <Grid item>
                <Paper elevation={10} style={{ ...transparentPaperStyle, ...centerStyle }}>
                    <Typography variant="h2">
                        {'The future of placements in your college with a click!'.toUpperCase()}
                    </Typography>
                    <Typography variant="h5" style={{ ...centerStyle }}>
                        More companies, more jobs, more offers in a Flash
                    </Typography>
                    <Button onClick={() => { navigate('/demo') }} style={{ fontSize: '30pt', cursor: 'pointer', color: 'blue' }}>
                        free demo
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    }

    const featureImageStyle = {
        backgroundImage: 'url("/features3.png")', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '85vh',
        opacity: '0.8'
    };

    const featurePaperStyle = {
        background: 'rgba(255, 255, 255, 0)', // Transparent background with 0.5 opacity
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Gabarito, sans-serif'
    };

    const featureIconStyle = {
        fontSize: 80
    };

    const features = [{
        name: 'Valuable Insights',
        description: 'Instantly analyze and view the placement statistics of your institute!',
        icon: <InsightsIcon style={featureIconStyle} />,
        link: '/demo/listings/analysis'
    }, {
        name: 'Placement Events',
        description: 'Instantly see the on going drives and students placed by the day!',
        icon: <CalendarMonthIcon style={featureIconStyle} />,
        link: '/demo/listings/calendar'
    }, {
        name: 'Post Jobs',
        description: 'Create Job Listings visible only to your students with a go live time!',
        icon: <WorkOutlineIcon style={featureIconStyle} />,
        link: '/demo/listings/create'
    }, {
        name: 'Seamless Telemetry',
        description: 'Don\'t send another email as Flash Pact keeps all your stake holders updated with prompt notifications!',
        icon: <NotificationsActiveIcon style={featureIconStyle} />
    }, {
        name: 'Onboarding Seconds',
        description: 'Onboard your entire college on to the application and start your placement process in less than an hour!',
        icon: <AccessTimeIcon style={featureIconStyle} />
    },];

    const Features = () => {
        return <Grid container justifyContent="center" alignItems="center" columnSpacing={7} style={featureImageStyle} id="features" padding={2}>
            {features.map(feature => <Grid item md={4}>
                <Paper elevation={10} style={featurePaperStyle}>
                    <Typography variant="h3" style={{ ...centerStyle }}>
                        {feature.name}
                    </Typography>
                    {feature.icon}
                    <Typography variant="h4" style={{ ...centerStyle }}>
                        {feature.description}
                    </Typography>
                    {feature.link && <Button variant="contained" onClick={() => { window.location.href = feature.link }}>  Check it out!</Button>}
                </Paper>
            </Grid>)
            }
        </Grid >
    }

    const contactImageStyle = {
        backgroundImage: 'url("/blue-grad.png")', // Replace with your image path
        // background: 'linear-gradient(to right, #FFD300, #FFD700)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '92vh',
        opacity: '0.85'
    };

    let type = 'desktop';

    const mailLink = (email, name) => type === 'mobile' ? `mailto:${email}?subject=Hey%2C%20${name}` : `https://mail.google.com/mail/?view=cm&to=${email}&su=Hey,${name}`;
    const whatsappLink = (mobile, name) => type === 'mobile' ? `https://api.whatsapp.com/send/?phone=91${mobile}&text=Hi, ${name}. Are you open for some collaboration?&type=phone_number&app_absent=0` : `https://web.whatsapp.com/send/?phone=91${mobile}&text=Hi%2C+${name}.+Are+you+open+for+some+collaboration%3F&type=phone_number&app_absent=0`;
    const mails = [{ email: 'info@flashpact.in', name: 'Flash Pact' }];
    const phones = [{ name: 'Roopesh', number: '8867771953' }]

    const handleWhatsAppClick = (phoneNumber, name) => {
        const whatsappURL = whatsappLink(phoneNumber, name);
        window.open(whatsappURL, '_blank');
    };

    const contactUsPaperStyle = {
        background: 'rgba(255, 255, 255, 0.2)', // Transparent background with 0.5 opacity
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

    const ContactUs = () => {
        return <Grid container justifyContent="center" alignItems="center" style={contactImageStyle} id="contact-us" padding={8}>
            <Grid item>
                <Paper elevation={10} style={contactUsPaperStyle}>
                    <Typography variant="h3" style={{ ...centerStyle }}>
                        Get in touch right away and launch your students towards success!
                    </Typography>
                    <Grid item xs={12} md={12} style={{ justifyContent: 'center', display: 'flex' }}>
                        <Grid container spacing={2} justify="center">
                            {mails.map((mail) => (
                                <Grid item key={mail.email} xs={12} md={12}>
                                    <Typography style={{ fontSize: 75, textAlign: 'center' }}>
                                        <a href={mailLink(mail.email, mail.name)} target="_blank" rel="noopener noreferrer">
                                            {mail.email}
                                        </a>
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} style={{ justifyContent: 'center', display: 'flex' }}>
                        <Grid container alignItems="center" spacing={2}>
                            {phones.map((phone) => (<Grid key={phone.number} item xs={12} md={12} style={{ justifyContent: 'center', display: 'flex' }}>
                                <IconButton onClick={() => handleWhatsAppClick(phone.number, phone.name)}>
                                    <WhatsAppIcon fontSize="large" sx={{ color: 'green', fontSize: 75 }} />
                                    <Typography variant="body1" sx={{ color: 'green', fontSize: 75 }}>+91{phone.number}</Typography>
                                </IconButton>
                            </Grid>))}
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    }

    return (
        <Grid>
            <Introduction />
            <Features />
            <ContactUs />
        </Grid>
    )
}