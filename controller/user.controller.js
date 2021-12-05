const mongoose = require("mongoose");
const UserModel = require("../model/user.model");

module.exports.signup = async function (data) {
    var userExists = await UserModel.findOne({ user: data.user });
    console.log(userExists);
    if (userExists) {
        return undefined;
    }
    var userNew = new UserModel({
        name: data.name,
        user: data.user,
        pass: data.pass,
    });

    var json = await userNew.save();
    return json;
}

module.exports.login = async function (data) {
    var json = await UserModel.findOne({ $and: [{ user: data.user }, { pass: data.pass }] });
    return json;
}

module.exports.writeNote = async function (data) {
    var user = await UserModel.findById(data.id);
    if (!user) {
        return { modifiedCount: 0 };
    }
    var list = user.note;
    var index = list.findIndex(element => element.date === data.date);
    if (index == -1) {
        list.push({ date: data.date, text: data.text });
    } else {
        list[index].text = data.text;
    }
    var json = await UserModel.updateOne({ _id: data.id }, { $set: { note: list } });
    user = await UserModel.findById(data.id);
    list = user.note;
    if (!list) {
        list = [];
    }
    return json, list;
}

module.exports.getNote = async function (id) {
    var user = await UserModel.findById(id);

    if (!user) {
        return undefined;
    }
    var list = user.note;
    return list;
}

module.exports.addCalen = async function (data) {
    var user = await UserModel.findById(data.id);
    if (!user) {
        return { modifiedCount: 0 };
    }
    var con = JSON.parse(data.calen);
    var json = await UserModel.updateOne({ _id: data.id }, { $set: { calendar: con } });
    return json;
}

module.exports.getCalen = async function (id) {
    var user = await UserModel.findById(id);
    if (!user) {
        return undefined;
    }
    list = user.calendar;
    return list;
}

module.exports.postDefaultCoin = async function (id, data) {
    if (data.coin === "false") {
        var json = await UserModel.updateOne({ _id: id }, { $set: { coin: null } });
        return json;
    }
    var json = await UserModel.updateOne({ _id: id }, { $set: { coin: data } });
    return json;
}

module.exports.getCoin = async function (id) {
    var json = await UserModel.findById(id);
    if (!json) {
        return undefined;
    }
    var list = json.coin;
    return list;
}

module.exports.getHistory = async function (id) {
    var json = await UserModel.findById(id);

    if (!json) {
        return undefined;
    }

    var list = json.coin.history;
    return list;
}

module.exports.postCoin = async function (id, data) {

    var user = await UserModel.findById(id);
    if (!user) {
        return undefined;
    }


    var coin = user.coin;
    var coinHis = 0;


    console.log(coinHis);
    if (!coin.history) {
        coin.history = [data];
    } else {
        var i = coin.history.findIndex((element) => element.time === data.time);
        if (i == -1) {
            coin.history.push(data);
        } else {
            coin.history[i].coin = `${parseFloat(coin.history[i].coin) + parseFloat(data.coin)}`;
        }

    }
    coin.history.forEach(element => {
        coinHis += parseFloat(element.coin);
    });
    if (coinHis >= parseFloat(coin.coin)) {
        var json = await UserModel.updateOne({ _id: id }, { $set: { coin: null } });
        return undefined;
    }
    var json = await UserModel.updateOne({ _id: id }, { $set: { coin: coin } });
    return json;
}


module.exports.postNotice = async function (id, data) {
    var user = await UserModel.findById(id);
    if (!user) {
        return undefined;
    }
    var json = await UserModel.updateOne({ _id: id }, { $addToSet: { notice: data } });
    return json;
}


module.exports.getNotice = async function (id) {
    var user = await UserModel.findById(id);
    if (!user) {
        return undefined;
    }
    var list = user.notice;
    return list;
}