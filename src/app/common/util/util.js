export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') -1 >>> 0) +2); //we could also have used split('.').pop(), but the last case >>> 0 accomodates a filename without extension
}

export function createDataTree(dataset) {
    let hashtable = Object.create(null);
    dataset.forEach(a => hashtable[a.id] = {...a, childNodes: []}); //...a gives all the properties in an array
    let dataTree = [];
    dataset.forEach(a => { //looping again, checking for a parent id. 0 = false
        if (a.parentId) hashtable[a.parentId].childNodes.push(hashtable[a.id]); //if an element we're looping over has a parent ID we're pushing it into the childNodes of that particular element
        else dataTree.push(hashtable[a.id]);
    }); //anything with id 0 is a normal comment, everything else goes into an array called childNodes of that particular element (=reply)
    return dataTree;
}