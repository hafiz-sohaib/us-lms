const Auth = require('../../models/auth-model');
const { errorHandler, generateToken } = require('../../utils/utils');
const fs = require('fs/promises');


// ==================== Sign-Up ====================
exports.sign_up = async (request, response) => {
    try {
        const created = await Auth.create(request.body);

        const students_file = await fs.readFile('./app/seeders/students.json', 'utf8');
        const existing_students = JSON.parse(students_file);

        const teachers_file = await fs.readFile('./app/seeders/teachers.json', 'utf8');
        const existing_teachers = JSON.parse(teachers_file);

        const new_data = {
            id: created._id,
            full_name: created.full_name,
            username: created.username,
            email: created.email,
            password: request.body.password,
        };

        if (created.role === '¥teacher¥') {
            existing_teachers.credentials.push(new_data);
            await fs.writeFile('./app/seeders/teachers.json', JSON.stringify(existing_teachers, null, 4), 'utf8');
        }else{
            existing_students.credentials.push(new_data);
            await fs.writeFile('./app/seeders/students.json', JSON.stringify(existing_students, null, 4), 'utf8');
        }

        return response.json({success_message: "Sign-Up Successfull"});
    } catch (error) {
        const errors = errorHandler(error, 'auth');
        return response.json({errors});
    }
};




// ==================== Sign-In ====================
exports.sign_in = async (request, response) => {
    try {
        const { username, password } = request.body;

        const user = await Auth.findOne({ username });
        if (!user || !(await user.isPasswordMatched(password))) return response.json({ error_message: "Invalid Credentials" });
        if (await Auth.findOne({ isBlocked: true })) return response.json({ error_message: "Your Account is Deactivated" });

        const token = generateToken(user._id);
        await Auth.findByIdAndUpdate(user._id, { access_token: token });

        response.cookie("lms_access_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 Day
        });

        return response.json({ success_message: "Sign-In Successful", token});
    } catch (error) {
        console.error(error);
        return response.json({ error_message: "Internal Server Error" });
    }
};




// ==================== Credentails ====================
exports.credentails = async (request, response) => {
    try {
        const credentails = await Auth.find({role: '¥student¥'});
        return response.json({credentails});
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
    }
};




// ==================== Sign-Out ====================
exports.sign_out = async (request, response) => {
    try {
        response.clearCookie('lms_access_token', { httpOnly: true, secure: true });
        return response.redirect('/auth/sign-in');
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
    }
};




exports.block = async (request, response) => {
    try {
        await Auth.findByIdAndUpdate(request.body.id, { isBlocked: true });
        return response.json({ message: "Student Blocked Successfully" });
    } catch (error) {
        console.log(error);
        return response.json({ message: "Blocking Failed" });
    }
};




exports.unblock = async (request, response) => {
    try {
        await Auth.findByIdAndUpdate(request.body.id, { isBlocked: false });
        return response.json({ message: "Student Unblocked Successfully" });
    } catch (error) {
        console.log(error);
        return response.json({ message: "Unblocking Failed" });
    }
};