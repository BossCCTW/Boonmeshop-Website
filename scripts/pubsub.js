var pubsub = {
    events:{},
    subScribe(eventName,func){
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(func);
    },
    unSubScibe(eventName,func){
        if(this.events[eventName]){
            for(let i = 0 ; i < this.events[eventName].length; i++){
                if(this.events[eventName][i]== func){
                    this.events[eventName].splice(i,1);
                    break;
                }
            }
        }
    },
    publish(eventName,data){
        if(this.events[eventName]){
            this.events[eventName].forEach(func => {
                func(data);
            });
        }
    }

};