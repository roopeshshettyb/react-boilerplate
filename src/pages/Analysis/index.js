import { Grid, Typography } from "@mui/material"
import Form from "../../components/Form";
import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/axios/apiRequest";
import PopUp from '../../components/PopUpComponent';
import { Chart } from "react-google-charts";
import WordCloud from "../../components/WordCloud";

const defaultChartData = {
    "Sankey": [
        ["From", "To", "Aspirants"],
        ["BTECH", "ECE", 150],
        ["BTECH", "CSE", 1000],
        ["MTECH", "ECE", 145],
        ["MTECH", "CSE", 150],
        ["CSE", "Not Allowed For Placements", 77],
        ["CSE", "Allowed for Placements", 1073],
        ["ECE", "Allowed for Placements", 282],
        ["ECE", "Not Allowed For Placements", 13],
        ["Allowed for Placements", "Applied for Listings", 1173],
        ["Allowed for Placements", "Did not apply for Listings", 177],
        ["Applied for Listings", "Received Offers", 833],
        ["Applied for Listings", "No Offers", 240]
    ],
    "TreeMap": [
        ["Degree", "Parent", "Aspirants"],
        ["All Degrees => 1915 Aspirants", null, 1445],
        ["MTECH => 295 Aspirants", "All Degrees => 1915 Aspirants", 295],
        ["BTECH => 1150 Aspirants", "All Degrees => 1915 Aspirants", 1150],
        ["BSC => 470 Aspirants", "All Degrees => 1915 Aspirants", 1150],
        ["MTECH-ECE => 145 Aspirants", "MTECH => 295 Aspirants", 145],
        ["MTECH-CSE => 150 Aspirants", "MTECH => 295 Aspirants", 150],
        ["BTECH-ECE => 150 Aspirants", "BTECH => 1150 Aspirants", 150],
        ["BTECH-CSE => 1000 Aspirants", "BTECH => 1150 Aspirants", 1000]
    ],
    "PieChart": [
        ["Category", "Aspirants"],
        ["Did not apply for Listings", 177],
        ["Received Offers", 833],
        ["No Offers", 240]
    ],
    "Scatter": [
        ["Number of Listings", "CTC IN LPA"],
        [10, 14],
        [40, 3],
        [6, 54],
        [8, 37],
        [9, 20],
        [3, 25],
        [35, 25],
        [5, 5],
        [30, 22],
        [20, 15],
        [20, 18]
    ],
    "WordCloud": [
        { "weight": 370, "word": "Engineer" },
        { "weight": 200, "word": "Developer" },
        { "weight": 150, "word": "Manager" },
        { "weight": 120, "word": "Analyst" },
        { "weight": 100, "word": "Designer" },
        { "weight": 90, "word": "Scientist" },
        { "weight": 80, "word": "Architect" },
        { "weight": 70, "word": "Consultant" },
        { "weight": 60, "word": "Specialist" },
        { "weight": 50, "word": "Coordinator" },
        { "weight": 40, "word": "Administrator" },
        { "weight": 35, "word": "Supervisor" },
        { "weight": 30, "word": "Programmer" },
        { "weight": 25, "word": "Technician" },
        { "weight": 20, "word": "Executive" },
        { "weight": 15, "word": "Officer" },
        { "weight": 14, "word": "Planner" },
        { "weight": 13, "word": "Strategist" },
        { "weight": 12, "word": "Researcher" },
        { "weight": 11, "word": "Marketer" },
        { "weight": 10, "word": "Writer" },
        { "weight": 9, "word": "Data Analyst" },
        { "weight": 8, "word": "UX Designer" },
        { "weight": 7, "word": "Product Manager" },
        { "weight": 6, "word": "Machine Learning Engineer" },
        { "weight": 5, "word": "Frontend Developer" },
        { "weight": 4, "word": "Backend Developer" },
        { "weight": 3, "word": "Data Scientist" },
        { "weight": 2, "word": "Business Analyst" },
        { "weight": 1, "word": "System Administrator" }
    ]
}

