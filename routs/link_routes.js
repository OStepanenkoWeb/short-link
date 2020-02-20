const {Router} = require('express');
const config = require('config');
const shortid = require('shortid');
const router = Router();
const Link = require('../modals/Link');
const auth = require('../middleware/auth_middleware');

router.post('/generate', auth, async (request, response) => {
    try{
        const baseUrl = config.get('baseUrl');
        const { from } = request.body;
        const code = shortid.generate();
        const existing = await Link.findOne({from});

        if(existing) response.json({ link: existing });

        const to = baseUrl + '/t/' + code;
        const link = new Link(
            {
                code,
                to,
                from,
                owner: request.user.userId
            });
        await link.save();

        response.status(201).json(link)

    } catch (e) {
        console.log(`Ошибка при попытке сформировать ссылку: ${e}`);
        response
            .status(500)
            .json({message: 'Что то пошло не так... ошибка при попытке сформировать ссылку'})
    }

});

router.get('/', auth, async (request, response) => {
    try{
        const links = await Link.find({owner: request.user.userId});

        response.json(links)
    } catch (e) {
        console.log(`Ошибка получения ссылки: ${e}`);
        response
            .status(500)
            .json({message: 'Что то пошло не так... Ошибка получения ссылки'})
    }

});

router.get('/:id', auth, async (request, response) => {
    try{
        const link = await Link.findById(request.params.id);
        response.json(link)
    } catch (e) {
        console.log(e);
        response
            .status(500)
            .json({message: 'Что то пошло не так... ошибка при попытке получения ссылки по id'})
    }

});

module.exports = router;