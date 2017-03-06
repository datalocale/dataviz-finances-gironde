export default function remember(...args){
    const [key, value] = args;
    
    if(args.length === 0){
        return Promise.reject('Missing key argument');
    }
    
    if(args.length === 1){
        // recall 
        return new Promise(resolve => {
            setTimeout(() => {
                const val = localStorage.getItem(key);
                
                try{ 
                    resolve(JSON.parse(val)) 
                }
                catch(e){ 
                    resolve(val); 
                }
            })
        });
    }
    
    // args.length >= 2 
    // retain
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            let toStore = value;
            try{ 
                if(Object(value) === value)
                    toStore = JSON.stringify(value); 
            }
            catch(e){ reject(e) }
            
            try{
                localStorage.setItem(key, toStore);
                resolve(key);
            }
            catch(e){ 
                reject(e); 
            }
        })
    });
}

export function forget(key){
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            try{
                resolve(localStorage.removeItem(key))
            }
            catch(e){
                reject(e);
            }
        })
    });
}