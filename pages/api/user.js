export default (req, res) => {
    if (req.method === 'POST') {
        // Process a POST request
    } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ name: 'John Doe' }))
    }
}