function createUniqueID(){
    return `${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}`;
}

export {createUniqueID};