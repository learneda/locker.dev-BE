require('dotenv').config();
const goodreads = require('goodreads-api-node');


const myCredentials = {
    key: process.env.GOODREADS_KEY,
    secret: process.env.GOODREADS_SECRET
  };
   
const gr = goodreads(myCredentials);

const callbackURL = 'http://localhost:8000/api/goodreads/cb'

gr.initOAuth(callbackURL)



module.exports = {
    async login(req, res, next) {
        gr.getRequestToken().then(url => { 
            /* redirect your user to this url to ask for permission */ 
            console.log('😝 getRequestTOkenURL',url)

            res.redirect(url)
        });
    },

    async goodreadsCB(req, res, next) {
        gr.getAccessToken()
        .then(() => { 
            gr.getCurrentUserInfo().then((res) => {
                console.log('res from getCurrentUserInfo',res)

                gr.getOwnedBooks(res.user.id).then((res) => {
                    console.log(res)
                    console.log(res.owned_books)
                })

            })
        });
    }
};
