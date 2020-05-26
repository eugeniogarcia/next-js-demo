/* Lo que guardemos en el directorio /pages/api se trata como una api rest. Podemos gestionar diferentes métodos. Este es un ejemplo básico
*/

export default (req, res) => {
    if (req.method === 'POST') {
        // Process a POST request
    } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ name: 'John Doe' }))
    }
}