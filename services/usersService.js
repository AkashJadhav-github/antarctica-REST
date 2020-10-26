var config = require('../config/config');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// API to create/register new user
const register = async (req, res) => {
    try {
        const db = req.app.locals.db;
        let dba = db.db(config.antarctica_db);

        let first_name = req.body.first_name.toLowerCase();
        let last_name = req.body.last_name.toLowerCase();
        let email = req.body.email.toLowerCase();
        let password = req.body.password.toLowerCase();

        let employee_id = req.body.employee_id.toLowerCase();
        let organization_name = req.body.organization_name.toLowerCase();

        if (first_name && last_name && email && password && employee_id && organization_name) {
            let data_obj = {
                first_name,
                last_name,
                email,
                password: bcrypt.hashSync(password, 8),
                _id: employee_id,
                organization_name
            }

            let result = await dba.collection(config.users_collection).insertOne(data_obj);
            if (result.insertedCount) {
                let token = jwt.sign({ id: result.insertedId }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            } else {
                res.status(500).send("Data not inserted.")
            }
        }

    } catch (error) {
        res.status(400).send("There was a problem registering the user. " + error)
    }
}

module.exports.register = register;


// login API for existing users
const login = async (req, res) => {
    try {
        const db = req.app.locals.db;
        let dba = db.db(config.antarctica_db);

        if (req.body.email && req.body.password) {
            let result = await dba.collection(config.users_collection).find({ email: req.body.email }).project({ password: 1 }).toArray();

            if (result.length) {
                let passwordIsValid = bcrypt.compareSync(req.body.password, result[0].password);
                if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

                let token = jwt.sign({ id: result[0]._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.status(200).send({ auth: true, token: token });
            } else {
                res.status(404).send('No user found.');
            }
        } else {
            res.status(500).send('Invalid parameters.')
        }

    } catch (error) {
        res.sendStatus(400)
    }
}

module.exports.login = login;


// search using first_name, last_name, employee_id
const search = async (req, res) => {
    try {
        const db = req.app.locals.db;
        let dba = db.db(config.antarctica_db);

        let search_param = req.query.search_param;

        let query = { "$text": { "$search": search_param.toLowerCase() } }

        const result = await dba.collection(config.users_collection).find(query).toArray();

        res.send(result)
    } catch (error) {
        res.sendStatus(400)
    }
}

module.exports.search = search;


// sort complete list using first_name, last_name, employee_id, organization_name
const sort = async (req, res) => {
    try {
        const db = req.app.locals.db;
        let dba = db.db(config.antarctica_db);

        let sort_param = req.query.sort_param;
        let sort_order = req.query.sort_order;

        let value = (sort_order == "asc" ? 1 : -1)
        sort_param = sort_param.toLowerCase();

        const result = await dba.collection(config.users_collection).find().sort({ [sort_param]: value }).toArray();

        res.send(result)
    } catch (error) {
        res.sendStatus(400)
    }
}

module.exports.sort = sort;


// get all the users list in paginated form
const paginationList = async (req, res) => {
    try {
        const db = req.app.locals.db;
        let dba = db.db(config.antarctica_db);

        const limit = parseInt(req.query.limit); // number of data per page
        const skip = parseInt(req.query.skip);// page number

        var options = {
            allowDiskUse: false
        };

        var pipeline = [
            {
                "$match": {}
            },
            {
                "$skip": skip
            },
            {
                "$limit": limit
            }
        ];

        let result = await dba.collection(config.users_collection).aggregate(pipeline, options).toArray();
        res.send(result)

    } catch (error) {
        res.sendStatus(400)
    }
}

module.exports.paginationList = paginationList;


// One API to get the list of all users using search param, sort param, sort order and pagination
const userList = async (req, res) => {
    try {
        const db = req.app.locals.db;
        let dba = db.db(config.antarctica_db);

        let search_param = req.query.search_param;
        let sort_param = req.query.sort_param;
        let sort_order = req.query.sort_type;
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);

        let value = (sort_order == "asc" ? 1 : -1)
        sort_param = sort_param.toLowerCase();
        let query = { "$text": { "$search": search_param.toLowerCase() } }

        var options = {
            allowDiskUse: false
        };

        var pipeline = [
            {
                "$match": query
            },
            {
                "$skip": skip
            },
            {
                "$limit": limit
            },
            {
                "$sort": {
                    [sort_param]: value
                }
            }
        ];

        const result = await dba.collection(config.users_collection).aggregate(pipeline, options).toArray();

        res.send(result)

    } catch (error) {
        res.sendStatus(400)
    }
}

module.exports.userList = userList;
