from flask import Flask
from flask_mongoalchemy import MongoAlchemy
from mongoalchemy.fields import *

app = Flask(__name__)
app.config['MONGOALCHEMY_DATABASE'] = 'tradingfishery_20200826'
app.config['MONGOALCHEMY_CONNECTION_STRING'] = 'mongodb://localhost:27017/tradingfishery_20200826'
db = MongoAlchemy(app)

class users(db.Document):
    nickName = StringField()
    firstName = StringField()
    lastName = StringField()
    email = StringField()
    password = StringField()
    avatarurl = StringField()
    role=StringField()
    gender=StringField()
    age=StringField()
    typeoftrader=StringField()
    phonenumber=StringField()
    country=StringField()
    state=StringField()
    profilecompletepercent=StringField()
    privatemessageflag=BoolField()
    shareflag=BoolField()
    sharemethod = StringField()
    activeflag=BoolField()
    followedNumbers = StringField()
    logstatus = BoolField

class earningreportstocks(db.Document):
    symbol = StringField()
    date = StringField()
    epsEstimated = FloatField()

class earningstocksflag(db.Document):
    id = IntField()
    date = StringField()
    flag = BoolField()

class followerslist(db.Document):
    followeduseremail = StringField()
    followinguseremail = StringField()

class followersstatistics(db.Document):
    useremail = StringField()
    username = StringField()
    count = IntField()

class stockData(db.Document):
    symbol = StringField()
    sector = StringField()
    trade_timing = BoolField()
    short_long = BoolField()
    trade_timeframe = BoolField()
    trade_score = IntField()
    trade_score = FloatField()
    current_stockprice = FloatField()
    strockprice_change = FloatField()
    alert_price = FloatField()

class stockInfo(db.Document):
    symbol = StringField()
    name = StringField()
    price = StringField()
    changesPercentage = StringField()
    change = StringField()
    # dayLow = FloatField()
    # dayHigh = FloatField()
    yearHigh = StringField()
    yearLow = StringField()
    # marketCap = FloatField()
    # priceAvg50 = FloatField()
    # priceAvg200 = FloatField()
    # volume = IntField()
    # avgVolume = IntField()
    exchange = StringField()
    # open = FloatField()
    # previousClose = FloatField()
    # eps = FloatField()
    # pe = FloatField()
    earningsAnnouncement = StringField()
    # sharesOutstanding = IntField()
    # timestamp = IntField()

class watchlist(db.Document):
    username = StringField()
    useremail = StringField()
    watchid = StringField()
    symbol = StringField()
    symbolname = StringField()
    sector = StringField()
    yearhigh = FloatField()
    tradetiming = StringField()
    shortorlong = StringField()
    tradetimeframe = StringField()
    entryprice = StringField()
    entrychange = StringField()
    stoploss = StringField()
    exitprice = StringField()
    alertprice = StringField()
    alertpricechange = StringField()
    rewardprice = StringField()
    viewstatus = BoolField()
    dateadded = StringField()
    comment = StringField()
    earningdate = StringField()
    addedprice = StringField()
    tradescore = StringField()
    repeatfield = StringField()	

class watchlistTemplate(db.Document):
    username = BoolField()
    useremail = BoolField()
    symbol = BoolField()
    sector = BoolField()
    yearhigh = BoolField()
    currentprice = BoolField()
    currentpricechange = BoolField()
    tradetiming = BoolField()
    shortorlong = BoolField()
    tradetimeframe = BoolField()
    entryprice = BoolField()
    entrychange = BoolField()
    stoploss = BoolField()
    exitprice = BoolField()
    alertprice = BoolField()
    rewardprice = BoolField()
    viewstatus = BoolField()
    dateadded = BoolField()
    comment = BoolField()
    earningdate = BoolField()
    addedprice = BoolField()
    addedpricechange = BoolField()

class shareWatchlistTemplate(db.Document):
    username = BoolField()
    useremail = BoolField()
    symbol = BoolField()
    sector = BoolField()
    yearhigh = BoolField()
    currentprice = BoolField()
    currentpricechange = BoolField()
    tradetiming = BoolField()
    shortorlong = BoolField()
    tradetimeframe = BoolField()
    entryprice = BoolField()
    entrychange = BoolField()
    stoploss = BoolField()
    exitprice = BoolField()
    alertprice = BoolField()
    rewardprice = BoolField()
    viewstatus = BoolField()
    dateadded = BoolField()
    comment = BoolField()
    earningdate = BoolField()
    addedprice = BoolField()
    addedpricechange = BoolField()

class contacts(db.Document):
    fromperson = StringField()
    toperson = StringField()
    topersonname = StringField()
    topersonimage = StringField()
    lastchattime = DateTimeField()

class chats(db.Document):
    fromperson = StringField()
    toperson = StringField()
    lastchattime = DateTimeField()
    content = StringField()
    readflag = BoolField()

class registercode(db.Document):
    useremail = StringField()
    activecode = StringField()
    registertime = FloatField()
    forgetpwdactivecode = StringField()
    forgetpwdtime = FloatField()

class userseveryday(db.Document):
    numbera = StringField()
    datea = DateTimeField()

class stokprice(db.Document):
    id = StringField()
    timea = StringField()
    datea = DateTimeField()
