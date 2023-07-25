const Students = require('../../models/student-model');
const Auth = require('../../models/auth-model');
const { errorHandler, sendEmail } = require('../../utils/utils');
const fs = require('fs/promises');


exports.add_student = async (request, response) => {
    try {
        const student_data = {...request.body, student_profile: ""};
        const student = await Students.create(student_data);

        const auth_data = {
            full_name: student.student_name,
            username: student.student_roll_number,
            email: student.student_email,
            password: `@Lms-${student.student_roll_number}`,
        };

        return response.json({success_message: "Student Added Successfully", auth_data});
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





exports.get_students_cred = async (request, response) => {
    const students = await fs.readFile('./app/seeders/students.json', 'utf8');
    const data = JSON.parse(students);
    const auth = await Auth.find({role: '¥student¥'});
    return response.json({credentials: data.credentials, auth});
}





exports.sned_cred = async (request, response) => {
    try {
        const credentials = await Auth.findById(request.body.id);
        const students = await fs.readFile('./app/seeders/students.json', 'utf8');
        const data = JSON.parse(students);
        const found_student = data.credentials.find(student => student.id == credentials._id);

        const mail_data = {
            from: process.env.EMAIL_ADDRESS,
            to: found_student.email,
            subject: "Credentials",
            html: `<h1>It's your crendentials</h1>
            <h3>Username: ${found_student.username}<h5>
            <h3>Password: ${found_student.password}</h3>
            <p>Please visit this url <a href="http://localhost:4000/auth/sign-in">http://localhost:4000/auth/sign-in</a></p>`
        };

        sendEmail(mail_data);
        return response.json({message: "Successfully Sent"});
    } catch (error) {
        console.log(error);
        return response.json({message: "Sending Failed"});
    }
}





exports.update_student = async (request, response) => {
    try {
        const data = {...request.body, student_profile: ""};
        await Students.findByIdAndUpdate(request.query.id, data);
        return response.json({success_message: "Student Updated Successfully"});
    } catch (error) {
        const errors = errorHandler(error, 'students');
        return response.json({errors});
    }
}





exports.delete_student = async (request, response) => {
    try {
        const students = await fs.readFile('./app/seeders/students.json', 'utf8');
        const data = JSON.parse(students);
        const email = {};
        const student_index = data.credentials.findIndex(student => {
            student.id === request.params.id;
            email['email'] = student.email;
        });

        await Students.findByIdAndDelete(request.params.id);
        await Auth.findOneAndDelete(email);

        data.credentials.splice(student_index, 1);
        await fs.writeFile('./app/seeders/students.json', JSON.stringify(data, null, 4), 'utf8');

        return response.json({message: "Student deleted successfully"});
    } catch (error) {
        console.log(error);
        return response.json({message: "Something went wrong"});
    }
}