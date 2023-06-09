import express from 'express'; 
import asyncHandler from 'express-async-handler';
import User from './userModel';

const router = express.Router(); // eslint-disable-line


// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create)/Authenticate User
  // register(Create)/Authenticate User
  router.post('/', asyncHandler(async (req, res) => {
    if (req.query.action === 'register') {  //if action is 'register' then save to DB
        await User(req.body).save()
        res.status(201).json({
            code: 201,
            msg: 'Successful created new user.',
        });
    }
    else {  //Must be authenticating then! Query the DB and check if there's a match
        const user = await User.findOne(req.body);
        if (!user) {
            return res.status(401).json({ code: 401, msg: 'Authentication failed' })
        } else {
            return res.status(200).json({ code: 200, msg: "Authentication Successful", token: 'TEMPORARY_TOKEN' })
        }
    }
}));

  // Update a user
  router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'User Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
});
 
router.get('/:id/favourites', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.status(200).json(user.favourites);
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to find favourites' });
    }
});

router.post('/:id/favourites', async (req, res) => {
    const newFavourite = req.body;
    if (newFavourite && newFavourite.id) {
        const user = await User.findById(req.params.id);
        if (user) {
            user.favourites.push(newFavourite);
            user.save();
            res.status(201).json({ code: 201, msg: "Added Favourite" });
        } else {
            res.status(404).json({ code: 404, msg: 'Unable to add favourites' });
        }
    }
}); 



export default router;
