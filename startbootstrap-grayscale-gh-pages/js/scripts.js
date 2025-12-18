/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (resposeJson) {

kerro(resposeJson);
  })
  .catch(function (error) {
    document.getElementById("data").innerHTML= "<p>Tietoa ei pystytä hakemaan</p>";
  })

  
  function kerro(data) {
    let teksti = "";
    let tilanne = "";
    let nakyvyys = "";
    let aika = data[data.length-1].time_tag;
    pvm = aika.substr(0,10);
    klo = aika.substr(11,19);
    teksti += "Mittauspvm: " + pvm;
    teksti += "<br>Mittausaika: " + klo;

    let kp = data[data.length-1].kp_index;

        if (kp < 4) {
            tilanne = "Rauhallinen";
            nakyvyys = "Revontulia voi näkyä harvoin ja vain Pohjois-Lapissa.";
        }
        else if (kp < 6 ) {
            tilanne = "Pieni myrsky";
            nakyvyys = "Pieni mahdollisuus revontuliin, näkyvyys koko Lapissa.";
        }
        else if (kp < 8) {
            tilanne = "Kohtalainen";
            nakyvyys = "Revontulia voi nähdä Lapissa ja hieman etelämmässä, kuten Pohjois-Pohjanmaalla.";
        }
        else {
            tilanne = "Voimakas";
            nakyvyys = "Revontulia voi havaita lähes koko Suomessa, maan eteläisempiä osia myöten.";
        }

        teksti += "<br>Tämän hetkinen *kp-arvo on " + kp + "<br>Geomagneettisen myrskyn tila: " + tilanne + "<br>" + nakyvyys;
       
    document.getElementById("data").innerHTML=teksti;
  }
  
 
let map = L.map("auroraMap");

// Mihin kohtaan maapalloa kartta katsoo
map.setView([67, 20], 4.5); // Suomen ,lappi

// Lisätään karttapohja (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);
fetch("https://services.swpc.noaa.gov/json/ovation_aurora_latest.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (responseJson) {

koordinaatit(responseJson);
  })
  .catch(function (error) {
    document.getElementById("auroraMap").innerHTML="<p>Tietoa ei voida hakea</p>"
  })

  function koordinaatit(data2) {
    let teksti = "";
    let aika= data2["Forecast Time"];
    teksti = "<p>Ennuste ajankohta: " + aika.substr(0, 10) + ", klo " + aika.substr(11, 18) + "</p>";
    document.getElementById("aika").innerHTML= teksti;
    //arvojen tarkistus jsonista ja siirto taulukkoon
    for (let i = 0; i < data2.coordinates.length; i++) {
    const point = data2.coordinates[i];
    const lon = point[0];
    const lat = point[1];
    const aurora = point[2];
      //värin lisäys
     if (lat < 54 || lat > 72 || lon < 5 || lon > 40) continue;

    // ⛔ Ohitetaan heikot arvot
    if (aurora < 3) continue;


    let color;
    if (aurora <= 3) color = 'green';
    else if (aurora <= 5) color = 'yellow';
    else color = 'red';

    //Väripallojen piirto
   L.circleMarker([lat, lon], {
  radius: aurora * 2,
  color: color,
  fillColor: color,
  fillOpacity: 0.7,
  weight: 0
}).addTo(map);
  
  }
}
