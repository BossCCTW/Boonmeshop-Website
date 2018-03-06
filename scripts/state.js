var state = (function(){
    let amount = 0;

    //cache DOM
    let $state = $('.state_container').find('#state');

    pubsub.subScribe('peopleChange',setStateLength);
    _render();

    function _render(){
        $state.html(amount);
    }
    
    function setStateLength(peopleLength){
        amount = peopleLength;
        _render();
    }

})();

var click = (function(){
    let amount = 0;
    //cache DOM
    let $amountClick = $('.click_container').find('#clicknum');

    pubsub.subScribe('userClick',addAmountUserClick);
    _render();

    function _render(){
        $amountClick.html(amount);
    }
    function addAmountUserClick(value){
        amount = amount+value;
        _render();
    }
})();