/**
 * Created by Lisa Joanno on 31/01/17.
 */

/*
URL de la base de données en Production sur heroku : mongodb://lisa:weblisa@ds137729.mlab.com:37729/web-map-project-si5
 */

module.exports = {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/'
};
