const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors')
const roleDefController = require('./src/server/controller/RoleDefRequestHandler')

// serve static files from public directory
const rootDir = path.resolve(__dirname);
app.use(cors());
app.use(express.static(rootDir));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

/* GET home page. */
function fetch_fn(req, res, next) {
  try {
    {
      // This is for backwards compability (BQA and BDEV) - where web app is served from a root path.
      res.sendFile(path.join(rootDir, 'src', 'index_nodestart.html'));
    }
  } catch (err) {
    console.log(err.message);
  }
}

app.get('/searchRoles', roleDefController.searchRoles);
app.post('/updateRole', roleDefController.updateRole);
app.post('/deleteRole', roleDefController.deleteRole);
app.post('/softDeleteRole', roleDefController.softDeleteRole);
app.get('/*', function (req, res, next) { fetch_fn(req, res, next); });

var listenPort = process.env.PORT || 3000

app.listen(listenPort, function () {
  console.log('Listening Port:', listenPort)
});
