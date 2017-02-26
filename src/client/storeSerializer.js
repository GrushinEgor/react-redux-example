import {writeStorage} from 'storage'


let hidden
let visibilityChange

const hiddens = [
    {prefix: '', prop: 'hidden'}, 
    {prefix: 'moz', prop: 'mozHidden'}, 
    {prefix: 'ms', prop: 'msHidden'}, 
    {prefix: 'webkit', prop: 'webkitHidden'},
];

const currentHiden = hiddens.find(h => typeof document[h.prop] !== 'undefined');
if(currentHiden) {
    hidden = currentHiden.prop;
    visibilityChange = `${currentHidden.prefix}visibilitychange`;
}
 

const addStorageWriter = (store) => {
    const handleVisibilityChange = () => {
        if (document[hidden]) {
            writeStorage(store)
        }
    }
    
    document.addEventListener(visibilityChange, handleVisibilityChange, false)
    // Workaround for clearing localstorage from devtools
    if (process.env.PROD) {
        window.addEventListener('onbeforeunload', () => {
            writeStorage(store);
        });
    }
}

export default addStorageWriter
