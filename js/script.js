

function roundNav(){
  this.rootKey = 'PartnerEnablement';
  this.data = inputData[this.rootKey];
  this.stage =  
             '<div class="stage_main_outer_content w_border" id="outer">'
            +'<div class="stage_main_outer w_border">'
            +'<div class="stage_main ">'
            +'<div id="root_span"></div>'
            +'</div></div></div>';

this.breadcrumb ='<div class="breadcrumb flat"></div>';
this.lastState = [];
this.currentState ='';
this.log = function(level,message){
  switch(this.logLevel){
    case 1: console.log(message); break;
    //tbc
  }
};

this.resetData = function(){
    this.data = inputData['PartnerEnablement'];
};
this.run = function(baseKey,dataObj){

  var _this = this;
  if(typeof dataObj !== 'string'){

    $('.stage').html('').append(_this.breadcrumb).append(_this.stage);
    $('.stage_main #root_span').html(baseKey.charAt(0).toUpperCase()).attr('data-st', baseKey);
    _this.currentState = baseKey;
     _this.showBreadCrumb();
    var inKeys = Object.keys(dataObj);
    //to be removed later once i figure out how to add more elements
    var l = (inKeys.length > 8) ? 8 : inKeys.length; 
    for(var i=0; i < inKeys.length; i++){

      var c_id ='c_'+(i+1);
      var c = b = a ='';    

      if(typeof dataObj[inKeys[i]] !== 'string'){
        c = '<div  class="stage_child" id="'+c_id+'" data_pd="'+inKeys[i]+'"><div class="r_ob">'+inKeys[i]+'</div></div>';
      }
      else{
        c = '<div  class="stage_child" id="'+c_id+'" data_pd="'+inKeys[i]+'"><div>'+inKeys[i]+'</div><span>'+dataObj[inKeys[i]]+'</span></div>';
      }

      //$('.breadcrumb').append(b);

      $('.stage_main').append(c);
      $('.container').on('click', '#'+c_id, function(){ 
          console.log("click added");     
         _this.goForward(this);
      }); 
    }

    _this.showPrevious(_this.goBackward);

  }

}; //end trigger
//have to search for recursive object keys only
this.getByKey = function (obj,key,getLinks) {
  var _this = this;
  if (typeof obj === "object") {
    var keys = Object.keys(obj);
    for( k in keys){

      if(keys[k] == key){
        console.log(" match key",keys[k]);
        result = obj[key];
        getLinks(result);
        return; 
      }
      _this.getByKey(obj[keys[k]],key,getLinks);

    }
  }
};
//==
//fi: add notequal to array for array support
this.goForward = function(p){
  var _this = this;
  dataObj = _this.data;
  var w_id = $(p).attr('id');
  var parentKey = $('#'+w_id).attr('data_pd');
  if(typeof dataObj[parentKey] === 'object' ){
    _this.lastState.push($("#root_span").attr('data-st'));

    console.log("last state " , _this.lastState , _this.lastState.length);
    _this.getByKey(dataObj, parentKey, function(result){                 
      $('#outer').addClass('rotated') ;
      setTimeout(function(){
        _this.run(parentKey,result);
        _this.data = result;
      },1000);
    });

    $('.container').unbind('click');
  }
  else if(typeof dataObj[parentKey] === 'string' ) {
    window.open(dataObj[parentKey]);
  }

}; //goforward



this.showPrevious = function(goBack){
   console.log("backTrigger called");
     goBack(this , '#root_span');
  
   
};

this.activateBreadWithCrumb = function(_this, cId){
  console.log("activateBreadWithCrumb called");
      
$('.container').on('click',cId, function(){  
    console.log("click called in br");

  var rkey = $(cId).attr('data-st');

  console.log("rkey ", rkey);

  if( rkey ){

    _this.resetData();  
    _this.getByKey(_this.data, rkey, function(result){_this.data = result;});

    var dataObj = _this.data;  
    $('#outer').addClass('rev_rotated');
      setTimeout(function(){
          console.log("rkey and index", rkey,_this.lastState.indexOf(rkey));
          _this.lastState.length = _this.lastState.indexOf(rkey);
          _this.run(rkey,dataObj);

    },1000);

    $('.container').unbind('click');

  }

 }); 
}


this.goBackward = function(_this, cId){
  
$('.container').on('click',cId, function(){  
    console.log("click called in backTrigger");

  var rkey = $(cId).attr('data-st');
  var l_state =  _this.lastState[ _this.lastState.length-1];
  console.log("rkey and lstate", rkey,l_state);

  if(_this.lastState.length > 0 && rkey && rkey !== l_state){

    _this.resetData();  
    _this.getByKey(_this.data, l_state, function(result){_this.data = result;});

    var dataObj = _this.data;  
    $('#outer').addClass('rev_rotated');
          setTimeout(function(){
          _this.lastState.pop();
          _this.run(l_state,dataObj);

    },1000);

    $('.container').unbind('click');

  }

 }); 
};

this.showBreadCrumb = function(){
  var _this = this;

  $.each(_this.lastState, function(i,v){
      $('.breadcrumb').append('<a href="#" id="brc_'+i+'" data-st ="'+v+'">'+v+'</a>');
      _this.activateBreadWithCrumb(_this, '#brc_'+i);
  });

  //next step
   $('.breadcrumb').append('<a  class="current" href="#" >'+_this.currentState+'</a>');  
};

}; //end root obj




$(function() {
  var home = new roundNav();
    home.run(home.rootKey,home.data);
});
