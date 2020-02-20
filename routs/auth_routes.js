const {Router} = require('express');
const config = require('config');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../modals/User');
const router = Router();

router.post(
    '/register',
    [
        check('email', config.get('error_email')).isEmail(),
        check('password', config.get('error_password')).isLength({ min: 6 })

    ],
    async (request, response)=> {
    try{
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }
        const { email, password } = request.body;
        console.log(email, password )
        const candidate = await User.findOne({email}).exec();
        console.log(candidate)
        if(candidate) {
            return response.status(400).json({ message: 'Такой пользователь уже существует' })
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });
        console.log(user)
        await user.save();
        return response.status(201).json({ message: 'Пользователь создан!' })

    } catch (e) {
        console.log(e)
        response
            .status(500)
            .json({message: 'Что то пошло не так... попробуйте снова'})
    }
});

router.post(
    '/login',
    [
        check('email', config.get('error_email')).normalizeEmail().isEmail(),
        check('password', config.get('error_password')).exists().isLength({ min: 6 })

    ],
    async (request, response)=> {
        try{
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return response(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const { email, password } = request.body

            const user = await User.findOne({ email })

            if (! user) {
                return response.status(400).json({ message: 'Пользователь не найден'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                return response.status(500).json( { message: 'Не верный пароль' })
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                { expiresIn: '1h'}
                );

            response.json( { token, userId: user.id})

        } catch (e) {
            console.log(`Ошибка при логине: ${e}`);
            response
                .status(500)
                .json({message: 'Что то пошло не так... попробуйте снова'})
        }
});

module.exports = router;