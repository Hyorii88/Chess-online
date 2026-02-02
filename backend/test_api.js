
import fetch from 'node-fetch';

async function testApi() {
    try {
        console.log('Fetching from http://localhost:5000/api/leaderboard?limit=5');
        const response = await fetch('http://localhost:5000/api/leaderboard?limit=5');
        console.log('Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('Data length:', data.length);
            console.log('Sample data:', JSON.stringify(data.slice(0, 2), null, 2));
        } else {
            console.log('Error text:', await response.text());
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testApi();
