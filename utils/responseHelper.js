// Function to send a success response with a 200 OK status
const sendSuccessResponse = (res, customMessage, data) => {
    res.status(200).json({
        status: 'success',
        message: customMessage,
        data: data,
    });
}
// Function to send a success response with a 201 Created status
const sendCreatedResponse = (res, customMessage, data) => {
    res.status(201).json({
        status: 'success',
        message: customMessage,
        data: data,
    });
};
// Function to send a not found response with a 404 status
const sendNotFoundResponse = (res, customMessage) => {
    res.status(404).json({
        status: 'fail',
        message: customMessage,
    });
}
// Function to send an internal server error response with a 500 status
const sendErrorResponse = (res, customMessage) => {
    res.status(500).json({
        status: 'error',
        message: customMessage,
    });
};

module.exports = {
    sendSuccessResponse,
    sendCreatedResponse,
    sendNotFoundResponse,
    sendErrorResponse,
};
