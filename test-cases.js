const fs = require('fs');

async function runTest() {
    console.log('Reading cases.json...');
    const data = fs.readFileSync('cases.json', 'utf8');
    const cases = JSON.parse(data);
    
    console.log(`Sending ${cases.cases.length} cases to the API...`);
    
    const response = await fetch('http://localhost:3000/api/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cases)
    });
    
    if (!response.ok) {
        console.error('Failed to get response:', response.status, response.statusText);
        const text = await response.text();
        console.error(text);
        return;
    }
    
    const result = await response.json();
    console.log(`Received results for ${result.length} cases.`);
    
    fs.writeFileSync('output.json', JSON.stringify(result, null, 2));
    console.log('Results written to output.json');
}

runTest().catch(console.error);
