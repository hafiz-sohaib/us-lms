const Teachers = require('../../models/teacher-model');
const Auth = require('../../models/auth-model');
const { errorHandler } = require('../../utils/utils');


exports.add_teacher = async (request, response) => {
    try {
        const isExist = await Auth.findOne({ email: request.body.teacher_email });
        if (isExist) return response.json({ error_message: "This email already exist" });
        await Teachers.create(request.body);
        return response.json({success_message: "Teacher Added Successfully"});
    } catch (error) {
        const errors = errorHandler(error, 'teachers');
        return response.json({errors});
    }
}





exports.get_teachers = async (request, response) => {
    try {
        let query = {};

        if (request.query && request.query.search) {
            query = { teacher_name: { $regex: request.query.search, $options: "i" } };
        }
        else if (request.query) {
            query = request.query;
        }

        const teachers = await Teachers.find(query);
        return response.json({teachers});
    } catch (error) {
        console.log(error);
    }
}





exports.get_teachers_for_cred = async (request, response, next) => {
    try {
        const isExist = await Auth.find({role: '¥teacher¥'});
        const teachers = await Teachers.find();
        const result = [];

        teachers.map((teacher, index) => {
            if (teacher.teacher_email !== ((isExist.length > 0) ? ((isExist.length < 2) ? isExist[0].email : isExist[index].email) : "")) result.push(teacher);
        });

        response.json({teachers: result});
    } catch (error) {
        console.log(error);
    }
}





exports.update_teacher = async (request, response) => {
    try {
        await Teachers.findByIdAndUpdate(request.query.id, request.body);
        return response.json({success_message: "Teacher Updated Successfully"});
    } catch (error) {
        const errors = errorHandler(error, 'teachers');
        return response.json({errors});
    }
}





exports.delete_teacher = async (request, response) => {
    try {
        const email = await Teachers.findByIdAndDelete(request.params.id);
        await Auth.findOneAndDelete({email: email.teacher_email});
        return response.json({message: "Teacher deleted successfully"});
    } catch (error) {
        console.log(error);
        return response.json({message: "Something went wrong"});
    }
}