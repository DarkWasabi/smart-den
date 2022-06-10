const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const homeValidation = require('../../validations/home.validation');
const { homeController, homeDeviceController } = require('../../controllers');
const deviceValidation = require('../../validations/device.validation');
const deviceController = require('../../controllers/homeDevice.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(homeValidation.createHome), homeController.createHome)
  .get(auth(), homeController.getHomes);

router
  .route('/:homeId')
  .get(auth(), validate(homeValidation.getHome), homeController.getHome)
  .patch(auth(), validate(homeValidation.updateHome), homeController.updateHome)
  .delete(auth('deleteHomes'), validate(homeValidation.deleteHome), homeController.deleteHome);

router
  .route('/:homeId/devices')
  .post(auth(), validate(deviceValidation.createDevice), homeDeviceController.addDevice)
  .get(auth(), validate(deviceValidation.getHomeDevices), homeDeviceController.getDevices);

module.exports = router;

// TODO: update @swagger
/**
 * @swagger
 * tags:
 *   name: Homes
 *   description: Home management and retrieval
 */

/**
 * @swagger
 * /homes:
 *   post:
 *     summary: Create a home
 *     description: Only admins can create homes.
 *     tags: [Homes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *             example:
 *               name: fake name
 *               address: fake address
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Home'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all user homes
 *     description: Only admins can retrieve all homes.
 *     tags: [Homes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Home'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /homes/{id}:
 *   get:
 *     summary: Get a home
 *     description: Logged in users can fetch only their own home information.
 *     tags: [Homes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Home id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Home'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a home
 *     description: Only admins can update homes.
 *     tags: [Homes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Home id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *             example:
 *               name: fake name
 *               address: fake address
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Home'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a home
 *     description: Only admins can delete homes.
 *     tags: [Homes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Home id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
