const {Router} = require('express');
const Link = require('../modals/Link')
const router = Router();

router.get('/:code', async (request, response) => {
    try{
        const link = await Link.findOne({code: request.params.code});
        if(link) {
            link.clicks++
            await link.save()
            return response.redirect(link.from)
        }

        response.status(404).json('Ссылка не найдена')

    } catch (e) {
        console.log(e);
        response
            .status(500)
            .json({message: 'Ошибка перехода по ссылке'})
    }
});

module.exports = router;