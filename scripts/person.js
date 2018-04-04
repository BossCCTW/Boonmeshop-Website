//object literal style
// (function () {
//     let person = {
//         person: [],
//         init() {
//             this.catchDom();
//             this.bindEvent();
//             this.render();
//         },
//         catchDom() {
//             this.$el = $('.person_container');
//             this.$input = this.$el.find('input');
//             this.$button = this.$el.find('button');
//             this.$ul = this.$el.find('ul');
//         },
//         bindEvent() {
//             this.$button.on('click', this.addPerson.bind(this));
//             this.$ul.delegate('i.del', 'click', this.deletePerson.bind(person));
//         },
//         addPerson() {
//             if (this.$input.val()) {
//                 this.person.push(this.$input.val());
//                 this.render();
//                 this.$input.val('');
//             }
//         },
//         deletePerson(event) {
//             let target = $(event.target).closest('li');
//             let index = this.$ul.find('li').index(target);
//             this.person.splice(index, 1);
//             this.render();
//         },
//         render() {
//             let data = '';
//             this.person.forEach(function (name) {
//                 data += `<li><span>${name}</span><i class="del">x</i></li>`;
//             });
//             this.$ul.html(data);

//         }
//     }
//     person.init();
// })();


var people = (function(){
    let people = [];

    //cache DOM
    let $groupView = $('.person_container');
    let $input  = $groupView.find('input');
    let $button = $groupView.find('button');
    let $ul = $groupView.find('ul');

    //bind Events
    $button.on('click',addPerson);
    $ul.on('click','i',deletePerson);

    _render();

    function addPerson(){
        pubsub.publish('userClick',1);
        if($input.val()){
            people.push($input.val());
            _render();
            $input.val('');
        }    
    }
    function deletePerson(event){
        let remove = $(event.target).closest('li');
        let item = $ul.find('li').index(remove);    
        people.splice(item,1);
        console.log(event.target);
            
        _render();
    }
    function _render(){
        let viewItem = '';
        let template = (name) =>{ return `<li><span>${name}</span><i class="del">x</i></li>`}; 
        people.forEach(item => viewItem += template(item));
        $ul.html(viewItem);

        pubsub.publish('peopleChange',people.length);
    }
    return {
        addPerson:addPerson,
        deletePerson:deletePerson
    };
})();


