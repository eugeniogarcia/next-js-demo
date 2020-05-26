import Cors from 'cors'

/*Podemos definir un middleware, utilizar CORS, usar cookies, ...*/

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "POST", "OPTIONS"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }
            return resolve(result)
        })
    })
}

async function handler(req, res) {
    // Run the middleware
    await runMiddleware(req, res, cors)

    res.status(200).json({ message: "Hello Everyone!" });
}

export default handler