const Students = require('../../models/student-model');
const Auth = require('../../models/auth-model');
const { errorHandler } = require('../../utils/utils');


exports.add_student = async (request, response) => {
    try {
        const isExist = await Auth.findOne({ email: request.body.student_email });
        if (isExist) return response.json({ error_message: "This email already exist" });
        await Students.create(request.body);
        return response.json({success_message: "Student Added Successfully"});
    } catch (error) {
        const errors = errorHandler(error, 'students');
        return response.json({errors});
    }
}





exports.get_students = async (request, response) => {
    try {
        let query = {};

        if (request.query && request.query.search) {
            query = { student_name: { $regex: request.query.search, $options: "i" } };
        }
        else if (request.query) {
            query = request.query;
        }

        const students = await Students.find(query);
        return response.json({students});
    } catch (error) {
        console.log(error);
    }
}





exports.get_students_for_cred = async (request, response, next) => {
    try {
        const isExist = await Auth.find({role: '¥student¥'});
        const students = await Students.find();
        const result = [];

        students.map((student, index) => {
            if (student.student_email !== ((isExist.length > 0) ? ((isExist.length < 2) ? isExist[0].email : isExist[index].email) : "")) result.push(student);
        });

        response.json({students: result});
    } catch (error) {
        console.log(error);
    }
}





exports.update_student = async (request, response) => {
    try {
        await Students.findByIdAndUpdate(request.query.id, request.body);
        return response.json({success_message: "Student Updated Successfully"});
    } catch (error) {
        const errors = errorHandler(error, 'students');
        return response.json({errors});
    }
}





exports.delete_student = async (request, response) => {
    try {
        const email = await Students.findByIdAndDelete(request.params.id);
        await Auth.findOneAndDelete({email: email.student_email});
        return response.json({message: "Student deleted successfully"});
    } catch (error) {
        console.log(error);
        return response.json({message: "Something went wrong"});
    }
}