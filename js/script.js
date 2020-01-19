var loadedimg = new Image();
var coloredImg = new Image();
var filtercheckbox;
var filterColor;
var filterColor2;
var filterOpacity;
var imageLoader;
var canvas;
var ctx;
var updown;
var leftright;
var updownValue;
var leftrightValue;
var scales;
var sca;
var photoBrightness;
var photoOpacity;
var colorRed;
var colorGreen;
var colorBlue;
var czarnobialy=0;
var endloop=1;
var colorRedCheck;
var colorGreenCheck;
var colorBlueCheck;
var imageData;
function handleImage(e) {
    init();
    clear();
    clearFilters();
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
        coloredImg = loadedimg = img;
    };
    reader.readAsDataURL(e.target.files[0]);
}

function isLoaded() {
    return (loadedimg.width !== 0 || loadedimg.height !== 0);
}

function clear() {
    if (isLoaded())
        ctx.drawImage(loadedimg, 0, 0);
}
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
    loadSettings();
}

function loadSettings() {
    filtercheckbox = document.getElementById('filtercheckbox');
    filterColor = document.getElementById('filterColor');
    filterColor2 = document.getElementById('filterColor2');
    filterOpacity = document.getElementById('filterOpacity');
    updown = document.getElementById('updown');
    leftright = document.getElementById('leftright');
    updownValue = parseInt(updown.value);
    leftrightValue = parseInt(leftright.value);
    photoBrightness = document.getElementById('photoBrightness');
    photoOpacity = document.getElementById('photoOpacity');
    colorRed = document.getElementById('photoRed');
    colorGreen = document.getElementById('photoGreen');
    colorBlue = document.getElementById('photoBlue');
    colorRedCheck = document.getElementById('colorRedCheck');
    colorGreenCheck = document.getElementById('colorGreenCheck');
    colorBlueCheck = document.getElementById('colorBlueCheck');
    document.getElementById("updown").max = canvas.height;
    document.getElementById("leftright").max = canvas.width;
    sca = document.getElementById('scale');
    scales=parseInt(sca.value);
}

function applyFilter(value) {
    if(value===1){
    applyPhotoFilter(1);
    return;}
    if (isLoaded()) {
        if (filtercheckbox.checked) {
            done=0;
            filter();
        }
    } else {
        alert("Nie dodano zdjęcia!");
        clearFilters();
    }
}

function reset() {
    if(endloop===0){
        alert("Aby wyłączyć ruchome zdjęcie należy kliknąć ponownie przycisk Ruchomy!");
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearFilters();
    if (isLoaded()) {
        ctx.filter = "brightness(100%)";
        ctx.drawImage(coloredImg, 0, 0);
    }
}

function applyPhotoFilter(value) {
    loadSettings();
    loadedimg = coloredImg;
    clear();
    if (isLoaded()) {
        ctx.filter = "brightness(" + photoBrightness.value + "%)";
        ctx.drawImage(loadedimg, 0, 0);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imageData.data[0]);
        if(1===1){
        for (var i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] += parseInt(colorRed.value);
                imageData.data[i + 1] += parseInt(colorGreen.value);
                imageData.data[i + 2] += parseInt(colorBlue.value);
                imageData.data[i + 3] = photoOpacity.value;
            }
        if (czarnobialy===1) {
                for (var a = 0; a < imageData.data.length; a += 4) {
                    var brightness = 0.2126 * imageData.data[a] + 0.7152 * imageData.data[a + 1] + 0.0722 * imageData.data[a + 2];
                    imageData.data[a] = brightness;
                    imageData.data[a + 1] = brightness;
                    imageData.data[a + 2] = brightness;
                }
        }        console.log(imageData.data[0]);
            ctx.putImageData(imageData, 0, 0);}
        if(value===1)
            applyFilter(0);
    } else {
        clearFilters();
        alert("Nie dodano zdjęcia!");
    }
}

function clearFilters() {
    loadSettings();
    filtercheckbox.checked = false;
    filterColor.color = "rgb(255,0,0)";
    filterColor2.color = "rgb(255,255,255)";
    leftright.value = 0;
    updown.value = 1;
    filterOpacity.value = 100;
    photoBrightness.value = 100;
    colorRed.value = 0;
    colorGreen.value = 0;
    colorBlue.value = 0;
    photoOpacity.value = 255;
    czarnobialy=0;
    scales.value=1;
}

function filter() {
    loadSettings();
    if (isLoaded()) {
        if (filtercheckbox.checked) {
            draw();
        }
    } else {
        filtercheckbox.checked = false;
        alert("Nie dodano zdjęcia!");
    }
}

