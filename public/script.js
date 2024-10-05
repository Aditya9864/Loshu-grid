document.getElementById('dobForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const dob = document.getElementById('dob').value;
    const response = await fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dob })
    });

    const result = await response.json();
    const resultsDiv = document.getElementById('results');

    if (response.ok) {
        // Display the matrix grid
        let matrixHtml = '<h2>Numerology Grid</h2><table border="1">';
        result.grid.forEach(row => {
            matrixHtml += '<tr>';
            row.forEach(cell => {
                matrixHtml += `<td>${cell}</td>`;
            });
            matrixHtml += '</tr>';
        });
        matrixHtml += '</table>';
        
        // Display the characteristics
        const characteristicsHtml = `<h2>Characteristics</h2><p>${result.characteristics}</p>`;
        
        resultsDiv.innerHTML = matrixHtml + characteristicsHtml;
    } else {
        resultsDiv.innerHTML = `<p>Error: ${result.error}</p>`;
    }
});
