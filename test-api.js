async function testApi() {
    try {
        const response = await fetch('http://localhost:5000/api/shared/info');
        console.log('Status (Shared Info):', response.status);
        const data = await response.json();
        console.log('Data:', data);
    } catch (error) {
        console.error('Error (Shared Info):', error.message);
    }

    try {
        const response = await fetch('http://localhost:5000/');
        console.log('Status (Root):', response.status);
        const text = await response.text();
        console.log('Text:', text);
    } catch (error) {
        console.error('Error (Root):', error.message);
    }
}

testApi();
