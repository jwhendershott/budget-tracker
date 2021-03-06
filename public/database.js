let database;
const request = window.indexedDB.open('budget', 1);

request.onupgradeneeded = function (event) {
    
    database = event.target.result;

    const store = database.createObjectStore('pending', {
    
        autoIncrement: true
    });

};

request.onsuccess = function (event) {
    
    database = event.target.result;
    
    if (navigator.onLine) { checkDatabase(); }
};

function checkDB() {
    const transaction = database.transaction(['pending'], 'readwrite');
    
    const store = transaction.objectStore('pending');

    const getAll = store.getAll();

    getAll.onsuccess = function () {
       
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'
                },
            })

                .then((response) => response.json())
                .then(() => {
                    const transaction = database.transaction(['pending'], 'readwrite');

                    const store = transaction.objectStore('pending');
                    
                    store.clear();
                });
        }
    };
}

function Recordsave(record) {
    
    const transaction = database.transaction(['pending'], 'readwrite');
    
    const store = transaction.objectStore('pending');
    
    store.add(record);
}

window.addEventListener('online', checkDB);