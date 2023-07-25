const Teachers = require('../../models/teacher-model');
const Auth = require('../../models/auth-model');
const { errorHandler, sendEmail } = require('../../utils/utils');
const fs = require('fs/promises');


exports.add_teacher = async (request, response) => {
    try {
        const teacher_data = {...request.body, teacher_profile: ""};
        const teacher = await Teachers.create(teacher_data);

        const auth_data = {
            full_name: teacher.teacher_name,
            username: teacher.teacher_roll_number,
            email: teacher.teacher_email,
            password: `@Lms-${teacher.teacher_roll_number}`,
            role: '¥teacher¥'
        };

        return response.json({success_message: "Teacher Added Successfully", auth_data});
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





exports.get_teachers_cred = async (request, response) => {
    const teachers = await fs.readFile('./app/seeders/teachers.json', 'utf8');
    const data = JSON.parse(teachers);
    const auth = await Auth.find({role: '¥teacher¥'});
    return response.json({credentials: data.credentials, auth});
}





exports.sned_cred = async (request, response) => {
    try {
        const credentials = await Auth.findById(request.body.id);
        const teachers = await fs.readFile('./app/seeders/teachers.json', 'utf8');
        const data = JSON.parse(teachers);
        const found_teacher = data.credentials.find(teacher => teacher.id == credentials._id);

        const mail_data = {
            from: process.env.EMAIL_ADDRESS,
            to: found_teacher.email,
            subject: "Credentials",
            html: `<h1>It's your crendentials</h1>
            <h3>Username: ${found_teacher.username}<h5>
            <h3>Password: ${found_teacher.password}</h3>
            <p>Please visit this url <a href="http://localhost:4000/auth/sign-in">http://localhost:4000/auth/sign-in</a></p>`
        };

        sendEmail(mail_data);
        return response.json({message: "Successfully Sent"});
    } catch (error) {
        console.log(error);
        return response.json({message: "Sending Failed"});
    }
}





exports.update_teacher = async (request, response) => {
    try {
        const data = {...request.body, teacher_profile: ""};
        await Teachers.findByIdAndUpdate(request.query.id, data);
        return response.json({success_message: "Teacher Updated Successfully"});
    } catch (error) {
        const errors = errorHandler(error, 'teachers');
        return response.json({errors});
    }
}





exports.delete_teacher = async (request, response) => {
    try {
        const teachers = await fs.readFile('./app/seeders/teachers.json', 'utf8');
        const data = JSON.parse(teachers);
        const email = {};
        const teacher_index = data.credentials.findIndex(teacher => {
            teacher.id === request.params.id;
            email['email'] = teacher.email;
        });

        await Teachers.findByIdAndDelete(request.params.id);
        await Auth.findOneAndDelete(email);

        data.credentials.splice(teacher_index, 1);
        await fs.writeFile('./app/seeders/teachers.json', JSON.stringify(data, null, 4), 'utf8');

        return response.json({message: "Teacher deleted successfully"});
    } catch (error) {
        console.log(error);
        return response.json({message: "Something went wrong"});
    }
}