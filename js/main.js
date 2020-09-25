'use strict';


//to do:

// range
// haku
//haulla markerin siirtyminen ja pisteiden päivittyminen siihen
// marker merging mitä yritin, ,hyi
//jos on useampia eri lataustyyppejä että näkyy kaikki, for loop tms.
//korjaa tai poista toi hiton kompassi

//glhf





/*let kaytto1 = "";
let kaytto = "";*/
let paikka = null;

//eri kuvake latauspisteille
let greenIcon = L.icon({
    iconUrl: 'kuvat/kuvake.png',
    shadowUrl: 'kuvat/kuvake.png',

    iconSize: [28, 28], // size of the icon
    shadowSize: [0, 0], // size of the shadow
    iconAnchor: [19, 19], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-5, -20] // point from which the popup should open relative to the iconAnchor
});

//punainen kuvake
let defaultIcon = L.icon({
    iconUrl: 'kuvat/default.png',
    iconSize: [25, 41], // size of the icon
    shadowSize: [0, 0], // size of the shadow
    iconAnchor: [12.5, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12.5, 41],  // the same for the shadow
    popupAnchor: [1, -45] // point from which the popup should open relative to the iconAnchor
});

// liitetään kartta elementtiin #map
//const map = L.map('map');
const map = new L.Map('map', {
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'bottomleft'

    }
});

//map.addControl(control.zoom({ position: 'bottomright' }));
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Google tilelayers',
}).addTo(map);
paivitaKartta({latitude: 64, longitude: 24}, 5);

//Satelliittikuva tai no ns hybridi kuva
let googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
let latauspaikatm = L.layerGroup();
let baseMaps = {
    //"Satelliitti": googleSat,
    "Hybridi": googleHybrid,
    "Normaali": map,

};
let overlayMaps = {

        "Latauspaikat": latauspaikatm

}

//minimappi
var osm2 = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 0, maxZoom: 13});
var miniMap = new L.Control.MiniMap(osm2).addTo(map);

// events are fired when entering or exiting fullscreen.
map.on('enterFullscreen', function () {
    console.log('entered fullscreen');
});

map.on('exitFullscreen', function () {
    console.log('exited fullscreen');
});

L.control.layers(baseMaps, overlayMaps).addTo(map);
//loppuu Satelliittikuva

// Asetukset paikkatiedon hakua varten (valinnainen)
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};
//kompassi, huutista
var kompassi =  new L.Control.Compass().addTo(map);

// Funktio, joka ajetaan, kun paikkatiedot on haettu
function success(pos) {
    const crd = pos.coords;
    paikka = crd;

    // Tulostetaan paikkatiedot konsoliin
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    // päivitä kartta
    paivitaKartta(crd, 13);

    // lisää marker
    lisaaMarker(crd, "", {icon: defaultIcon});


    //hae asemat
    //haeLatauspisteet(crd);
    setInterval(function() {
        haeLatauspisteet(crd);
    }, 5000)
}


// funktio, joka keskittää kartan
function paivitaKartta(crd, zoom) {
    map.setView([crd.latitude, crd.longitude], zoom);
}

//a href="#" id="tismus"><div id="navigoi">Navigoi</div></a>
/*
const victor = document.createElement("a");
a.setAttribute("id", "tismus");
a.href = "#";
const timppa = document.createElement("div");
timppa.setAttribute("id", "navigoi");
a.appendChild(timppa);
*/

// funktio, joka tekee markerin
function lisaaMarker(crd, latauspiste = "", kuvake, teksti = "Olen tässä.", usagecost = "", connectiontype = "", osoite = "",
                     kaupunki = "", kordinaattix = crd.latitude, kordinaattiy = crd.latitude, tyyppi = "",
                     acdc = "", käyttö = "", pistokkeet) {


    // try {
    L.marker([crd.latitude, crd.longitude], kuvake).addTo(map).bindPopup("<b>" + teksti + '</b><br> <span class="osoite">' + osoite + ", " + kaupunki + "</span><br>" +
        "<span class='pienempiteksti'>" + kordinaattix + ", " + kordinaattiy + "</span><br><br>" + "<b>Hinta:</b> " + usagecost + "<br>" + "<b>Tyyppi:</b> " + tyyppi +
        "<br><b>Käyttö:</b> " + connectiontype + "<br>" + "<b>AC/DC:</b> " + acdc + "<br><br>" + käyttö + "<br><br> Määrä:" + pistokkeet + "<br>" +
        '<br><a href="#" id="tismus"><div id=\"navigoi\">Navigoi</div></a>').addTo(latauspaikatm)
        .on("click", function () {

            /*  try {
                  document.getElementById("nimi").innerHTML = latauspiste.AddressInfo.Title;
                  document.getElementById("osoite").innerHTML = latauspiste.AddressInfo.AddressLine1;
                  document.getElementById("kaupunki").innerHTML = latauspiste.AddressInfo.Town;
                  document.getElementById("lisatiedot").innerHTML = latauspiste.AddressInfo.AccessComments;
                  //hinta (kesken)
                  document.getElementById("hinta").innerHTML = latauspiste.UsageCost;
                  document.getElementById("provider").innerHTML = latauspiste.Connections[0].Level.Title;
                  document.getElementById('tismus').href = `https://www.google.com/maps/dir/?api=1&origin=${paikka.latitude},${paikka.longitude}&destination=${crd.latitude},${crd.longitude}&travelmode=driving`;
              } catch (e) {
                  // console.error(e.message);
              }*/
            document.getElementById('tismus').href = `https://www.google.com/maps/dir/?api=1&origin=${paikka.latitude},${paikka.longitude}&destination=${crd.latitude},${crd.longitude}&travelmode=driving`;


        })
    // L.marker.style.filter = 'hue-rotate(180deg)';
    //.openPopup();
    //} catch(error){}
}

// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Käynnistetään paikkatietojen haku
navigator.geolocation.getCurrentPosition(success, error, options);

//slideri
let rangeslider = document.getElementById("sliderRange");
let output = document.getElementById("demo");
output.innerHTML = rangeslider.value;
output.value
rangeslider.oninput = function arvoja(arvot) {
    arvot = output.innerHTML = this.value;
   //arvot.
    console.log(arvot);
}

let testailu = output.innerHTML;

/*
let rasmus =  document.getElementById("sliderRange").value

rasmus.addEventListener(function() {

})*/
let rasmus = 1;

//openchargemap
function haeLatauspisteet(crd) {


    fetch(
        `https://api.openchargemap.io/v3/poi/?distanceunit=KM&distance=${rangeslider.value}&latitude=${crd.latitude}&longitude=${crd.longitude}&maxresults=250`).then(function (vastaus) {
        console.log('palvelimen vastaus', vastaus);
        return vastaus.json();
        //appendData(vastaus);
    })
        .then(function (latauspisteet) {
            console.log('tulos', latauspisteet);

            for (let i = 0; i < latauspisteet.length; i++) {

                const lpPaikka = {
                    latitude: latauspisteet[i].AddressInfo.Latitude,
                    longitude: latauspisteet[i].AddressInfo.Longitude,
                    greenIcon,
                };

                /*    for(let j = 0; j < latauspisteet[i].Connections[j].ConnectionType; j++) {
                        const taulukko = [j];
                        console.log(taulukko);
                    }*/
                try {
                    lisaaMarker(lpPaikka, latauspisteet[i], {icon: greenIcon}, latauspisteet[i].AddressInfo.Title, latauspisteet[i].UsageCost, latauspisteet[i].Connections[0].Level.Title,
                        latauspisteet[i].AddressInfo.AddressLine1, latauspisteet[i].AddressInfo.Town, latauspisteet[i].AddressInfo.Latitude, latauspisteet[i].AddressInfo.Longitude,
                        latauspisteet[i].Connections[0].ConnectionType.Title, latauspisteet[i].Connections[0].CurrentType.Title, latauspisteet[i].UsageType.Title, latauspisteet[i].NumberOfPoints);

                } catch (error) {

                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}


//hakukenttä
const nappi = document.getElementById("nappi");
const input2 = document.getElementById('haku');
console.log(input2.value);
/*
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let httprequest;
httprequest = new XMLHTTPRequest();
httprequest.onreadystatechange = function () { };
httprequest.open("POST", "https://nominatim.openstreetmap.org");
httprequest.withCredentials = true;
httprequest.setRequestHeader("Content-Type", "application/json");
httprequest.send({ 'request': "authentication token" });
*/
nappi.addEventListener('click', function () {
    //console.log("nappia painettiin.")
    fetch('https://nominatim.openstreetmap.org/search/' + input2.value)
        .then(function (paikka) {
            return paikka.json();
        })
        .catch(function (error) {
            console.log(error);
        });
    console.log(paikka);
});

//enter näppäimellä haku


// Execute a function when the user releases a key on the keyboard
input2.addEventListener('keyup', function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById('nappi').click();
        console.log("toimii");
    }

});

//haku
/*
function appendData(vastaus) {

    for (let i = 0; i < vastaus.length; i++) {

        const tulos = document.createElement("p");
        p.setAttribute("class","tulokset");
        document.getElementbyId("tuloksiatuloksia").appendChild(p);


        p.innerHTML = latauspisteet[i].AddressInfo.Title;
    }
}

 */

function huomautus() {
    alert("Tiedot tulevat OpenChargeMap API:sta. Emme vastaa tietojen oikeellisuudesta. Yhteydenotot: timojuhani.hypponen@gmail.com");
}