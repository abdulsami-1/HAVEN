// Wrapper function for async route handlers
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}
