self.window = self // This is required for the jsencrypt library to work within the web worker

// Import the jsencrypt library
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js');

let crypt = null;
let privateKey = null;

/** Webworker 'onmessage' listener (spelling matters!). **/
onmessage = function(e) {

    const [ messageType, messageId, text, key ] = e.data;

    let result;

    switch (messageType) {
        default: break;

        case 'generate-keys':
            result = generateKeypair(); break;
        
        case 'encrypt':
            result = encrypt(text, key); break;
        
        case 'decrypt':
            result = decrypt(text); break;
    }

    // Return result to the UI thread.
    postMessage([ messageId, result ]);
}

/** Generate and store key-pair. **/
function generateKeypair () {
    crypt = new JSEncrypt({ default_key_size: 2056 });
    privateKey = crypt.getPrivateKey();

    return crypt.getPublicKey(); // Only return the public key.
}

/** Encrypt the provided string with the destination public key. **/
function encrypt (content, publicKey) {
    crypt.setKey(publicKey);

    return crypt.encrypt(content);
}

/** Decrypt the provided string with the local private key. **/
function decrypt (content) {
    crypt.setKey(privateKey);

    return crypt.decrypt(content);
}