let input = document.querySelector(".search input");
let searchBtn = document.querySelector(".search button");

let ipAddress = document.querySelector(".ip-address");
let loc = document.querySelector(".location");
let timeZone = document.querySelector(".time-zone");
let isp = document.querySelector(".isp");


//Start request with IP's clint
let req = new XMLHttpRequest();
req.open(
    "GET",
    "https://geo.ipify.org/api/v2/country,city?apiKey=at_zib6DzuoQRcV6JQVg4Zddag2xrtOW&ipAddress="
    );
req.send();

let  map;
let marker;
req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        let jsData = JSON.parse(this.responseText);
        printIpInformation(jsData);

        //Set location of the clint based on his/her` latitude and longitude coordinates
        map = L.map("map").setView([jsData.location.lat, jsData.location.lng], 13);

        //Set image map
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

//         // Set Icon Location
//         var myIcon = L.icon({
//         iconUrl: "../images/icon-location.svg",
//         iconSize: [50, 54],
//         iconAnchor: [25, 27],
//         popupAnchor: [-3, -76]
//          });
//
//         // Put Icon Location to the map based on Clint's coordinates
//         marker = L.marker([jsData.location.lat, jsData.location.lng], {
//         icon: myIcon,
//         }).addTo(map);
        
        
//         Set Default Marker
        marker = L.marker([jsData.location.lat, jsData.location.lng]).addTo(map);
        
    }
};

//When Search Button is clicked
searchBtn.onclick = () => {
    if (
        input.value != "" &&
        input.value.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/g)
    ) {
        //Remove Error styles if they exist
        input.style.color = "black";
        input.classList.remove("err-input");

        //Start the request with an IP that entered
        let req = new XMLHttpRequest();
        req.open(
        "GET",
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_zib6DzuoQRcV6JQVg4Zddag2xrtOW&ipAddress=${input.value}`
        );
        req.send();

        req.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                printIpInformation(JSON.parse(this.responseText));
                //Call location function to print the location of the IP's that entered
                updateLocation(JSON.parse(this.responseText));
            }
        };
    } else {
        //Add Error styles
        input.style.color = "red";
        input.className = "err-input";
    }
};

    //Print IP's information in info box
    function printIpInformation(jsData) {
        //Print the info
        ipAddress.innerHTML = jsData.ip;
        loc.innerHTML =
        jsData.location.country +
        ", " +
        jsData.location.region +
        ", " +
        jsData.location.city;
        timeZone.innerHTML = jsData.location.timezone;
        isp.innerHTML = jsData.isp;
    }

    // Update the location of the specific IP
    function updateLocation(jsData) {
            map.flyTo(new L.LatLng(jsData.location.lat, jsData.location.lng), 13, {duration: 2});
            marker.setLatLng([jsData.location.lat, jsData.location.lng]);
    }
