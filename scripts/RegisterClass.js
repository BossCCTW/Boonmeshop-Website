"use strict"; 
    function showRecomand(target,msg,position){
        removeRecomand(target,position);
        window.location.href='#'+target;
        let span = document.createElement('span');
        span.className = "recommend";
        span.setAttribute('id',target+position);
        let textInner = document.createTextNode(msg);
        span.appendChild(textInner);
        document.getElementById(position).parentNode.appendChild(span);   
    }
    function removeRecomand(target,position){
        let ele = document.getElementById(target+position);
        if(ele){
            ele.remove();
        }
    }
    
  