export default function Analysis({ constants, user, startLoading, stopLoading, centerStyle, navUser }) {

    const listingFields = constants.FORM_FIELDS.CREATE[constants.MODEL_DEFAULTS.UNIQUE_KEYS.LISTINGS];
    const [fields, setFields] = useState([]);
    const [popUp, setPopUp] = useState(false);
    const [chartData, setChartData] = useState(defaultChartData);

    async function getFilterOptions() {
        listingFields[1].componentType = "MultipleSelect";
        let defaultFields = [listingFields[1], listingFields[2], {
            "required": false,
            "label": "Start Date",
            "key": "startDate",
            "componentType": "TextField",
            "type": "date"
        }, {
            "required": false,
            "label": "End Date",
            "key": "endDate",
            "componentType": "TextField",
            "type": "date"
        }];
        let degrees = [];
        let branches = [];
        const degreeResponse = await apiRequest({ method: 'get', endPoint: `/common-services/aspirants/all?attributes=${JSON.stringify(['degree'])}&group=${JSON.stringify(['degree'])}&instituteId=${user.instituteId}`, startLoading });
        if (degreeResponse.success) {
            const degreeData = [];
            degreeResponse.data.data.forEach(degree => {
                if (degree.degree && degree.degree.length > 0) {
                    degreeData.push(degree.degree)
                }
            });
            degrees = (degreeData);
        }
        const branchResponse = await apiRequest({ method: 'get', endPoint: `/common-services/aspirants/all?attributes=${JSON.stringify(['branch'])}&group=${JSON.stringify(['branch'])}&instituteId=${user.instituteId}` });
        if (branchResponse.success) {
            const branchData = [];
            branchResponse.data.data.forEach(branch => {
                if (branch.branch && branch.branch.length > 0) {
                    branchData.push(branch.branch)
                }
            });
            branches = (branchData);
        }
        let formField = {
            "required": true,
            "label": "Degree",
            "key": "degree",
            "options": degrees,
            "componentType": "MultipleSelect"
        };
        defaultFields.push(formField);
        formField = JSON.parse(JSON.stringify(formField));
        formField.options = branches;
        formField.label = 'Branch';
        formField.key = 'branch';
        defaultFields.push(formField);
        setFields(defaultFields);
    }

    async function getChartData() {
        const response = await apiRequest({ method: 'get', endPoint: `/analysis`, token: user.token });
        if (response.success) {
            setChartData({ ...chartData, ...response.data });
        }
    }

    useEffect(() => {
        async function fetchData() {
            await getFilterOptions();
            await getChartData();
            stopLoading();
        }
        if (navUser) {
            fetchData();
        } else {
            startLoading();
            setTimeout(() => {
                stopLoading();
            }, 1500)
        }
        // eslint-disable-next-line 
    }, [])

    const handleSubmit = ({ payload }) => {
        console.log(payload);
    }

    const handleClose = () => {
        setPopUp(false);
    }

    const colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
        '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];

    const chartMeta = [{
        chartType: "WordCloud"
    }, {
        chartType: "Sankey",
        height: "60vh",
        title: "Placement Funnel",
        options: {
            sankey: {
                node: {
                    colors: colors
                },
                link: {
                    colorMode: 'gradient',
                    colors: colors
                }
            }
        }
    }, {
        chartType: "TreeMap",
        height: "60vh",
        title: "Head Count",
        options: {
            minColor: '#d5a6a6',  // Darker pastel color for the lowest values
            midColor: '#f7f7f7',  // Define a middle color if needed
            maxColor: '#a6d5a6',  // Darker pastel color for the highest values
            headerHeight: 15,
            fontColor: "black",
            showScale: true
        }
    }, {
        chartType: "PieChart",
        height: "60vh",
        colors: ['#FFDDC1', '#FFABAB', '#FFC3A0', '#FF677D'],
        title: "Placement Status",
        options: {
            is3D: true
        },
        md: 6
    }, {
        chartType: "Scatter",
        height: "60vh",
        title: "CTC Ranges",
        options: {
        },
        md: 6
    },];

    const CustomChart = ({ data, chartType, options, height, title, md = 10 }) => {
        let gridMd = md ? md : 10;
        return <>
            <Grid item md={gridMd} >
                <Typography style={{ fontSize: '30pt', ...centerStyle }}>
                    {title}
                </Typography>
                <Chart
                    chartType={chartType}
                    height={height}
                    data={data}
                    options={options}
                />
            </Grid></>
    }

    return (
        <Grid container style={centerStyle} spacing={2}>
            {/* <Grid item md={12} style={{ display: 'flex', justifyContent: 'right' }}>
                <Button onClick={() => { setPopUp(true); }} variant="outlined">Filter</Button>
            </Grid> */}
            {chartData && chartMeta && chartMeta.map(chart => {
                if (chart.chartType !== 'WordCloud') {
                    return (
                        <CustomChart data={chartData[chart.chartType]} chartType={chart.chartType} options={chart.options} height={chart.height} title={chart.title} md={chart.md} />
                    )
                } else {
                    return <Grid item md={12} ><WordCloud words={chartData[chart.chartType]} />   </Grid>
                }
            })}
            <Grid item md={12}>
                {popUp && <PopUp handleClose={handleClose} CustomContent={<Form fields={fields} handleSubmit={handleSubmit} containerStyle={{ width: '50vw' }} />} />}
            </Grid>
        </Grid>
    )
}