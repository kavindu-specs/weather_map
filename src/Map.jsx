import React, { useState, useEffect } from "react";
//import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import { connect } from "react-redux";
import "./Map.css";




function Map() {

    const [topology, setTopology] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    const [reloadCounter, setReloadCounter] = useState(0);

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         // Increment the reload counter every 30 seconds
    //         setReloadCounter(prevCounter => prevCounter + 1);
    //     }, 30000);

    //     return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
    // }, []);

    // useEffect(() => {
    //     if (reloadCounter > 0) {
    //         // Reload the app after 30 seconds
    //         setTimeout(() => {
    //             window.location.reload();
    //         }, 30000);
    //     }
    // }, [reloadCounter]);

    useEffect(() => {
        const fetchData = async () => {

           try{
            const response1 = await fetch('https://code.highcharts.com/mapdata/countries/lk/lk-all.geo.json');
            const topologyData = await response1.json();
            setTopology(topologyData);

            const response2 = await fetch('https://api.weatherkprs.com/api/v1/weather/all-data',
            {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json', 
                    'api-key': 'nci3c389cqenqweklqjwbc29he8q3rcwqerchbbhjbcwqecb1983eqjbhc',
                     'client-id':"web-map-client"
                }
            }
            );
           // console.log(response2)
            const responseData = await response2.json();
            setWeatherData(responseData)

           }catch(err){
            setError(error);
           }
        
        }
        fetchData();
        const intervalId = setInterval(fetchData, 30000);

        return () => clearInterval(intervalId); 

    },[])


    const codes = [
        'lk-bc', 'lk-mb', 'lk-ja', 'lk-kl',
        'lk-ky', 'lk-mt', 'lk-nw', 'lk-ap',
        'lk-pr', 'lk-tc', 'lk-ad', 'lk-va',
        'lk-mp', 'lk-kg', 'lk-px', 'lk-rn',
        'lk-gl', 'lk-hb', 'lk-mh', 'lk-bd',
        'lk-mj', 'lk-ke', 'lk-co', 'lk-gq',
        'lk-kt'
    ];
   

        let matchedData= []
        if (error) {
            //return <div>Error: {error.message}</div>;
        } else if (!topology || !weatherData) {
            // return <div>Loading...</div>;
        } else {
            matchedData = codes.map(code => {
                const matchedItem = weatherData.data.find(item => item.cityId.highCode === code);
                
                if (matchedItem) {
                    return [
                         matchedItem.cityId.name,
                         matchedItem.temperature,
                         matchedItem.airPressure,
                         matchedItem.humidity
                    ];
                } else {
                    return []; // Handle cases where weather data is not found
                }
            });
            
         } // Update data array with weatherData responses
    
    
   

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Srilanka'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lk/lk-all.topo.json">Sri Lanka</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: matchedData,
            name: 'Wether data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            keys: ['name', 'temperature', 'airPressure','humidity'],
            joinBy: null,
            tooltip: {
                headerFormat: '',
                pointFormatter: function() {
                  var hoverVotes = this.hoverVotes; 
                  return '<b>'+this.name+'</b><br/>' +
                    Highcharts.map([
                      ['Temperature', this.temperature],
                      ['Air Pressure', this.airPressure],
                      ['Humidity', this.humidity]
        
                    ], function(line) {
                      return '<span style="color:' + line[2] +
                        // Colorized bullet
                        '">\u25CF</span> ' +
                        // Party and votes
                        (line[0] === hoverVotes ? '<b>' : '') +
                        line[0] + ': ' +
                        Highcharts.numberFormat(line[1], 2) +
                        (line[0] === hoverVotes ? '</b>' : '') +
                        '<br/>';
                    }).join('')
                },
                style: {
                    fontSize: '40px' // Set the font size here
                }

              },
              
            dataLabels: {
                enabled: true,
                format: '{.key}'
            }
        }]
    });
    
    return (
        <div id="map_container" ></div>
    );
    }
export default Map;