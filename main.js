import { detecIcon, detecType, setStorage } from "./halpers.js";

//!html den gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");


//!olay izleyicisi
form.addEventListener("submit", handleSubmit)
list.addEventListener("click", handleClick)


//!ortak kullanım alanı
let map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let LayerGroup = [];


//!kullanıcının konumunu öğrenme
navigator.geolocation.getCurrentPosition(loadMap);


//!Haritaya tıklanınca çalışır
function onMapClick(e) {
    form.style.display = "flex";
    coords = [e.latlng.lat, e.latlng.lng]; 

  }
  

//!kullanıcının konumuna göre ekrana hariteyı gösterme
function loadMap(e){




//!haritanın kurulumu
   map = new L.map("map").setView([e.coords.latitude, e.coords.longitude], 10);
   L.control;


   //!haritanın nasıl gözükeceğini belirler
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//!haritada ekrana basılacak imleçleri tutan katman
LayerGroup = L.layerGroup().addTo(map);

//!lokalden gelen notları listeleme
renderNoteList(notes)

//!haritada bir tıklanma olduğunda çalışacak fonksiyon
map.on('click', onMapClick);
}

//!form gönderildiğinde çalışır
function handleSubmit(e){
    e.preventDefault();
    
    const desc = e.target[0].value;
    const date = e.target [1].value;
    const status = e.target[2].value;

//!not dizisine eleman ekleme
    notes.push({id: new Date().getTime(), desc, date, status, coords});
    

    //!localStorage güncelleme
    setStorage(notes);

    //!notları ekrana aktarabilmek için fonk. notes dizisini parametre olarak göderdik
    renderNoteList(notes)

    //!form gönderildiğinde kapanır

    form.style.display = "none";
}
//!Ekrana marker bastırma
function renderMarker(item){
    console.log(item);
    
    //!markerı oluşturur
    L.marker(item.coords,{icon:detecIcon(item.status)})
    //!imleçlerin olduğu katmana ekler
    .addTo(LayerGroup)
    //!üzerine tıklanınca popup ekleme
    .bindPopup(`${item.desc}`);
    
}

function renderNoteList(item){
    list.innerHTML = "";
    
//!markerları temizler
    LayerGroup.clearLayers();
    
    item.forEach((item) => { 
        const listElement = document.createElement("li");

        //!datasına sahip olduğu idyi ekleme
        listElement.dataset.id = item.id;
        listElement.innerHTML = `
        <div>
        <p>${item.desc}</p>
        <p><span>Tarih:</span>${item.date}</p>
        <p><span>${detecType(item.status)}</span></p>

    </div>
    <i class="bi bi-x" id="delete"></i>
    <i class="bi bi-airplane-fill" id="fly"></i>

        `;
        list.insertAdjacentElement("afterbegin", listElement)

        //!Ekrana marker basma
        renderMarker(item)

    });

}


function handleClick(e){
    console.log(e.target);
    //!güncellenecel idsini gönderme
    const id = e.target.parentElement.dataset.id;
    if(e.target.id === "delete"){
        console.log("tık");
        //!idsini bildiğimiz elemanı cıkarır
       notes = notes.filter((note) => note.id != id);
       console.log(notes);
//!localStorageyi güncelleme
       setStorage(notes);

       //!ekranı güncelle
       renderNoteList(notes);
       
    }
    if (e.target.id === "fly") {
        const note = notes.find((note) => note.id == id);
        map.flyTo(note.coords);
      }
  }




















