const Notices = require('../../models/notice-model');
const Auth = require('../../models/auth-model');
const { errorHandler, sendEmail } = require('../../utils/utils');
const fs = require('fs/promises');


exports.upload_notice = async (request, response) => {
    try {
        await Notices.create(request.body);
        response.json({message: 'Notice created successfully'});
    } catch (error) {
        console.log(error);
    }
}





exports.get_notices = async (request, response) => {
    try {
        let query = {};

        if (request.query && request.query.search) {
            query = { notice_title: { $regex: request.query.search, $options: "i" } };
        }
        else if (request.query) {
            query = request.query;
        }

        const notices = await Notices.find(query);
        return response.json({notices});
    } catch (error) {
        console.log(error);
    }
}





exports.delete_notice = async (request, response) => {
    try {
        await Notices.findByIdAndDelete(request.params.id);
        return response.json({message: "Notice deleted successfully"});
    } catch (error) {
        console.log(error);
        return response.json({message: "Something went wrong"});
    }
}