function draw() {
    loadSettings();
    setColorAndOpacity();
    ctx.beginPath();
    ctx.lineWidth=scales;
    ctx.arc(scales*9+leftrightValue, scales*9+updownValue, 10*scales, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(scales*10+leftrightValue, scales*9+updownValue);
    ctx.arc(scales*9+leftrightValue, scales*9+updownValue, 7*scales, 0, Math.PI, false);  // Mouth (clockwise)
    ctx.moveTo(7*scales+leftrightValue, 7*scales+updownValue);
    ctx.moveTo(scales*10+leftrightValue, scales*9+updownValue);
    ctx.lineTo(scales*1.5+leftrightValue, scales*9+updownValue);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth=scales;
    ctx.arc(6*scales+leftrightValue, scales*5+updownValue, scales, 0, Math.PI * 2, true);  // Left eye
    ctx.moveTo(13*scales+leftrightValue, scales*5+updownValue);
    ctx.arc(12*scales+leftrightValue, scales*5+updownValue, scales, 0, Math.PI * 2, true);  // Right eye
    ctx.stroke();


}

function setColorAndOpacity() {
    var color1 = filterColor.value;
    var color2= filterColor2.value;
    var opacity = filterOpacity.value;
    rgbaColor1 = hexToRgbA(color1, opacity);
    rgbaColor2 = hexToRgbA(color2, opacity);
    ctx.strokeStyle = rgbaColor1;
    ctx.fillStyle = rgbaColor2;
}

function anim() {
    if(isLoaded()){
        w = canvas.width;
        h = canvas.height;
        ctx.drawImage(loadedimg, 0, 0);

        var o1 = new Osc(0.05), o2 = new Osc(0.03), o3 = new Osc(0.06),
            x0 = 0, x1 = w * 0.25, x2 = w * 0.5, x3 = w * 0.75, x4 = w;

        (function loop() {
            ctx.clearRect(0, 0, w, h);
            for (var y = 0; y < h; y++) {

                var lx1 = x1 + o1.current(y * 0.2) * 3;
                var lx2 = x2 + o2.current(y * 0.2) * 3;
                var lx3 = x3 + o3.current(y * 0.2) * 3;
                var w0 = lx1;
                var w1 = lx2 - lx1;
                var w2 = lx3 - lx2;
                var w3 = x4 - lx3;
                ctx.drawImage(loadedimg, x0, y, x1, 1, 0, y, w0, 1);
                ctx.drawImage(loadedimg, x1, y, x2 - x1, 1, lx1 - 0.5, y, w1, 1);
                ctx.drawImage(loadedimg, x2, y, x3 - x2, 1, lx2 - 1, y, w2, 1);
                ctx.drawImage(loadedimg, x3, y, x4 - x3, 1, lx3 - 1.5, y, w3, 1);
            }
            requestAnimationFrame(loop);
        })();
        function Osc(speed) {

        var frame = 0;

        this.current = function(x) {
            frame += 0.002 * speed;
            return Math.sin(frame + x * speed * 10);
        };}
}
    else{
        alert("Nie dodano zdjęcia!");
    }
    }

function hexToRgbA(hex, opacity) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity / 100 + ')';
    }
    throw new Error('Bad Hex');
}


function download(){
    if(endloop===0){
        if (window.confirm('Obrazek z filtrem będzie rozmazany, kontynuować?'))
        {
            var link = document.createElement('a');
            link.download = 'savedwith superfiltry.pl.png';
            link.href = document.getElementById('canvas').toDataURL();
            link.click();        }
        else
        {
        }
    }
    else if (isLoaded()) {
        var link = document.createElement('a');
        link.download = 'savedwith superfiltry.pl.png';
        link.href = document.getElementById('canvas').toDataURL();
        link.click();
    }
    else {
        alert("Nie dodano zdjęcia!");
    }

}
    var check=1;
function blackwhite() {
    if(endloop===0){
        alert("Nie zadziała z ruchomym zdjęciem!");
        return;
    }
    if ( check === 1 ) {
        czarnobialy=1;
        applyPhotoFilter(1);
        check=2;
    } else {
        czarnobialy=0;
        applyPhotoFilter(1);
        check=1;
    }
}
var check2=1;
function moving() {
    if ( check2 === 1 ) {
        if (window.confirm('Operacja bardzo mocno obciązająca komputer, kontynuować? (funkcja jest w wiecznej pętli, najlepiej przeprowadzać na mniejszych obrazkach, bez edycji)')) {
            endloop=0;
            check2=2;
            anim();

    }
        else{
        }
    }
        else {
        location.reload();
    }
}