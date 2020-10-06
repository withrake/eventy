export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') -1 >>> 0) +2); //we could also have used split('.').pop(), but the last case >>> 0 accomodates a filename without extension
}
