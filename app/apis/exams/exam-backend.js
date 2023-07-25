const Exams = require('../../models/exam-model');
const { errorHandler } = require('../../utils/utils');


exports.set_duty = async (request, response) => {
    try {
        await Exams.create(request.body);
        response.json({message: 'Exam Duty set successfully'});
    } catch (error) {
        const errors = errorHandler(error, 'exam-duties');
        response.json({errors});
    }
}





exports.get_duties = async (request, response) => {
    try {
        let query = {};

        if (request.query && request.query.search) {
            query = { exam_teacher: { $regex: request.query.search, $options: "i" } };
        }
        else if (request.query) {
            query = request.query;
        }

        const exams = await Exams.find(query);
        return response.json({exams});
    } catch (error) {
        console.log(error);
    }
}





exports.delete_duty = async (request, response) => {
    try {
        await Exams.findByIdAndDelete(request.params.id);
        return response.json({message: "Duty deleted successfully"});
    } catch (error) {
        console.log(error);
        return response.json({message: "Something went wrong"});
    }
}