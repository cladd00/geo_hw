var query2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

function createMap(earthquakePoints,tectonicLayer){
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoicnVwYWxpbWF5ZWthciIsImEiOiJjamZvanN3d2owM3lpMndwOXh1cGRvbHV0In0.YRNJn4K6zkxPv_kORZ_TVg"); 

    var outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoicnVwYWxpbWF5ZWthciIsImEiOiJjamZvanN3d2owM3lpMndwOXh1cGRvbHV0In0.YRNJn4K6zkxPv_kORZ_TVg");

    var baseMaps = {
        "satellite":satellite,
        "outdoor":outdoor
    };

    var earthquakeLayer = L.heatLayer(earthquakePoints,{minOpacity:0.5});

    var myMap = L.map("heatmap",{
        center:[23.113592,-82.366592],
        zoom:5,
        maxBounds:[[90,180],[-90,180]],
        layers:satellite,outdoor
    });

    var overlayMaps = {
        earthquakes:earthquake,
        faultlines:tectonicLayer
    };

    L.control.layers(baseMaps,overlayMaps,{
        collapsed:false
    }).addTo(myMap);
}

function createFeatures(earthquakeData, tectonicData){
    console.log("EarthquakeData ",earthquakeData);

    var earthquakePoints = [];
    for(var i=0; i<earthquakeData.length;i++){
        earthquakePoints.push(earthquakeData[i].geometry.coordinates);
    }
    earthquakePoints = earthquakePoints.map(function(point){return[point[1],point[0],point[2]];});
    var tectonicLayer = L.geoJson(tectonicData,{
        style:function(feature){
            return{color:"orange",weight:1,fillOpacity:0};
        }
    });

    createMap(earthquakePoints,tectonicLayer);
};

d3.json(query2,function(data){
    console.log(data.features);

    d3.json("data/tectonic.json",function(json){
        console.log("Tectonic Data: ",json);
        createFeatures(data.features,json.features);
    });
});