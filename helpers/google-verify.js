const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerified = async (idToken = '') => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    //? Renombrada la variable picture ya que en model se declaro como image

    const { name, picture: image, email } = ticket.getPayload();

    return { name, image, email };
}

module.exports = {
    googleVerified
}
