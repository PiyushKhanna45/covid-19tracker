import { useState, useEffect } from "react"
import './App.css';
import Infobox from './components/InfoBox'
import Map from './components/Map'
import Table from './components/Table'
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core"
import { sortData, prettyPrintStat } from "./components/utils"
import LineGraph from "./components/LineGraph"
import "leaflet/dist/leaflet.css"
import PageFooter from "./components/PageFooter"

function App() {

    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({
        lat: 20, lng: 77
    });
    const [mapZoom, setMapZoom] = useState(4);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases");

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country,
                        value: country.countryInfo.iso2
                    }));

                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setCountries(countries);
                    setMapCountries(data);


                })
        }
        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`

        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);
                console.log("Here is the object", data);
                // setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long});
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                // console.log("LAT : ", data.countryInfo.lat, "Long : ", data.countryInfo.long)
                setMapZoom(4);



            });
    };

    return (
        <div className="mainApp">
            <div className="app" >
                <div className="app__left" >
                    <div className="app__header" >
                        <h1> Covid - 19 Tracker </h1>
                        <FormControl >
                            <Select className="app__dropdown" variant="outlined" value={country} onChange={onCountryChange}>
                                <MenuItem value="worldwide" > Worldwide </MenuItem>
                                {
                                    countries.map(country => (<MenuItem value={country.value} > { country.name} </MenuItem>))

                                }
                            </Select>
                        </FormControl>
                    </div>

                    <div className="app__stats" >
                        {/* Infobox  cases */}
                        <Infobox
                            isRed
                            active={casesType === "cases"}
                            onClick={e => setCasesType("cases")}
                            title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />

                        {/* Infobox  recoveries */}
                        <Infobox
                            active={casesType === "recovered"}
                            onClick={e => setCasesType("recovered")}
                            title="Recovered" total={prettyPrintStat(countryInfo.recovered)} cases={prettyPrintStat(countryInfo.todayRecovered)} />

                        {/* Infobox  deaths */}
                        <Infobox
                            isRed
                            active={casesType === "deaths"}
                            onClick={e => setCasesType("deaths")}
                            title="Deaths" total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)} />

                    </div>

                    <Map
                        casesType={casesType}
                        countries={mapCountries}
                        center={mapCenter}
                        zoom={mapZoom}
                    />
                </div>


                <Card className="app__right" >
                    {/* TABLE */}
                    <CardContent>
                        <h3>Live cases by country</h3>
                        <Table countries={tableData} />
                        <h3 className="graphHeading">Worldwide new {casesType}</h3>
                        {/* GRAPH */}
                        <LineGraph casesType={casesType} />
                    </CardContent>
                </Card>

            </div>
            <PageFooter className="footer_details" />
        </div>
    );
}

export default App;