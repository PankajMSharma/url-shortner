// Function to generate a short url from integer ID 
exports.convertIdToShortURL = async (id) => {
    if (typeof id !== 'number') {
        throw Error('Invalid Type of id')
    }

    // Map to store 62 possible characters 
    const charMap = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var shortUrl = ''; 
    
    // Convert given integer id to a base 62 number 
    while (id > 0) {
        // use above charMap to store actual character in short url 
        shortUrl = charMap[id % 62] + shortUrl;
        id /= 62;
        id = Math.trunc(id)
    }
    
    // Reverse shortURL to complete base conversion 
    return shortUrl.split('').reverse().join('');
} 