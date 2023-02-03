const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authController')
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({});
const auth = require('../middleware/auth')
const friendInvitationControllers = require('../controllers/friendsController/friendInvitationControllers')
const postFriendInvitationSchema = Joi.object({
    targetMailAddress: Joi.string().email(),
})

const inviteFriendInvitationSchema = Joi.object({
    id: Joi.string().required()
})

router.post('/invite',auth,validator.body(postFriendInvitationSchema), friendInvitationControllers.controller.postInvite)

router.post('/accept',auth,validator.body(inviteFriendInvitationSchema), friendInvitationControllers.controller.postAccept)

router.post('/reject',auth,validator.body(inviteFriendInvitationSchema), friendInvitationControllers.controller.postReject)

module.exports = router