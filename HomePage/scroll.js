//--------------------------------Global Variables----------------------------------
var requestAnimationFrame = window.requestAnimationFrame ||
							window.mozRequestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.msRequestAnimationFrame;

var pages = {};

/*function switchPage(t){
    t.className=t.className.replace('page-active','page-prev');
    window.setTimeout(function(t){
        t.nextElementSibling.className=t.nextElementSibling.className.replace('page-next','page-next page-active')
    }(t),5000);
}*/

function prepareContainer(){
    //TODO: decide classname.replace() _prefered_ vs classlist.replace(), fix css declaration id's are added every rezise
    pages.all = document.getElementById('container').querySelectorAll('.page');
    var isBefore = true;
    for(var i=0; i<pages.all.length; i++){
        pages.all[i].className = pages.all[i].className.replace('page-prev','');
        pages.all[i].className = pages.all[i].className.replace('page-next','');
        
        if(pages.all[i].className.indexOf('page-active')!=-1){
            isBefore=false;
        }else if(isBefore){
            pages.all[i].className = i + ' page-prev ' + pages.all[i].className;
        }else{
            pages.all[i].className = i + ' page-next ' + pages.all[i].className;
        }
        
        
        
        if(pages.all[i].className.indexOf('page-color-')!=-1){
            var arr = pages.all[i].className.split(" ");
            for(var j=0; j<arr.length; j++){
                if(arr[j].indexOf('page-color-')!=-1)var current = j;
            }
            pages.all[i].bgColor = arr[current].replace('page-color-','');
            arr.splice(current, 1);
            pages.all[i].className = arr.join(' ');
        }
    }
    pages.active = '';
    
    extraScrll = 0;
    if(SCRLL_LENGTH<scrllObj.getBoundingClientRect().height)
        extraScrll = (scrllObj.getBoundingClientRect().height-SCRLL_LENGTH)/2;
    
    document.getElementById('filler').style.height = (pages.all.length*SCRLL_LENGTH + extraScrll)+'px';
    console.log(Math.max(scrllObj.getBoundingClientRect().height, SCRLL_LENGTH));
}

var SCRLL_LENGTH = window.innerHeight,
    extraScrll,
    scrll=document.body.scrollTop,
    prevscrll=0,
    scrllObj = document.getElementById('container');

function scrollPage(){}


function changePage(){
    var currentPage = parseInt(scrll);
    console.log('pageNR: '+currentPage);
    if(pages.all[currentPage] && pages.all[currentPage].bgColor){
        var bgColor = pages.all[currentPage].bgColor;
        
        if(bgColor.indexOf('#')==0)
            bgColor = bgColor.replace('#','');
        
        if(!isNaN(parseInt(bgColor,16)) && bgColor.length==6)
            scrllObj.style.backgroundColor = '#'+bgColor;
    }
}

function animationLoop() {
	
	scrll = parseInt((scrllObj.scrollTop - extraScrll + scrllObj.getBoundingClientRect().height/2)/SCRLL_LENGTH);
    
    /*var tempVal = Math.max(scrllObj.getBoundingClientRect().height, SCRLL_LENGTH);
    var frst = parseInt((prevscrll-tempVal/2-SCRLL_LENGTH/2)/SCRLL_LENGTH),
        scnd = parseInt((prevscrll-tempVal/2-SCRLL_LENGTH/2)/SCRLL_LENGTH);*/
    
    if(scrll != prevscrll){
        changePage();
    }
    
    prevscrll = scrll;
    
	requestAnimationFrame(animationLoop);
//	requestAnimFrame(animationLoop);
}
//requestAnimationFrame(animationLoop);

/**************************************/
/* AnimationFrame vs onscroll, speed? */
/**************************************/


function scrollToPage(page){
    if(!page && page!=0)
        page=parseInt((scrllObj.scrollTop - extraScrll + scrllObj.getBoundingClientRect().height/2)/SCRLL_LENGTH);
    
    page = parseInt(page);
    if(isNaN(page) || pages.all.length<=page)
        return false;
    
    scrllObj.scrollTop = (SCRLL_LENGTH*page + SCRLL_LENGTH/2 - scrllObj.getBoundingClientRect().height/2 + extraScrll);
}

var scrollTimeout;


scrllObj.onscroll = function(e){
    clearTimeout(scrollTimeout);
    
    scrll = parseInt((scrllObj.scrollTop - extraScrll + scrllObj.getBoundingClientRect().height/2)/SCRLL_LENGTH);
    if(scrll != prevscrll){
        changePage();
    }
    prevscrll = scrll;
    
    scrollTimeout = setTimeout(scrollToPage, 1500);
};

window.onresize = function(){prepareContainer();};

prepareContainer();