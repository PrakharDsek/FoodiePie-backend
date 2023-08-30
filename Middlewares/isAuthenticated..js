/**
 * The function `isAuthenticated` checks if a user is authenticated by checking if a token exists in
 * the request cookies, and if not, it returns an error message.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as headers, query parameters, and body.
 * @param res - The `res` parameter is the response object in Express.js. It is used to send a response
 * back to the client.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically called at the end of the current middleware
 * function to indicate that it has completed its processing and the next middleware function should be
 * called.
 */
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies;
    console.log(token)
    if (!token ) {
        res.status(400).json({
            success: false,
            message: "User is not looged in"
        })
    }else {next()}
  } catch (error) {
    console.log(error)
  }}
export default isAuthenticated;
