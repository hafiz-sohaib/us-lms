const Auth = require('../../models/auth-model');
const Pass = require('../../models/pass-model');
const { errorHandler, generateToken, sendEmail } = require('../../utils/utils');


// ==================== Sign-Up ====================
exports.sign_up = async (request, response) => {
    try {
        if (request.body.full_name === "Select Student") return response.json({error_message: "Please Select Student"});
        if (request.body.full_name === "Select Teacher") return response.json({error_message: "Please Select Teacher"});

        const mail_data = {
            from: process.env.EMAIL_ADDRESS,
            to: request.body.email,
            subject: "Credentials",
            html: `<h1>It's your crendentials</h1>
            <h3>Username: ${request.body.username}<h5>
            <h3>Password: ${request.body.password}</h3>
            <p>Please visit this url <a href="http://localhost:4000/auth/sign-in">http://localhost:4000/auth/sign-in</a></p>`
        };

        sendEmail(mail_data);

        const created = await Auth.create(request.body);
        await Pass.create({ id: created._id, password: request.body.password });
        return response.json({ success_message: "Sign-Up Successfull" });
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
        if (user.isBlocked === true) return response.json({ error_message: "Your Account is Deactivated" });

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




// ==================== Create Admin ====================
exports.add_admin = async (request, response) => {
    try {
        const created = await Auth.create({...request.body, role: '¥admin¥'});
        await Pass.create({id: created._id, password: request.body.password});
        return response.json({success_message: "Admin created successfully"});
    } catch (error) {
        const errors = errorHandler(error, 'auth');
        return response.json({errors});
    }
};




// ==================== Create Admin ====================
exports.update_admin = async (request, response) => {
    try {
        const updated = await Auth.findByIdAndUpdate(request.params.id, {...request.body, role: '¥admin¥'});
        await Pass.findOneAndUpdate({id: updated._id, password: request.body.password});
        return response.json({success_message: "Admin updated successfully"});
    } catch (error) {
        const errors = errorHandler(error, 'auth');
        return response.json({errors});
    }
};



// ==================== Credentails ====================
exports.credentials = async (request, response) => {
    try {
        let query = {};

        if (request.query && request.query.role) {
            query['role'] = request.query.role;
        }

        if (request.query && request.query.search) {
            query['full_name'] = { $regex: request.query.search, $options: "i" };
        }

        const credentials = await Auth.find(query);
        return response.json({credentials});
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
        await Auth.findByIdAndUpdate(request.params.id, { isBlocked: true });
        return response.json({ message: "Student Blocked Successfully" });
    } catch (error) {
        console.log(error);
        return response.json({ message: "Blocking Failed" });
    }
};




exports.unblock = async (request, response) => {
    try {
        await Auth.findByIdAndUpdate(request.params.id, { isBlocked: false });
        return response.json({ message: "Student Unblocked Successfully" });
    } catch (error) {
        console.log(error);
        return response.json({ message: "Unblocking Failed" });
    }
};




exports.get_pass = async (request, response) => {
    try {
        const pass = await Pass.findOne({id: request.params.id});
        return response.json({pass});
    } catch (error) {
        console.log(error);
    }
};




exports.delete = async (request, response) => {
    try {
        const auth = await Auth.findByIdAndDelete(request.params.id);
        await Pass.findOneAndDelete({id: auth._id});
        return response.json({message: "Admin deleted successfully"});
    } catch (error) {
        console.log(error);
        return response.json({message: "Something went wrong"});
    }
};