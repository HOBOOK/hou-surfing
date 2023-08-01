import express from 'express'

// Create express router
const router = express.Router()

const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request);
  Object.setPrototypeOf(res, app.response);
  req.res = res;
  res.req = req;
  next();
});

router.post('/login', (req, res) => {
  if (req.body.id === 'admin' && req.body.pw === 'a00000') {
    req.session.authUser = req.body.id
    return res.json({ id: 'admin' });
  }
  return res.json({ id: '' });
});

router.post('/logout', (req, res) => {
  delete req.session.authUser;
  res.json({ ok: true });
});

// Export the server middleware
export default {
  path: '/apis',
  handler: router
};