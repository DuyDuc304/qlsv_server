const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");



const cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const UserController = require("./controller/user.controller");

app.listen(PORT, function () {
    console.log("Server is listenning...");
})

app.get('/', function (req, res) {
    res.send('Server Quản Lý Sinh Viên');
});

app.post('/login', function (req, res) {
    if (!req.body.user || !req.body.pass) {
        res.json({ err: 1, data: {} });
        return;
    }
    var data = {
        user: req.body.user,
        pass: req.body.pass,

    }
    UserController.login(data).then(function (value) {
        if (!value) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: value });
    });
});

app.post('/signup', function (req, res) {
    if (!req.body.name || !req.body.user || !req.body.pass) {
        res.json({ err: 1, data: {} });
        return;
    }
    var data = {
        name: req.body.name,
        user: req.body.user,
        pass: req.body.pass
    };
    UserController.signup(data).then(function (value) {
        if (!value) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: value });
    });
});

app.post('/note', function (req, res) {
    if (!req.body.id || !req.body.date) {
        res.json({ err: 1, data: {} });
        return;
    }
    var data = {
        id: req.body.id,
        date: req.body.date,
        text: req.body.text
    };
    UserController.writeNote(data).then(function (value) {
        if (value[0].modifiedCount == 0) {
            res.json({ err: 2, data: {} });
            return;
        }

        res.json({ err: 0, data: value[1] });

    });
});

app.get('/note', function (req, res) {
    if (!req.query.id) {
        res.json({ err: 1, data: {} });
        return;
    }
    UserController.getNote(req.query.id).then(function (value) {
        if (!value) {
            res.json({ err: 2, data: {} });
            return;

        }
        res.json({ err: 0, data: value });
    });
});
/// Xếp lịch
// Gửi danh sách
app.post('/calen', function (req, res) {
    if (!req.body.id || !req.body.calen) {
        res.json({ err: 1, data: {} });
        return;
    }
    var data = {
        id: req.body.id,
        calen: req.body.calen,
    };

    UserController.addCalen(data).then(function (value) {
        if (value.modifiedCount == 0) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: {} });
    });
});

app.get('/calen', function (req, res) {
    if (!req.query.id) {
        res.json({ err: 1, data: {} });
        return;
    }

    UserController.getCalen(req.query.id).then(function (value) {
        if (!value) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: value });
    });
});

// Tiết kiệm
app.post('/coin', function (req, res) {
    console.log(req.body);
    if (!req.body.id) {
        res.json({ err: 1, data: {} });
        return;
    }
    var data = {
        timeStart: req.body.timeStart,
        name: req.body.name,
        coin: req.body.coin,
        time: req.body.time,
    };

    UserController.postDefaultCoin(req.body.id, data).then(function (value) {
        if (value.modifiedCount == 0) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: {} });
    });
});

app.post('/coinDay', function (req, res) {
    console.log(req.body);
    if (!req.body.id || !req.body.coin) {
        res.json({ err: 1, data: {} });
        return;
    }
    var data = {
        coin: req.body.coin,
        time: req.body.time,
    };

    UserController.postCoin(req.body.id, data).then(function (value) {
        if (!value || value.modifiedCount == 0) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: {} });
    });
});

app.get('/coin', function (req, res) {
    if (!req.query.id) {
        res.json({ err: 1, data: {} });
        return;
    }
    UserController.getCoin(req.query.id).then(function (value) {
        if (!value || value === []) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: value });
    });
});
app.get('/coinDay', function (req, res) {

    if (!req.query.id) {
        res.json({ err: 1, data: {} });
        return;
    }
    UserController.getHistory(req.query.id).then(function (value) {
        if (!value || value === []) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: value });
    });
});
// Thời gian biểu
app.post('/notice', function (req, res) {
    console.log(req.body);
    if (!req.body.id || !req.body.time || !req.body.text) {
        res.json({ err: 1, data: {} });
        return;
    }
    var data = {
        text: req.body.text,
        time: req.body.time,
    };
    UserController.postNotice(req.body.id, data).then(function (value) {
        if (!value || value.modifiedCount == 0) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: {} });
    });
});
app.get('/notice', function (req, res) {
    if (!req.query.id) {
        res.json({ err: 1, data: {} });
        return;
    }
    UserController.getNotice(req.query.id).then(function (value) {
        if (!value || value === []) {
            res.json({ err: 2, data: {} });
            return;
        }
        res.json({ err: 0, data: value });
    });
});
// Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://duck:dArV53go0xO1fZnD@duck.bnivc.mongodb.net/qlsv?retryWrites=true&w=majority', function (err) {
    if (err) {
        console.log('err: ', err);
    } else {
        console.log('server mongo connected success');
    }
});
