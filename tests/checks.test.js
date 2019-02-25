//Requirements
const Browser = require('zombie');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

//Command line vars
var options = EvUtils.get_cli();
var practicaPath = options.argumentosPractica;
console.log("Invocado con practica path: " + practicaPath);

//General Vars
var browser;
var state = {};

//Specific vars
var indexPath = practicaPath;
var asignaturasPath = indexPath.replace("index.htm","asignaturas.htm");


describe('mooc_node-mod7_html_css', function(){

    describe('Test Index page', function(){
        before(function(done) {
            browser = new Browser(ZombieUtils.getBrowserDefaultParams());
            ZombieUtils.visita(browser,indexPath,state,done);
        });

        ZombieUtils.initialTests(state,"index",indexPath);

        it("La página debe tener the título 'CORE2016 P1' (1) [1/18 La página debe tener the título 'CORE2016 P1']", function(){
            browser.assert.element('title');
            var title = browser.querySelector("title").innerHTML;
            (title.replace(/ +/g,"").toUpperCase()).should.equal("CORE2016P1");
        });

        it("La URL debe ser de neocities (0) <[0 No se encontró una URL de neocities]>", function(){
            if(EvUtils.isURL(practicaPath)){
                (practicaPath.indexOf("neocities.org")).should.not.equal(-1);
            }
        });

        it("La página debe contener una imagen (2) [2/18 Couldn't find una imagen in la página index]", function(){
            browser.assert.elements('img', { atLeast: 1 });
        });

        it("La página debe contener un vídeo (2) [2/18 Couldn't find un vídeo in la página index]", function(){
            //La página puede contener videos no HTML5

            //Videos de YouTube
            var iframes = browser.querySelectorAll("iframe[src]");
            for(var i=0; i<iframes.length; i++){
                var iframe = iframes[i];
                if((typeof iframe.src == "string")&&(iframe.src.indexOf("youtube")!=-1)){
                    true.should.equal(true);
                    return;
                }
            }

            //Video HTML5
            browser.assert.elements('video', { atLeast: 1 });
        });

        it("La página debe tener un encabezado (1) [1/18 Couldn't find encabezado in la página index]", function(){
            browser.assert.element('head');
        });

        it("La página debe tener un pie con the nombre y correo del alumno (2)  [2/18 Couldn't find un pie con the nombre y correo del alumno in la página index]", function(){
            browser.assert.element('footer');

            //The pie de página debe tener the nombre y correo del alumno
            var footer = browser.querySelector("footer");
            (footer.innerHTML.indexOf("@")==-1).should.equal(false);
        });

        it("La página debe importar los estilos normal.css y movil.css (2) [2/18 La página index no tiene las hojas de estilo normal.css y movil.css o éstas no fueron importadas correctamente]", function(){
            browser.assert.elements("link[rel='stylesheet']", { atLeast: 2 });
            var cssLinks = browser.querySelectorAll("link[rel='stylesheet']");

            var hasNormalCSS = false;
            var hasMovilCSS = false;
            for(var i=0; i<cssLinks.length; i++){
                try {
                    var linkHref = cssLinks[i].href.toLowerCase();
                    if(linkHref.indexOf("normal.css")!=-1){
                        hasNormalCSS = true;
                    } else if(linkHref.indexOf("movil.css")!=-1){
                        hasMovilCSS = true;
                    }
                } catch(e){}
            }
            (hasNormalCSS).should.equal(true);
            (hasMovilCSS).should.equal(true);
        });

        it("La página debe incluir la fecha actual mediante javascript (2) [2/18 Couldn't find la fecha actual conforme a las instrucciones del enunciado in la página index]", function(){
            browser.assert.element("#fecha");
            var fecha = browser.querySelector("#fecha").innerHTML;
            var d = new Date();
            var day = d.getDate();
            var hour = d.getHours();
            var year = d.getFullYear();
            (fecha.indexOf(day)!=-1).should.equal(true);
            ((fecha.indexOf(hour)+fecha.indexOf(hour-1))!=-2).should.equal(true);
            (fecha.indexOf(year)!=-1).should.equal(true);
        });

    });


    describe('Test Asignaturas page', function(){
        before(function(done) {
            browser = new Browser();
            ZombieUtils.visita(browser,asignaturasPath,state,done);
        });

        ZombieUtils.initialTests(state,"asignaturas",asignaturasPath);

        it("La página debe contener una tabla (2) [2/18 Couldn't find una tabla in la página asignaturas]", function(){
            browser.assert.elements('table', { atLeast: 1 });
        });

        it("La tabla debe contener enlaces (2) [2/18 No se han encontrado enlaces a moodle o dit.upm in la tabla de asignaturas]", function(){
            browser.assert.elements('table tr td a[href]', { atLeast: 2 });

            //Comprobar que los enlaces van a moodle o alguna página del DIT
            var validLinks = 0;
            var links = browser.querySelectorAll("table a");
            for(var i=0; i<links.length; i++){
                var link = links[i];
                if(typeof link.href == "string"){
                    if((link.href.toLowerCase().indexOf("moodle") != -1)||(link.href.toLowerCase().indexOf("dit.upm.es") != -1)){
                        validLinks++;
                    }
                }
            }
            expect(validLinks).to.be.above(1);
        });

        it("La página debe tener un encabezado (1) [1/18 Couldn't find un encabezado in la página asignaturas]", function(){
            browser.assert.element('head');
        });

        it("La página debe tener un pie (1) [1/18 Couldn't find un pie in la página asignaturas]", function(){
            browser.assert.element('footer');
        });

        it("Mensaje Foro {<a href='https://moodle.lab.dit.upm.es/mod/forum/discuss.php?d=3657'>Foro de Revisión</a>}", function(){
            assert(true);
        })
    });

});