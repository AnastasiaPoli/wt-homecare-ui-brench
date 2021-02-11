from lib2to3.refactor import _identity

from flask_restful import Resource, reqparse
from flask_jwt_extended import (create_access_token, create_refresh_token, decode_token, jwt_required, jwt_refresh_token_required,
                                get_jwt_identity, get_raw_jwt)
import hashlib
import jwt
import requests
from model import users,stockInfo,watchlist,stockData, db,watchlistTemplate
import json
from urllib.request import urlopen
from datetime import datetime, timedelta
import time
from pprint import pprint
from pymongo import MongoClient
from flask import jsonify, request, flash, redirect, url_for
from werkzeug.utils import secure_filename
import werkzeug
import os
import random
import http.client

###path = "E:\\CHON\\work\\GitHub\\TradingFishery\\TheStockWatchlists\\public\\images\\avatars\\"
path = "//var//www//app.thestockwatchlist.com//html//images//avatars//"
#apikey = "525f52f4ab862d8f9dd17476d613de0a"
apikey = "fb74fb8e61050129a7ccaa0fb715e2fa"
JWT_SECRET_KEY = 'Hero-Hazan-Trading-Watchlist'

mongo_client= MongoClient("mongodb://localhost:27017/")
###mongo_client= MongoClient("mongodb://admin:Heropassword@104.128.64.116:27017/")
ddbb = mongo_client["tradingfishery_20200826"]

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = '/path/uploads'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def sendEmail(token, flag, remail):
    print("token", token)
    conn = http.client.HTTPSConnection("api.sendgrid.com")
    conn1 = http.client.HTTPSConnection("api.sendgrid.com")
    conn2 = http.client.HTTPSConnection("api.sendgrid.com")
    print("d")
    if flag == True:
        payload = "{\"personalizations\":[{\"to\":[{\"email\":\"ch109437999@gmail.com\",\"name\":\"C Hero\"}],\"subject\":\"Verification code for register\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"ch109437999@gmail.com\",\"name\":\"John Doe\"}}"
        payload1 = "{\"personalizations\":[{\"to\":[{\"email\":\"meirhasin@gmail.com\",\"name\":\"Meir Hasin\"}],\"subject\":\"Verification code for register\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"meirhasin@gmail.com\",\"name\":\"John Doe\"}}"    
        payload2 = "{\"personalizations\":[{\"to\":[{\"email\":\""+remail+"\",\"name\":\"Meir Hasin\"}],\"subject\":\"Verification code for register\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"meirhasin@gmail.com\",\"name\":\"John Doe\"}}"    
    else:
        payload = "{\"personalizations\":[{\"to\":[{\"email\":\"ch109437999@gmail.com\",\"name\":\"C Hero\"}],\"subject\":\"Verification code for reset password\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"ch109437999@gmail.com\",\"name\":\"John Doe\"}}"
        payload1 = "{\"personalizations\":[{\"to\":[{\"email\":\"meirhasin@gmail.com\",\"name\":\"Meir Hasin\"}],\"subject\":\"Verification code for reset password\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"meirhasin@gmail.com\",\"name\":\"John Doe\"}}"    
        payload2 = "{\"personalizations\":[{\"to\":[{\"email\":\""+remail+"\",\"name\":\"Meir Hasin\"}],\"subject\":\"Verification code for register\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"meirhasin@gmail.com\",\"name\":\"John Doe\"}}"    
#    payload = "{\"personalizations\":[{\"to\":[{\"email\":\"meirhasin@gmail.com\",\"name\":\"Meir Hasin\"}],\"subject\":\"Verification code for sign up of Thestockwatchlist.com\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"meirhasin@gmail.com\",\"name\":\"John Doe\"}}"    
    print("remail", remail)
    print("payload",payload)
    print("payload2",payload2)
    headers = {
        #'authorization': "Bearer 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",
        #'authorization': "Bearer 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",
        'authorization': "Bearer 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",
        'content-type': "application/json"
        }

    conn1.request("POST", "/v3/mail/send", payload1, headers)
    conn2.request("POST", "/v3/mail/send", payload2, headers)
    conn.request("POST", "/v3/mail/send", payload, headers)

    res = conn.getresponse()
    res1 = conn1.getresponse()
    res2 = conn2.getresponse()
    data = res.read()
    data1 = res1.read()
    data2 = res2.read()

def sendEmailToAdmin(token):
    print("token", token)
    conn = http.client.HTTPSConnection("api.sendgrid.com")
    conn1 = http.client.HTTPSConnection("api.sendgrid.com")
    print("d")
    payload1 = "{\"personalizations\":[{\"to\":[{\"email\":\"ch109437999@gmail.com\",\"name\":\"C Hero\"}],\"subject\":\"Message From Contact Us Page\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"ch109437999@gmail.com\",\"name\":\"John Doe\"}}"
    payload = "{\"personalizations\":[{\"to\":[{\"email\":\"meirhasin@gmail.com\",\"name\":\"Meir Hasin\"}],\"subject\":\"Message From Contact Us Page\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"meirhasin@gmail.com\",\"name\":\"John Doe\"}}"    
#    payload = "{\"personalizations\":[{\"to\":[{\"email\":\"meirhasin@gmail.com\",\"name\":\"Meir Hasin\"}],\"subject\":\"Verification code for sign up of Thestockwatchlist.com\"}],\"content\": [{\"type\": \"text/plain\", \"value\": \""+str(token)+"\"}],\"from\":{\"email\":\"activation@thestockwatchlist.com\",\"name\":\"TheStockwatchlist.com\"},\"reply_to\":{\"email\":\"meirhasin@gmail.com\",\"name\":\"John Doe\"}}"    
    print(payload)
    headers = {
        'authorization': "Bearer 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",
        'content-type': "application/json"
        }

#    conn1.request("POST", "/v3/mail/send", payload1, headers)
    conn.request("POST", "/v3/mail/send", payload, headers)

    res = conn.getresponse()
#    res1 = conn1.getresponse()
    data = res.read()
#    data = res1.read()

def findUser(email):
    col = ddbb['users']
    query = {
        'email' : email
    }
    users = col.find(query)
    return users

def minute_interval(start, end):
    returnValue=""
    delta = end.hour - start.hour
    if (delta == 0):
        delta = end.minute - start.minute
        returnValue = str(delta) + "minutes ago"
    else:
        if (delta == 1):
            if end.minute < start.minute:
                delta = 60 - (start.minute - end.minute)
                returnValue = str(delta) + "minutes ago"
            else:
                returnValue = str(delta) + "hours ago"
        else:
            returnValue = str(delta) + "hours ago"
    return returnValue

class GetTokenForgetPassword(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('useremail', help = 'Email cannot be blank', required = True)
            parser.add_argument('token', help = 'Email cannot be blank', required = True)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            token = random.randint(100000, 999999)
            sendEmail(token, False, data['useremail'])

            col2 = ddbb['registercode']
            query2 = {'useremail':data['useremail']}
            mydict2 = {"$set":{"useremail":data['useremail'], 'forgetpwdactivecode':token,'forgetpwdtime':datetime.now().timestamp()}}            
            col2.update(query2, mydict2, True)            
            response = jwt.encode({'result' : 'ok','message' : "ok",'token' : token}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class SaveImages(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')

        data = parser.parse_args()

        # check if the post request has the file part
        if 'file' not in data:
            flash('No file part')
            return redirect(request.url)
        file = data['file']
        print(file)
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(path+filename)
            return {
                'result' : 'ok',
                'message' : 'ok',
                'imageurl': filename,
            }
        return jsonify({
            'result': 'fail',
            'error' : 'wrong credential'
        })

class UpdateProfile(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'username cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('avatarurl', help = 'avatarurl cannot be blank', required = False)
            # parser.add_argument('gender', help = 'avatarurl cannot be blank', required = False)
            # parser.add_argument('age', help = 'avatarurl cannot be blank', required = False)
            # parser.add_argument('typeoftrader', help = 'avatarurl cannot be blank', required = False)
            # parser.add_argument('phone', help = 'avatarurl cannot be blank', required = False)
            # parser.add_argument('country', help = 'avatarurl cannot be blank', required = False)
            # parser.add_argument('city', help = 'avatarurl cannot be blank', required = False)
            # parser.add_argument('privatemessageflag', help = 'avatarurl cannot be blank', required = False)
            # parser.add_argument('shareflag', help = 'avatarurl cannot be blank', required = False)
            parser.add_argument('token', help = 'avatarurl cannot be blank', required = True)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            col = ddbb['users']

            query = {
                "email" : data['useremail']
            }            

            current_user = col.find(query)
            if current_user[0]['profilecompletepercent'] == "":
                percentValue = 0
            else:
                percentValue = int(current_user[0]['profilecompletepercent'])
            
            print("aa", current_user[0])
            print("bb", percentValue)
            print("data", data)

            myquery = {"email" : data['useremail']}
            # print("aa",data['privatemessageflag'],"bb",type(data['privatemessageflag']))
            if data.get('privatemessageflag'):
                pmf = True
            else:
                pmf = False
            if data.get('shareflag'):
                sf = True
            else:
                sf = False
            print("a")
            if data.get('avatarurl') == None:
                if data['gender'] != "":
                    if current_user[0]['gender'] == "":
                        percentValue = percentValue + 10
                else:
                    if current_user[0]['gender'] != "":
                        percentValue = percentValue - 10

                if data['typeoftrader'] != "":
                    if current_user[0]['typeoftrader'] == "":
                        percentValue = percentValue + 20
                else:
                    if current_user[0]['typeoftrader'] != "":
                        percentValue = percentValue - 20

                if data['age'] != "":
                    if current_user[0]['age'] == "":
                        percentValue = percentValue + 10
                else:
                    if current_user[0]['age'] != "":
                        percentValue = percentValue - 10

                if data['phone'] != "":
                    if current_user[0]['phonenumber'] == "":
                        percentValue = percentValue + 20
                else:
                    if current_user[0]['phonenumber'] != "":
                        percentValue = percentValue - 20

                if data['country'] !="":
                    if current_user[0]['country'] == "":
                        percentValue = percentValue + 20
                else:
                    if current_user[0]['country'] != "":
                        percentValue = percentValue - 20

                mydict = {"$set":{"gender":data['gender'],"age":data['age'],"typeoftrader":data['typeoftrader'],"phonenumber":data['phone'],"country":data['country'], "profilecompletepercent":str(percentValue),"privatemessageflag":pmf,"shareflag":sf}}
            else:
                if current_user[0]['avatarurl'] == "":
                    percentValue = percentValue + 20
                mydict = {"$set":{"avatarurl":data['avatarurl'],"profilecompletepercent":str(percentValue)}}            
            print("abc")
            col.update(myquery, mydict,True)
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'percentValue' : percentValue}, JWT_SECRET_KEY)
            print("response", response)
            return {
                'result' : str(response)
            }

        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class ResetPassword(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('email', help = 'Email cannot be blank', required = True)
            # parser.add_argument('password', help = 'Password cannot be blank', required = True)
            parser.add_argument('token', help = 'Password cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            col = ddbb['users']
            query = {
                "email" : data['email']
            }            
            userDB = col.find(query)
            if userDB.count() != 0:
                print("aa");
                mydict = {"$set":{"password":hashlib.md5(data['password'].encode()).hexdigest()}}            
                print("aa", mydict);
                col.update(query, mydict,True)
                print("aaa")
                response = jwt.encode({'result' : 'ok','message' : 'ok'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }
            else:
                print("bb");
                response1 = jwt.encode({'result' : 'failed','message' : 'unregister email'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }

        except:
            response3 = jwt.encode({'result' : 'failed'}, JWT_SECRET_KEY)
            return {
                'result' : str(response3)
            }

class ResendCode(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('email', help = 'Email cannot be blank', required = True)
            # parser.add_argument('flag', help = 'Email cannot be blank', required = True)
            parser.add_argument('token', help = 'Email cannot be blank', required = True)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            token = random.randint(100000, 999999)
            if data['flag'] == 'true':
                sendEmail(token, True, data['email'])

                col2 = ddbb['registercode']
                query2 = {'useremail':data['email']}
                mydict2 = {"$set":{"useremail":data['email'], 'activecode':token,'registertime':datetime.now().timestamp()}}            
                col2.update(query2, mydict2, True)
                response = jwt.encode({'result' : 'ok','message' : 'ok'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }
            else:
                sendEmail(token, False, data['email'])

                col1 = ddbb['registercode']
                query1 = {'useremail':data['email']}
                mydict1 = {"$set":{"useremail":data['email'], 'forgetpwdactivecode':token,'forgetpwdtime':datetime.now().timestamp()}}            
                col1.update(query1, mydict1, True)
                response1 = jwt.encode({'result' : 'ok','message' : 'ok'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }
        except:
            raise Exception()

class UserRegistration(Resource):
    def post(self):
        try:
            print('a')
            parser = reqparse.RequestParser()
            print('a')
            parser.add_argument('token', help = 'Email cannot be blank', required = True)
            print('a')
            # parser.add_argument('nickName', help = 'Email cannot be blank', required = True)
            # parser.add_argument('email', help = 'Email cannot be blank', required = True)
            # parser.add_argument('password', help = 'Password cannot be blank', required = True)
            # parser.add_argument('firstName', help = 'Firstname cannot be blank', required = True)
            # parser.add_argument('lastName', help = 'Lastname cannot be blank', required = True)
            # parser.add_argument('role', help = 'Lastname cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            print("data",data)
            col = ddbb['users']
            query = {
                "email" : data['email'],
                "activeflag" : True
            }            

            userDB = col.find(query)
            query = {
                "email" : data['email'],
                "activeflag" : False
            }            
            userDB1 = col.find(query)
            print("userdb1count", userDB1.count())
            if userDB1.count() != 0:
                col12 = ddbb['registercode']
                query12 = {
                    'useremail' : data['email']
                }
                registerUser = col12.find(query12)
                print("registerUser", registerUser[0])
                print("registerUsertime", datetime.now().timestamp()- registerUser[0]['registertime'] )

                if datetime.now().timestamp() - registerUser[0]['registertime'] > 15 * 60:
                    print("intervaltime", datetime.now().timestamp() - registerUser[0]['registertime'])
                    col.remove(query, True)
                else:
                    print("faild user")
                    response12 = jwt.encode({'result' : 'error','message' : 'User already exists'}, JWT_SECRET_KEY)
                    return {
                        'result' : str(response12)
                    }

            if userDB.count() != 0:
                response1 = jwt.encode({'result' : 'error','message' : 'User already exists'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }


            col = ddbb['users']
            query = {
                "nickName" : data['nickName'],
                "activeflag" : True
            }            

            userDB = col.find(query)
            query = {
                "nickName" : data['nickName'],
                "activeflag" : False
            }            
            userDB1 = col.find(query)

            if userDB.count() != 0:
                response2 = jwt.encode({'result' : 'error','message' : 'nickName'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response2)
                }
            if userDB1.count() != 0:
                col.remove(query, True)

            print("a")
            token = random.randint(100000, 999999)
            sendEmail(token, True, data['email'])
            print("n")
            mydict = {"nickName" : data['nickName'],"firstName" : data['firstName'], "lastName" : data['lastName'],"email":data['email'], "password":hashlib.md5(data['password'].encode()).hexdigest(), "avatarurl":"", "role":data['role'], "age":"", "country":"","gender":"", "phonenumber":"", "state":"", "typeoftrader":"", "profilecompletepercent":"", "privatemessageflag":True, "shareflag":True, "activeflag":False, "sharemethod":"2"}
            #usersDb = users(firstName = data['firstName'], lastName = data['lastName'],email=data['email'], password=hashlib.md5(data['password'].encode()).hexdigest())
            #usersDb.save()
            col.insert(mydict,True)

            col1 = ddbb['followersstatistics']
            mydidct1= {"useremail": data['email'], "username":data['nickName'], "count" : 0}
            col1.insert(mydidct1, True)

            col2 = ddbb['registercode']
            query2 = {'useremail':data['email']}
            mydict2 = {"$set":{"useremail":data['email'], 'activecode':token,'registertime':datetime.now().timestamp()}}            
            col2.update(query2, mydict2, True)
            print('b')
            response = jwt.encode({'result' : 'ok','message' : 'ok'}, JWT_SECRET_KEY)
            print('a', response)

            myquery3 = {
                "username" : data['nickName'],
                "useremail" : data['email'],
                "symbol" : True,
                "sector" : True,
                "tradetiming" : False,
                "shortorlong" : False,
                "tradetimeframe" : False,
                "yearhigh" : False,
                "currentprice" : True,
                "currentchange" : True,
                "entryprice" : False,
                "entrychange" : False,
                "stoploss" : False,
                "tradescore" : False,
                "exitprice" : False,
                "earningdate" : True,
                "alertprice" : True,
                "rewardinR" : False,
                "addedprice" : False,
                "addedpricechange" : False,
                "dateadded" : True,
                "comment" : False,
            }
            col3 = ddbb['watchlistTemplate']
            col3.insert(myquery3, True)

            myquery4 = {
                "username" : data['nickName'],
                "useremail" : data['email'],
                "symbol" : True,
                "sector" : False,
                "tradetiming" : True,
                "shortorlong" : True,
                "tradetimeframe" : False,
                "yearhigh" : True,
                "currentprice" : True,
                "currentchange" : True,
                "entryprice" : False,
                "entrychange" : False,
                "stoploss" : False,
                "tradescore" : False,
                "exitprice" : False,
                "earningdate" : True,
                "alertprice" : False,
                "rewardinR" : False,
                "addedprice" : False,
                "addedpricechange" : False,
                "dateadded" : False,
                "comment" : False,
            }
            col4 = ddbb['shareWatchlistTemplate']
            col4.insert(myquery4, True)

            return {
                'result' : str(response)
            }
        except:
            raise Exception()

class ActiveVerify(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            # parser.add_argument('token', help = 'token cannot be blank', required = True)
            # parser.add_argument('flag', help = 'flag cannot be blank', required = True)

            parser.add_argument('token', help = 'token cannot be blank', required = True)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            if data['flag'] == "true":
                col = ddbb['registercode']
                query={'useremail':data['useremail']}
                user = col.find(query)
                #print(user[0])
                if str(user[0]['activecode']) != data['token']:
                    return {
                        'result' : 'failed',
                        'message' : 'activecode',
                        'timestamp' : datetime.now().timestamp()
                    }
                print(datetime.now().timestamp())
                print(type(datetime.now().timestamp()))
                print(user[0]['registertime'])
                print(datetime.now().timestamp() - user[0]['registertime'])
                if (datetime.now().timestamp() - user[0]['registertime']) > 900:
                    response1 = jwt.encode({'result' : 'failed','message' : 'time','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                    return {
                        'result' : str(response1)
                    }
                response2 = jwt.encode({'result' : 'ok','message' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                return {
                    'result' : str(response2)
                }

            else:
                print("a")
                col1 = ddbb['registercode']
                query1={'useremail':data['useremail']}
                print("b")
                user1 = col1.find(query1)
                print("c")
                print(user1[0])
                if str(user1[0]['forgetpwdactivecode']) != data['token']:
                    response3 = jwt.encode({'result' : 'failed','message' : 'activecode','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                    return {
                        'result' : str(response3)
                    }
                if (datetime.now().timestamp() - user1[0]['forgetpwdtime']) > 900:
                    response4 = jwt.encode({'result' : 'failed','message' : 'activecode','time' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                    return {
                        'result' : str(response4)
                    }
                response5 = jwt.encode({'result' : 'ok','message' : 'ok','time' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                return {
                    'result' : str(response5)
                }

        except:
            raise Exception()

class GetUserData(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            parser.add_argument('token', help = 'email cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb['users']
            query = {
                "email" : data['useremail']
            }            

            print(data['useremail'])
            userDB = col.find(query)
            print(userDB[0])
            user = dict()
            for item in userDB:
                user['name'] = item['nickName']
                if item['avatarurl'] == "":
                    user['avatar'] = ""
                else:
                    user['avatar'] = "/images/avatars/" + item['avatarurl']

                user['city'] = item['state']
                user['country'] = item['country']
                user['profilecompletepercent'] = item['profilecompletepercent']
                user['typeoftrader'] = item['typeoftrader']
                user['phone'] = item['phonenumber']
                user['gender'] = item['gender']
                user['age'] = item['age']
                user['privatemessageflag'] = item['privatemessageflag']
                user['shareflag'] = item['shareflag']
                user['sharemethod'] = item['sharemethod']
            response1 = jwt.encode({'result' : 'ok','message' : 'ok','data' : user}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }
            
        except:
            response2 = jwt.encode({'result' : 'fail','error' : 'wrong credential'}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class ValidWatchlist(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'username cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('userrole', help = 'userrole cannot be blank', required = True)
            parser.add_argument('token', help = 'userrole cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)            
            query = {
                "username" : data['username'],
                "useremail" : data['useremail'],
            }            
            col = ddbb['watchlist']
            watchnum = col.find(query).count()
            print(watchnum)
            if data['userrole'] == "2":
                if watchnum < 2:
                    response = jwt.encode({'result' : 'ok','msg' : 'you can import','count' : watchnum,}, JWT_SECRET_KEY)
                    return {
                        'result' : str(response)
                    }
                else:
                    response1 = jwt.encode({'result' : 'ok','msg' : 'you can import','count' : watchnum,}, JWT_SECRET_KEY)
                    return {
                        'result' : str(response1)
                    }
        except:
            response2 = jwt.encode({'result' : 'error','error' : 'wrong credential'}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }
class SetActive(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('email', help = 'Email cannot be blank', required = True)
            parser.add_argument('token', help = 'token cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            query = {
                "email" : data['email']
            }            
            col = ddbb['users']            
            if col.count != 0:
                mydict = {"$set":{"activeflag":True}}            
                col.update(query, mydict,True)
                response = jwt.encode({'result' : 'ok','msg' : 'ok'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }
            else:
                response1 = jwt.encode({'result' : 'error','error' : 'unregister'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }
        except:
            response2 = jwt.encode({'result' : 'error','error' : 'wrong credential'}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class UserLogin(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('email', help = 'Email cannot be blank', required = True)
            # parser.add_argument('password', help = 'Password cannot be blank', required = True)
            parser.add_argument('token', help = 'Password cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            query = {
                "email" : data['email']
            }            

            col = ddbb['users']
            current_user = col.find(query)

            if current_user.count() == 0:
                response = jwt.encode({'error' : 'Cannot get email or password is incorrect'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }

            password = hashlib.md5(data['password'].encode()).hexdigest()
            if current_user[0]['password'] == password :
                myquery = {"email" : data['email']}
                mydict = {"$set":{"logstatus":True}}
                #watchlistDb = watchlist(username = data['username'], useremail = data['useremail'],symbol=data['symbol'], sector=data['sector'], tradetiming=data['tradetiming'],shortorlong=data['shortorlong'], tradetimeframe = data['tradetimeframe'], entryprice = data['entryprice'], stoploss=data['stoploss'], exitprice=data['exitprice'],alertprice=data['alertprice'], rewardprice=data['rewardprice'])
                #watchlistDb.save()
                col.update(myquery, mydict,True)
                print("a")

                col1 = ddbb['userseveryday']
                print("b")
                myquery1 = {"datea": datetime.now().strftime("%d/%m/%y")}
                currentstatus = col1.find(myquery1)
                print("c", currentstatus)
                if currentstatus.count() == 0:
                    print("d")
                    col1.insert({"datea":datetime.now().strftime("%d/%m/%y"), "numbera":"1"})
                else:
                    print("e")
                    mydict1 = {"$set":{"numbera":str(int(currentstatus[0]['numbera']) + 1)}}
                    col1.update(myquery1, mydict1)

                access_token = create_access_token(identity={"email" : current_user[0]['email'], "name":current_user[0]['nickName'],"image":current_user[0]['avatarurl']})
                #access_token = create_access_token(identity=current_user['email'])
                print("a")
                #refresh_token = create_refresh_token(identity={"email" : current_user['email'], "name":current_user['firstName'] +  current_user['lastName'],"image":current_user['avatarurl']})
                response1 = jwt.encode({
                    'result' : 'ok',
                    'message' : 'ok',
                    'name' : current_user[0]['nickName'],
                    'image' : current_user[0]['avatarurl'],
                    'email': current_user[0]['email'],
                    'role' : current_user[0]['role'],
                    'activeflag' : current_user[0]['activeflag'],
                    'access_token': access_token,
#                    'refresh_token': refresh_token
                }, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }
            else:
                response2 = jwt.encode({'result' : 'fail','error':'wrong credential'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response2)
                }
        except:
            raise Exception("Cannot login user")

class UserLogout(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('email', help = 'Email cannot be blank', required = True)
            # parser.add_argument('password', help = 'Password cannot be blank', required = True)
            parser.add_argument('token', help = 'Password cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            print("data", data)
            query = {
                "email" : data['email']
            }            
            mydict = {"$set":{"logstatus":False}}
            print("mydict", mydict)
            col = ddbb['users']
            col.update(query, mydict,True)
            print ('ok')
            response2 = jwt.encode({'result' : 'ok','msg':'ok'}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

        except:
            raise Exception("Cannot login user")


class GetStockdata(Resource):
    def get(self):
        try:
            url = "https://financialmodelingprep.com/api/v3/quotes?apikey=" + apikey
            response = urlopen(url)
            data = response.read().decode("utf-8")
            jsonData = json.loads(data)
            i = 0
            for x in jsonData:
                if x['name'] is None:
                    namestr = 'null'
                else:
                    namestr = str(x['name'])
                if x['price'] is None:
                    pricestr = 'null'
                else:
                    pricestr = str(x['price'])
                if x['changesPercentage'] is None:
                    changesPercentagestr = 'null'
                else:
                    changesPercentagestr = str(x['changesPercentage'])
                if x['change'] is None:
                    changestr = 'null'
                else:
                    changestr = str(x['change'])
                if x['yearHigh'] is None:
                    yearHighstr = 'null'
                else:
                    yearHighstr = str(x['yearHigh'])
                if x['yearLow'] is None:
                    yearLowstr = 'null'
                else:
                    yearLowstr = str(x['yearLow'])
                if x['exchange'] is None:
                    exchangestr = 'null'
                else:
                    exchangestr = str(x['exchange'])
                if x['earningsAnnouncement'] is None:
                    earningsAnnouncementstr = 'null'
                else:
                    earningsAnnouncementstr = str(x['earningsAnnouncement'])                
                stockInfoDb = stockInfo(symbol = x['symbol'], name = namestr, price=pricestr, changesPercentage = changesPercentagestr, change = changestr, yearHigh = yearHighstr, yearLow = yearLowstr, exchange=exchangestr, earningsAnnouncement = earningsAnnouncementstr)
                stockInfoDb.save()
                i += 1
            return {
                'result': "ok",
                'timestamp': datetime.now().timestamp()
            }
        except:
            #raise Exception("Cannot get the stock data")
            return {
                'result': "failed",
                'timestamp': datetime.now().timestamp()
            }

class DeleteWatchlist(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'username cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('symbol', help = 'symbol cannot be blank', required = True)
            # parser.add_argument('tradetiming', help = 'tradetiming cannot be blank', required = False)
            # parser.add_argument('shortorlong', help = 'shortorlong cannot be blank', required = False)
            # parser.add_argument('tradetimeframe', help = 'tradetimeframe cannot be blank', required = False)
            parser.add_argument('token', help = 'tradetimeframe cannot be blank', required = False)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)            
            col = ddbb.watchlist
            query = {
                "useremail" : data['useremail']
            }
            totalcount = col.find(query).count()
            index = totalcount - 1 - data['index']

            myquery = {"username" : data['username'], "useremail" : data['useremail'], "symbolname": data['symbolname'],
                "tradetiming" : data['tradetiming'],
                "shortorlong" : data['shortorlong'],
                "tradetimeframe" : data['tradetimeframe']}
            #watchlistDb = watchlist(username = data['username'], useremail = data['useremail'], symbol = data['symbol'])
            #watchlistDb.remove(True)
            print("c", myquery)

            col.remove(myquery, True)
            print("d")

            query11 = {
                "$and" : [
                    {
                        "useremail" : data['useremail']
                    },
                    {
                        "roworder" :{
                            "$gt" : index
                        }
                    },
                ]
            }
            mydict11 = {
                "$inc" : {
                    "roworder": -1
                }
            }

            print("a")
            flag = col.update_many(query11, mydict11)
            print("ba")

            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }
        except:
            response = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

class UpdateWatchlist(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'username cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('symbol', help = 'symbol cannot be blank', required = True)
            # parser.add_argument('tradetiming', help = 'tradetiming cannot be blank', required = False)
            # parser.add_argument('shortorlong', help = 'shortorlong cannot be blank', required = False)
            # parser.add_argument('tradetimeframe', help = 'tradetimeframe cannot be blank', required = False)
            # parser.add_argument('entryprice', help = 'entryprice cannot be blank', required = False)
            # parser.add_argument('stoploss', help = 'stoploss cannot be blank', required = False)
            # parser.add_argument('exitprice', help = 'exitprice cannot be blank', required = False)
            # parser.add_argument('alertprice', help = 'alertprice cannot be blank', required = False)
            # parser.add_argument('rewardprice', help = 'rewardprice cannot be blank', required = False)
            # parser.add_argument('comment', help = 'rewardprice cannot be blank', required = False)
            # parser.add_argument('earningdate', help = 'rewardprice cannot be blank', required = False)
            # parser.add_argument('entrychange', help = 'entrychange cannot be blank', required = False)
            # parser.add_argument('tradescore', help = 'tradescore cannot be blank', required = False)
            parser.add_argument('token', help = 'tradescore cannot be blank', required = False)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb['watchlist']
            if data.get('symbol'):
                data['symbol'] = data['symbol']
            else:
                data['symbol'] = ""
            if data.get('sector'):
                data['sector'] = data['sector']
            else:
                data['sector'] = ""
            if data.get('tradetiming'):
                data['tradetiming'] = data['tradetiming']
            else:
                data['tradetiming'] = ""
            if data.get('shortorlong'):
                data['shortorlong'] = data['shortorlong']
            else:
                data['shortorlong'] = ""
            if data.get('tradetimeframe'):
                data['tradetimeframe'] = data['tradetimeframe']
            else:
                data['tradetimeframe'] = ""
            if data.get('entryprice'):
                data['entryprice'] = data['entryprice']
            else:
                data['entryprice'] = ""
            if data.get('stoploss'):
                data['stoploss'] = data['stoploss']
            else:
                data['stoploss'] = ""
            if data.get('exitprice'):
                data['exitprice'] = data['exitprice']
            else:
                data['exitprice'] = ""
            if data.get('alertprice'):
                data['alertprice'] = data['alertprice']
            else:
                data['alertprice'] = ""
            if data.get('alertpricechange'):
                data['alertpricechange'] = data['alertpricechange']
            else:
                data['alertpricechange'] = ""
            if data.get('rewardprice'):
                data['rewardprice'] = data['rewardprice']
            else:
                data['rewardprice'] = ""
            if data.get('dateadded'):
                data['dateadded'] = data['dateadded']
            else:
                data['dateadded'] = ""
            if data.get('comment'):
                data['comment'] = data['comment']
            else:
                data['comment'] = ""
            if data.get('viewstatus'):
                data['viewstatus'] = data['viewstatus']
            else:
                data['viewstatus'] = ""
            if data.get('tradescore'):
                data['tradescore'] = data['tradescore']
            else:
                data['tradescore'] = ""
            print("a")
            query = {
                "username" : data['username'],
                "useremail" : data['useremail'],
                "symbol" : data['symbol'],
                "tradetiming" : data['tradetiming'],
                "shortorlong" : data['shortorlong'],
                "tradetimeframe" : data['tradetimeframe']
            }

            user_watchlist = col.find(query)
            print("b")
            entrychange = ""

            for usss in user_watchlist:
                print(usss)
                if usss['entryprice'] != "":
                    entrychange =str("{:.4f}".format((float(data['entryprice']) - float(usss['entryprice']))/float(usss['entryprice'])))
                else:
                    entrychange="0"
            print("c")


            myquery = {"username" : data['username'], "useremail" : data['useremail'], "symbolname": data['symbolname']}
            mydict = {"$set":{"tradetiming":data['tradetiming'],"shortorlong":data['shortorlong'], "tradetimeframe" : data['tradetimeframe'], "entryprice" : data['entryprice'], "stoploss":data['stoploss'], "exitprice":data['exitprice'],"alertprice":data['alertprice'],"alertpricechange":data['alertpricechange'], "rewardprice":data['rewardprice'],"comment":data['comment'], "earningdate":data['earningdate'], "entrychange":entrychange,"tradescore":data['tradescore']}}
            #watchlistDb = watchlist(username = data['username'], useremail = data['useremail'],symbol=data['symbol'], sector=data['sector'], tradetiming=data['tradetiming'],shortorlong=data['shortorlong'], tradetimeframe = data['tradetimeframe'], entryprice = data['entryprice'], stoploss=data['stoploss'], exitprice=data['exitprice'],alertprice=data['alertprice'], rewardprice=data['rewardprice'])
            #watchlistDb.save()
            print("aa")
            col.update(myquery, mydict,True)
            print("bb")

            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }


class ImportWatchlist(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'username cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('symbol', help = 'symbol cannot be blank', required = True)
            # parser.add_argument('sector', help = 'sector cannot be blank', required = False)
            # parser.add_argument('tradetiming', help = 'tradetiming cannot be blank', required = False)
            # parser.add_argument('shortorlong', help = 'shortorlong cannot be blank', required = False)
            # parser.add_argument('tradetimeframe', help = 'tradetimeframe cannot be blank', required = False)
            # parser.add_argument('entryprice', help = 'entryprice cannot be blank', required = False)
            # parser.add_argument('stoploss', help = 'stoploss cannot be blank', required = False)
            # parser.add_argument('exitprice', help = 'exitprice cannot be blank', required = False)
            # parser.add_argument('alertprice', help = 'alertprice cannot be blank', required = False)
            # parser.add_argument('alertpricechange', help = 'alertpricechange cannot be blank', required = False)
            # parser.add_argument('rewardprice', help = 'rewardprice cannot be blank', required = False)
            # parser.add_argument('dateadded', help = 'dateadded cannot be blank', required = False)
            # parser.add_argument('comment', help = 'comment cannot be blank', required = False)
            # parser.add_argument('viewstatus', help = 'comment cannot be blank', required = False)
            # parser.add_argument('tradescore', help = 'comment cannot be blank', required = False)
            parser.add_argument('token', help = 'comment cannot be blank', required = False)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            col = ddbb["watchlist"]

            # url = "https://financialmodelingprep.com/api/v3/quote/"+ data['symbol'] +"?apikey=" + apikey
            # datas = data
            # response = urlopen(url)
            # datas = response.read().decode("utf-8")
            # jsonData = json.loads(datas)
            col11 = ddbb['symbolInfoEvery']
            query11 = {
                "symbol" : data['symbol']
            }
            col11Array = col11.find(query11)
            if col11Array.count() != 0:
                strYearhigh = str(col11Array[0]['yearHigh'])
                strPrice = str(col11Array[0]['price'])
                earningString = str(col11Array[0]['earningsAnnouncement'])
            else:
                strYearhigh = ""
                strPrice = ""
                earningString = ""

            # url1 = "https://financialmodelingprep.com/api/v3/quote-short/"+ data['symbol'] +"?apikey=" + apikey
            # response1 = urlopen(url1)
            # data1 = response1.read().decode("utf-8")
            # jsonData1 = json.loads(data1)

            #col1 = ddbb['earningreportstocks']
            #query1 = {
            #    'symbol' : data['symbol']
            #}
            #earningdatas = col1.find(query1)

            query2 = {
                'useremail' : data['useremail'],
                'symbol' : data['symbol']
            }
            repeatfielddatas = col.find(query2)

            # if earningdatas.count() == 0:
            #     print("earningstringapi")
            #     url2 = "https://financialmodelingprep.com/api/v3/historical/earning_calendar/"+ data['symbol'] +"?apikey=" + apikey
            #     print(url2)
            #     response2 = urlopen(url2)
            #     data2 = response2.read().decode("utf-8")
            #     jsonData2 = json.loads(data2)
            #     print("jsonData2", len(jsonData2))
            #     if (len(jsonData2) == 0):
            #         earningString = ""
            #     else:
            #         earningString = jsonData2[0]['date'].split(' ')[0]
            # else:
            #     print("earningstringdb")
            #     earningString = earningdatas[0]['date'].split(' ')[0]
            #     print("earningstring", earningString)


            if data.get('symbol'):
                data['symbol'] = data['symbol']
            else:
                data['symbol'] = ""
            if data.get('sector'):
                data['sector'] = data['sector']
            else:
                data['sector'] = ""
            if data.get('tradetiming'):
                data['tradetiming'] = data['tradetiming']
            else:
                data['tradetiming'] = ""
            if data.get('shortorlong'):
                data['shortorlong'] = data['shortorlong']
            else:
                data['shortorlong'] = ""
            if data.get('tradetimeframe'):
                data['tradetimeframe'] = data['tradetimeframe']
            else:
                data['tradetimeframe'] = ""
            if data.get('entryprice'):
                data['entryprice'] = data['entryprice']
            else:
                data['entryprice'] = ""
            if data.get('stoploss'):
                data['stoploss'] = data['stoploss']
            else:
                data['stoploss'] = ""
            if data.get('exitprice'):
                data['exitprice'] = data['exitprice']
            else:
                data['exitprice'] = ""
            if data.get('alertprice'):
                data['alertprice'] = data['alertprice']
            else:
                data['alertprice'] = ""
            if data.get('alertpricechange'):
                data['alertpricechange'] = data['alertpricechange']
            else:
                data['alertpricechange'] = ""
            if data.get('rewardprice'):
                data['rewardprice'] = data['rewardprice']
            else:
                data['rewardprice'] = ""
            if data.get('dateadded'):
                data['dateadded'] = data['dateadded']
            else:
                data['dateadded'] = ""
            if data.get('comment'):
                data['comment'] = data['comment']
            else:
                data['comment'] = ""
            if data.get('viewstatus'):
                data['viewstatus'] = data['viewstatus']
            else:
                data['viewstatus'] = ""
            if data.get('tradescore'):
                data['tradescore'] = data['tradescore']
            else:
                data['tradescore'] = ""

            if repeatfielddatas.count() == 0:
                repeatfield = "0"
            else:
                repeatfield = "1"
    
            query3 = {
                "useremail" : data['useremail']
            }
            #roworder = col.find(query3).count()
            roworder = col.find(query3).count()

            mydict = {"username" : data["username"], "useremail" : data["useremail"],"symbol":data["symbol"],"symbolname":data["symbolname"], "sector":data["sector"],"yearhigh":strYearhigh, "tradetiming":data["tradetiming"],"shortorlong":data["shortorlong"], "tradetimeframe" : data["tradetimeframe"], "entryprice" : data["entryprice"], "stoploss":data["stoploss"], "exitprice":data["exitprice"],"alertprice":data["alertprice"],"alertpricechange":data["alertpricechange"], "rewardprice":data["rewardprice"], "dateadded":data["dateadded"],"comment":data["comment"], "earningdate":earningString, "entrychange":data['entryprice'], "addedprice":strPrice,"viewstatus":data['viewstatus'],"tradescore":data['tradescore'], "repeatfield":repeatfield, "roworder": roworder}

            print("mydict", mydict)
            x=col.insert(mydict, True)
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }





class GetWatchlist(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'name cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            parser.add_argument('token', help = 'email cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb['watchlist'] 
            #query = {
            #    "username" : data['username'],


            #    "useremail" : data['useremail']



            #}
            
            pipeline = [
                {"$match" : {



                    "$and" : [
                        {
                            "username" : data['username'],
                        },
                        {
                            "useremail" : data['useremail']
                        },
                    ]
                    }
                },
                {"$sort": {"roworder":-1}}
            ]

            user_watchlistArray = col.aggregate(pipeline)
            #user_watchlist = [watchlist for watchlist in user_watchlistArray]  ----> uncomment when upload to production linux server
            user_watchlist = user_watchlistArray['result']
            #user_watchlist = col.find(query)
            #user_watchlist = watchlist.query.filter(watchlist.username==data['username'] and watchlist.useremail==data['useremail'])
            datas = []
            print("userwatchlist", user_watchlist)
            for usss in user_watchlist:
                print("data",usss)
                data1 = dict()
                data1['symbol'] = usss['symbol']
                data1['symbolname'] = usss['symbolname']
                data1['sector'] = usss['sector']
                data1['yearhigh'] = usss['yearhigh']
                data1['tradetiming'] = usss['tradetiming']
                print("ussstradetiming", usss['tradetiming'], type(usss['tradetiming']))
                if usss['tradetiming'] == "0":
                    data1['tradetimingstring'] = "Today"
                elif usss['tradetiming'] == "1":
                    data1['tradetimingstring'] = "Next Day"
                else:
                    data1['tradetimingstring'] = ""
                data1['shortorlong'] = usss['shortorlong']
                if usss['shortorlong'] == "0":
                    data1['shortorlongstring'] = "Short"
                elif usss['shortorlong'] == "1":
                    data1['shortorlongstring'] = "Long"
                else:
                    data1['shortorlongstring'] = ""
                data1['tradetimeframe'] = usss['tradetimeframe']
                # url = "https://financialmodelingprep.com/api/v3/quote/"+ usss['symbol'] +"?apikey=" + apikey
                # response = urlopen(url)
                # data = response.read().decode("utf-8")
                # jsonData = json.loads(data)
                # data1['currentstockprice'] = jsonData[0]['price']
                # data1['currentchange'] = jsonData[0]['changesPercentage']
                col11 = ddbb['symbolInfoEvery']
                query11 = {
                    "symbol" : usss['symbol']
                }
                symbolInfo = col11.find(query11)
                data1['currentstockprice'] = symbolInfo[0]['price']
                data1['currentchange'] = symbolInfo[0]['changesPercentage']
                data1['entryprice'] = usss['entryprice']
                data1['stoploss'] = usss['stoploss']
                data1['exitprice'] = usss['exitprice']
                data1['alertprice'] = usss['alertprice']
                if usss.get('alertpricechange'):
                    data1['alertpricechange'] = usss['alertpricechange']
                else:
                    data1['alertpricechange'] = '5.0'
                data1['rewardprice'] = usss['rewardprice']
                data1['dateadded'] = usss['dateadded']
                data1['comment'] = usss['comment']
                data1['addedprice'] = usss['addedprice']
                data1['entrychange'] = usss['entrychange']
                data1['viewstatus'] = usss['viewstatus']
                data1['tradescore'] = usss['tradescore']
                col1 = ddbb['symbolInfoEvery']
                query1 = {
                    "symbol" : data1['symbol']
                }
                if col1.find(query1).count != 0:
                    earningdatebuf = col1.find(query1)[0]['earningsAnnouncement']
                    data1['earningdate'] = earningdatebuf.split("T")[0]
                    print("earningdatebuf",earningdatebuf, query1)
                    if earningdatebuf != "None":
                        earningdate =datetime.strptime(earningdatebuf.split("T")[0] , '%Y-%m-%d').date() 
                        today = datetime.now().date()
                        delta = (earningdate - today).days
                        if delta <= 7 and delta >= 0:
                            data1['earningflag'] = True
                        else:
                            data1['earningflag'] = False
                    else:
                        data1['earningflag'] = False
                        data1['earningdate'] = ""
                else:
                    data1['earningflag'] = False
                    data1['earningdate'] = ""
                datas.append(data1)
            if not user_watchlist:
                response = jwt.encode({'error' : 'Watchlist not in DB. Import a new watchlist'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }
            print("data",datas)
            response1 = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : datas}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }


class GetSymbollist(Resource):
    def post(self):
        try:
            col = ddbb['stockInfo']

            parser = reqparse.RequestParser()
            parser.add_argument('suffix', help = 'suffix cannot be blank', required = True)

            data = parser.parse_args()

            query = {
                "symbol" : {
                    "$regex" : "^"+data['suffix'],
                    "$options" : "i"
                }
            }

            doc = col.find(query)
            result = []
            for subdoc in doc:
                result.append(subdoc['symbol'])


            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp(),
                'symbol' : result,
            }
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }
class GetCurrentStockPrice(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('symbol', help = 'symbol cannot be blank', required = True)
            parser.add_argument('symbolname', help = 'symbol cannot be blank', required = True)
            data = parser.parse_args()
            datas = data

            # print(data['symbol'])
            # url = "https://financialmodelingprep.com/api/v3/quote/"+ data['symbol'] +"?apikey=" + apikey
            # timestamp1 = datetime.timestamp(datetime.now())
            # response = urlopen(url)
            # timestamp2 = datetime.timestamp(datetime.now())
            # print(timestamp2 - timestamp1)
            # data = response.read().decode("utf-8")
            # jsonData = json.loads(data)
            # print("data",jsonData[0]['price'], jsonData[0]['changesPercentage'])
            col = ddbb['symbolInfoEvery']
            query = {
                "symbol" : data['symbol']
            }
            symbolInfo = col.find(query)

            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp(),
                'price' : symbolInfo[0]['price'],
                'pricechange' : symbolInfo[0]['changesPercentage'],
                'symbol' : symbolInfo[0]['symbol'],
                'symbolname' : datas['symbolname'],
            }

        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }


class GetSector(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('symbol', help = 'symbol cannot be blank', required = True)
            data = parser.parse_args()

            # url = "https://financialmodelingprep.com/api/v3/profile/"+ data['symbol'] +"?apikey=" + apikey
            # response = urlopen(url)
            # data = response.read().decode("utf-8")
            # jsonData = json.loads(data)
            col = ddbb['symbolInfo']
            query = {
                'symbol' : data['symbol']
            }
            symbolRow = col.find(query)

            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp(),
                'sector' : symbolRow[0]['sector'],
            }
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }

class GetAllSymbollist(Resource):
    def get(self):
        try:
            col = ddbb['stockInfo']

            doc = col.find({}).sort("symbol")
            result = []
            for subdoc in doc:
                result.append(subdoc['symbol'])
            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp(),
                'symbol' : result,
            }
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }

class ChangeViewStatus(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('username', help = 'name cannot be blank', required = True)
            parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            parser.add_argument('symbol', help = 'symbol cannot be blank', required = True)
            parser.add_argument('status', help = 'symbol cannot be blank', required = True)

            data = parser.parse_args()

            col = ddbb['watchlist']
            myquery = {"username" : data['username'], "useremail" : data['useremail'], "symbol": data['symbol']}
            print(data['status'])
            print(type(data['status']))
            mydict = {"$set":{"viewstatus":data['status']}}
            #watchlistDb = watchlist(username = data['username'], useremail = data['useremail'],symbol=data['symbol'], sector=data['sector'], tradetiming=data['tradetiming'],shortorlong=data['shortorlong'], tradetimeframe = data['tradetimeframe'], entryprice = data['entryprice'], stoploss=data['stoploss'], exitprice=data['exitprice'],alertprice=data['alertprice'], rewardprice=data['rewardprice'])
            #watchlistDb.save()

            col.update(myquery, mydict,True)

            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp()
            }
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }


class GetWatchlisttemplate(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'name cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            parser.add_argument('token', help = 'email cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb["watchlistTemplate"]

            query = {
                "username" : data['username'],
                "useremail" : data['useremail']
            }

            user_watchlist = col.find(query)

            #user_watchlist = watchlist.query.filter(watchlist.username==data['username'] and watchlist.useremail==data['useremail'])
            if not user_watchlist or user_watchlist.count() == 0:
                response1 = jwt.encode({'result' : 'failed db','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }
            data = dict()
            for item in user_watchlist:
                data['username'] = item['username']
                data['useremail'] = item['useremail']
                data['symbol'] = item['symbol']
                data['sector'] = item['sector']
                data['tradetiming'] = item['tradetiming']
                data['shortorlong'] = item['shortorlong']
                data['tradetimeframe'] = item['tradetimeframe']
                data['yearhigh'] = item['yearhigh']
                data['currentprice'] = item['currentprice']
                data['currentchange'] = item['currentchange']
                data['entryprice'] = item['entryprice']
                data['entrychange'] = item['entrychange']
                data['stoploss'] = item['stoploss']
                data['exitprice'] = item['exitprice']
                data['earningdate'] = item['earningdate']
                data['alertprice'] = item['alertprice']
                data['rewardinR'] = item['rewardinR']
                data['addedprice'] = item['addedprice']
                data['addedpricechange'] = item['addedpricechange']
                data['dateadded'] = item['dateadded']
                data['comment'] = item['comment']
                data['tradescore'] = item['tradescore']
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : data}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class ImportWatchlisttemplate(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'name cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            # parser.add_argument('data', action="append", help = 'data cannot be blank', required = True)
            parser.add_argument('token', action="append", help = 'data cannot be blank', required = True)

            datas = parser.parse_args()
            print("datas",datas['token'])
            datas = jwt.decode(datas['token'][0], JWT_SECRET_KEY)
            print("datas",datas)
            print("datas",type(datas))
            col = ddbb["watchlistTemplate"]
            mydict = {}
            mydict['username'] = datas['username']
            mydict['useremail'] = datas['useremail']
            names = ""
            values=False
            print("a")
            for item in datas['data']:
                print("item", item)
                print("itemtype", type(item))
                names = item['name']
                values = item['checked']
                if (values == True):
                    mydict[names] = True
                else:
                    mydict[names] = False

            x=col.insert(mydict, True)
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class UpdateWatchlisttemplate(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'name cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            # parser.add_argument('data', action="append", help = 'data cannot be blank', required = True)
            parser.add_argument('token', action="append", help = 'data cannot be blank', required = True)

            datas = parser.parse_args()
            print(datas)
            datas = jwt.decode(datas['token'][0], JWT_SECRET_KEY)
            print(datas)
            col = ddbb["watchlistTemplate"]
            mydict = {}
            names = ""
            values=False
            for item in datas['data']:
                print("item", item)
                names = item['name']
                values = item['checked']
                if (values == True):
                    mydict[names] = True
                else:
                    mydict[names] = False

            myquery = {"username" : datas['username'], "useremail" : datas['useremail']}
            mydict = {"$set":mydict}

            col.update(myquery, mydict,True)

            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

        except:
            response = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

class GetGlobalWatchlist(Resource):
    def get(self):
        try:
            col = ddbb['watchlist'] 
            query = {
                "shareflag" : True,
            }

            user_watchlist = col.find(query)
            datas = []
            for usss in user_watchlist:
                data1 = dict()
                data1['name'] = usss['nickName']
                data1['email'] = usss['email']
                if usss['avatarurl'] == "":
                    data1['avatarurl'] =""
                else:
                    data1['avatarurl'] ="/images/avatars/" + usss['avatarurl'] 
                datas.append(data1)
            if not user_watchlist:
                return {"error":"Watchlist not in DB. Import a new watchlist"}

            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp(),
                'data' : datas
            }

        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }        

class GetShareWatchlisttemplate(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'name cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            parser.add_argument('token', help = 'email cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb["shareWatchlistTemplate"]

            query = {
                "username" : data['username'],
                "useremail" : data['useremail']
            }

            user_watchlist = col.find(query)

            #user_watchlist = watchlist.query.filter(watchlist.username==data['username'] and watchlist.useremail==data['useremail'])
            if not user_watchlist or user_watchlist.count() == 0:
                response = jwt.encode({'result' : 'failed db','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }
            datas = dict()
            for item in user_watchlist:
                datas['username'] = item['username']
                datas['useremail'] = item['useremail']
                datas['symbol'] = item['symbol']
                datas['sector'] = item['sector']
                datas['tradetiming'] = item['tradetiming']
                datas['shortorlong'] = item['shortorlong']
                datas['tradetimeframe'] = item['tradetimeframe']
                datas['yearhigh'] = item['yearhigh']
                datas['currentprice'] = item['currentprice']
                datas['currentchange'] = item['currentchange']
                datas['entryprice'] = item['entryprice']
                datas['entrychange'] = item['entrychange']
                datas['stoploss'] = item['stoploss']
                datas['exitprice'] = item['exitprice']
                datas['earningdate'] = item['earningdate']
                datas['alertprice'] = item['alertprice']
                datas['rewardinR'] = item['rewardinR']
                datas['addedprice'] = item['addedprice']
                datas['addedpricechange'] = item['addedpricechange']
                datas['dateadded'] = item['dateadded']
                datas['comment'] = item['comment']
                datas['tradescore'] = item['tradescore']
            response1 = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : datas}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }         

class ImportShareWatchlisttemplate(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'name cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            # parser.add_argument('data', action="append", help = 'data cannot be blank', required = True)
            parser.add_argument('token', action="append", help = 'data cannot be blank', required = True)

            datas = parser.parse_args()
            datas = jwt.decode(datas['token'][0], JWT_SECRET_KEY)
            col = ddbb["shareWatchlistTemplate"]
            mydict = {}
            mydict['username'] = datas['username']
            mydict['useremail'] = datas['useremail']
            names = ""
            values=False
            for item in datas['data']:
                names = item['name']
                values = item['checked']
                if (values == True):
                    mydict[names] = True
                else:
                    mydict[names] = False

            x=col.insert(mydict, True)
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

        except:
            response = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

class UpdateShareWatchlisttemplate(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'name cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            # parser.add_argument('data', action="append", help = 'data cannot be blank', required = True)
            parser.add_argument('token', action="append", help = 'data cannot be blank', required = True)

            datas = parser.parse_args()
            datas = jwt.decode(datas['token'][0], JWT_SECRET_KEY)
            col = ddbb["shareWatchlistTemplate"]
            mydict = {}
            names = ""
            values=False
            for item in datas['data']:
                names = item['name']
                values = item['checked']
                if (values == True):
                    mydict[names] = True
                else:
                    mydict[names] = False

            myquery = {"username" : datas['username'], "useremail" : datas['useremail']}
            mydict = {"$set":mydict}

            col.update(myquery, mydict,True)
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class GetGlobalFollowersList(Resource):
    def get(self):
        try:
            col = ddbb['followersstatistics'] 

            followersList = col.find().sort("count", -1)
            #user_watchlist = watchlist.query.filter(watchlist.username==data['username'] and watchlist.useremail==data['useremail'])
            datas = []
            i=0
            for usss in followersList:
                print("followerslist", usss)
                i = i + 1
                data1 = dict()
                data1['email'] = usss['useremail']
                if usss['count'] > 0:
                    data1['numbers'] = usss['count']
                else:
                    data1['numbers'] = 0

                col1 = ddbb['users']
                query1={
                    "email" : data1['email']
                }
                users = col1.find(query1)
                data1['id'] = i
                data1['username'] = users[0]['nickName']
                data1['avatar'] = '/images/avatars/' + users[0]['avatarurl']
                if users[0]['sharemethod'] != "2":
                    datas.append(data1)

            if not followersList:
                response1 = jwt.encode({'error' : 'Watchlist not in DB. Import a new watchlist'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }

            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : datas}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }
        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class SearchGlobalFollowers(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('searchText', help = 'searchText cannot be blank', required = True)

            data = parser.parse_args()

            col = ddbb['followersstatistics'] 
            
            query = {
                "username" : {"$regex":"^"+data['searchText'],"$options":"i"}
            }
            print("aa",data['searchText'])
            followersList = col.find(query).sort("count", -1)
            print("bb")
            #user_watchlist = watchlist.query.filter(watchlist.username==data['username'] and watchlist.useremail==data['useremail'])
            datas = []
            i=0
            for usss in followersList:
                print("followerslist", usss)
                i = i + 1
                data1 = dict()
                data1['email'] = usss['useremail']
                data1['numbers'] = usss['count']

                col1 = ddbb['users']
                query1={
                    "email" : data1['email']
                }
                users = col1.find(query1)
                data1['id'] = i
                data1['username'] = users[0]['nickName']
                if users[0]['avatarurl'] == "":
                    data1['avatar'] = ''
                else:
                    data1['avatar'] = '/images/avatars/' + users[0]['avatarurl']

                if users[0]['sharemethod'] != "2":
                    datas.append(data1)

            if not followersList:
                response1 = jwt.encode({'error' : 'Watchlist not in DB. Import a new watchlist'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }

            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : datas}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }
        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class ValidGroupUser(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('userEmail', help = 'userEmail cannot be blank', required = True)
            # parser.add_argument('sideEmail', help = 'sideEmail cannot be blank', required = True)
            parser.add_argument('token', help = 'sideEmail cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            data1 = dict()
            col = ddbb['followerslist'] 
            query = {
                'followeduseremail' : data['userEmail'],
                'followinguseremail' : data['sideEmail']
            }
            user = col.find(query)
            if user.count() == 0:
                data1['permission'] = False
            else:
                data1['permission'] = True

            col1 = ddbb['users']
            query1={
                "email" : data['sideEmail']
            }
            users = col1.find(query1)
            data1['sharemethod'] = users[0]['sharemethod']
            if (data1['sharemethod'] == '0' and data1['permission'] == True) or (data1['sharemethod'] == '1' and data1['permission'] == True) or (data1['sharemethod'] == '3'):
                response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : True}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }
            else:
                response1 = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : False}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }
        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class SetFollowers(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('Suseremail', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('Duseremail', help = 'symbol cannot be blank', required = True)
            parser.add_argument('token', help = 'symbol cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            print(data['Suseremail'], data['Duseremail'])
            col = ddbb["followerslist"]

            mydict = {"followeduseremail" : data["Suseremail"], "followinguseremail" : data["Duseremail"]}
            doubleUser = col.find(mydict).count()
            print("doubleUser",doubleUser)
            if (doubleUser == 0):
                x=col.insert(mydict, True)

                col = ddbb['followersstatistics']
                query = {
                    "useremail" : data['Duseremail']
                }            
                followers = col.find(query)
                count = followers[0]['count'] + 1
                mydict = {"$set":{"count":count}}
                col.update(query, mydict, True)
                response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class GetFollowers(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('Suseremail', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('Duseremail', help = 'symbol cannot be blank', required = True)
            parser.add_argument('token', help = 'symbol cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            print(data['Suseremail'], data['Duseremail'])
            col = ddbb["followerslist"]

            mydict = {"followeduseremail" : data["Suseremail"], "followinguseremail" : data["Duseremail"]}
            doubleUser = col.find(mydict).count()
            print("doubleUser",doubleUser)
            if doubleUser == 1:
                response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'count' : doubleUser}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }
            else:
                response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp(),'count' : doubleUser}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }

        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class GetEarningStocks(Resource):
    def get(self):
        try:
            date_format = "%Y-%m-%d"
            col = ddbb['symbolInfoEvery']
            pipeline = [
                {"$match" : {
                    "$nor" : [
                        {
                            "earningsAnnouncement" : "None"
                        },
                    ]
                    }
                },
                {"$match" : {
                    "$or" : [
                        {
                            "earningsAnnouncement" : {
                                "$regex" : datetime.now().strftime(date_format) + ".*"
                            }
                        },
                        {
                            "earningsAnnouncement" : {
                                "$regex" : (datetime.now() - timedelta(days=1)).strftime(date_format) + ".*"
                            }
                        },
                    ]
                    }
                },
                {"$sort": {"earningsAnnouncement":-1}}
            ]
        
            earningPip = col.aggregate(pipeline)
            earningArray = [earning for earning in earningPip]

            i=0
            datas=[]
            for earningData in earningArray:
                #print("earningData", earningData)
                bufdata = dict()
                earningString = earningData['earningsAnnouncement'].split('T')[0]
                earningdate =datetime.strptime(earningString , '%Y-%m-%d').date() 
                today = datetime.now().date()
                delta = (earningdate - today).days
                #print("delta", delta)
                col3 = ddbb['symbolInfo']

                if delta == 0 or delta == 1:
                    i=i+1
                    if delta == 0:
                        bufdata['date'] = 'Today'
                    if delta == 1:
                        bufdata['date'] = 'Tomorrow'
                    bufdata['name'] = earningData['symbol']
                    symbolquery = {
                        "symbol" : earningData['symbol']
                    }
                 #   print("symbolquery", symbolquery)
                   # if col3.find(symbolquery).count() != 0:
                   #     if col3.find(symbolquery)[0]['image'] == "null" or col3.find(symbolquery)[0]['image'] == "":
                   #         bufdata['imageUrl'] = "/images/avatars/null_symbol.png"
                   #     else:
                   #         bufdata['imageUrl'] = col3.find(symbolquery)[0]['image']
                   # else:
                   #     bufdata['imageUrl'] = "/images/avatars/null_symbol.png"
                    bufdata['imageUrl'] = "https://financialmodelingprep.com/image-stock/"+earningData['symbol']+".png"
                    bufdata['id'] = i
                    datas.append(bufdata)
                else:
                    break

            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp(),
                'data' : datas
            }

        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }


class GetTopStocks(Resource):
    def get(self):
        try:
            col = ddbb["watchlist"]
            date_format = "%m/%d/%Y"
            #pipeline = [
            #    {"$match":{"dateadded":datetime.now().strftime(date_format)}},
            #    {"$group":{"_id":"$symbol", "count":{"$sum":1}}},
            #    {"$sort": {"count":-1}}
            #]
            pipeline = [
                {"$match" : {
                    "$and" : [
                        {
                            "dateadded":datetime.now().strftime(date_format)
                        },
                        {
                            "repeatfield" : "0"
                        }
                    ]
                    }
                },
                {"$group":{"_id":"$symbol", "count":{"$sum":1}}},
                {"$sort": {"count":-1}}
            ]
        
            stocks = col.aggregate(pipeline)


            #weekpipeline = [    
            #    {"$match":{
            #        "$or" : [
            #            {
            #                "dateadded":datetime.now().strftime(date_format)
            #            },
            #            {
            #                "dateadded":(datetime.now() - timedelta(days=1)).strftime(date_format)
            #            },
            #            {
            #                "dateadded":(datetime.now() - timedelta(days=2)).strftime(date_format)
            #            },
            #            {
            #                "dateadded":(datetime.now() - timedelta(days=3)).strftime(date_format)
            #            },
            #            {
            #                "dateadded":(datetime.now() - timedelta(days=4)).strftime(date_format)
            #            },
            #            {
            #                "dateadded":(datetime.now() - timedelta(days=5)).strftime(date_format)
            #            },
            #            {
            #                "dateadded":(datetime.now() - timedelta(days=6)).strftime(date_format)
            #            },
            #        ]
            #        }
            #    },
            #    {"$group":{"_id":"$symbol", "count":{"$sum":1}}},
            #    {"$sort": {"count":-1}}                
            #]
 
            weekpipeline = [    
                {"$match" : {
                    "$and" : [
                        {
                            "$or" : [
                                {
                                    "dateadded":datetime.now().strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=1)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=2)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=3)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=4)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=5)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=6)).strftime(date_format)
                                },
                            ]
                        },
                        {
                            "repeatfield" : "0"
                        }
                    ]
                    }
                },
                {"$group":{"_id":"$symbol", "count":{"$sum":1}}},
                {"$sort": {"count":-1}}                
            ]

            weekstocks = col.aggregate(weekpipeline)
            datas = []
            weekdatas = []
            i=0
            j=0
            print("gettopstocks", stocks)
            todaystocks = [today for today in stocks]
            weeklystocks = [today for today in weekstocks]
###            for stock in stocks:
            for stock in todaystocks:
                print("gettopstocks", stock)
                if i > 19:
                    break
                i=i+1
                bufdata = dict()
                bufdata['id'] = i
                bufdata['name'] = stock['_id']
                bufdata['imageUrl'] = 'https://financialmodelingprep.com/image-stock/' + bufdata['name'] + ".jpg"
                bufdata['number'] = stock['count']
                datas.append(bufdata)

            for stock in weeklystocks:
                if j > 19:
                    break
                j = j + 1
                bufdata = dict()
                bufdata['id'] = j
                bufdata['name'] = stock['_id']
                bufdata['imageUrl'] = 'https://financialmodelingprep.com/image-stock/' + bufdata['name'] + ".jpg"
                bufdata['number'] = stock['count']
                weekdatas.append(bufdata)
            print('datas', datas, "\nweekdatas", weekdatas)
            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp(),
                'data' : datas,
                'weekdata' : weekdatas
            }

        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }

class GetShortLong(Resource):
    def get(self):
        try:

            col = ddbb["watchlist"]
            date_format = "%m/%d/%Y"

            #pipeline = [
            #    {"$match":{"dateadded":datetime.now().strftime(date_format)}},
            #    {"$group":{"_id":"$shortorlong", "count":{"$sum":1}}},
            #    {"$sort": {"count":-1}}
            #]
            pipeline = [
                {"$match" : {
                    "$and" : [
                        {
                            "dateadded":datetime.now().strftime(date_format)
                        },
                        {
                            "repeatfield" : "0"
                        }
                    ]
                    }
                },
                # {"$match":{"dateadded":datetime.now().strftime(date_format)}},
                {"$group":{"_id":"$shortorlong", "count":{"$sum":1}}},
                {"$sort": {"count":-1}}
            ]
            stocks = col.aggregate(pipeline)

            weekpipeline = [    
                {"$match" : {
                    "$and" : [
                        {
                            "repeatfield" : "0"
                        },
                        {
                            "$or" : [
                                {
                                    "dateadded":datetime.now().strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=1)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=2)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=3)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=4)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=5)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=6)).strftime(date_format)
                                },
                            ]
                        }
                    ]
                    }
                },
                {"$group":{"_id":"$shortorlong", "count":{"$sum":1}}},
                {"$sort": {"count":-1}}                
            ]

            weekstocks = col.aggregate(weekpipeline)
            shortdata = -1
            longdata = -1
            i = 0

            shortlongtoday = [shrtlngtoday for shrtlngtoday in stocks]
            for stock in shortlongtoday:
###            for stock in stocks:
                if i == 2:
                    break
                if stock['_id'] == "0":
                    shortdata = stock['count']
                    i = i + 1
                if stock['_id'] == "1":
                    longdata = stock['count']
                    i = i + 1

            if shortdata > longdata:
                returndata = "Short"
            elif shortdata == longdata:
                returndata = "Equalibrium"
            else:
                returndata = "Long"

            i = 0
            for stock in shortlongtoday:
###            for stock in weekstocks:
                if i == 2:
                    break
                if stock['_id'] == "0":
                    shortdata = stock['count']
                    i = i + 1
                if stock['_id'] == "1":
                    longdata = stock['count']
                    i = i + 1

            if shortdata > longdata:
                weekreturndata = "Short"
            elif shortdata == longdata:
                weekreturndata = "Equalibrium"
            else:
                weekreturndata = "Long"
            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp(),
                'data' : returndata,
                'weekdata' : weekreturndata
            }

        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }

class GetTopStocksForShortLong(Resource):
    def get(self):
        try:
            col = ddbb["watchlist"]
            date_format = "%m/%d/%Y"

            pipelineshort = [
               {"$match":{
                    "$and" : [
                        {
                            "dateadded":datetime.now().strftime(date_format)
                        },
                        {
                            "shortorlong" : "0"
                        },
                        {
                            "repeatfield" : "0"
                        }
                    ]
                    }
                },
                {"$group":{"_id":"$symbol", "count":{"$sum":1}}},
                {"$sort": {"count":-1}}
            ]



            pipelinelong = [
                {"$match":{
                    "$and" : [
                        {
                           "dateadded":datetime.now().strftime(date_format)
                        },
                        {
                           "shortorlong" : "1"
                        },
                        {
                           "repeatfield" : "0"
                        }

                    ]
                    }
                },
                {"$group":{"_id":"$symbol", "count":{"$sum":1}}},
                {"$sort": {"count":-1}}
            ]
            stocksshort = col.aggregate(pipelineshort)
            stockslong = col.aggregate(pipelinelong)

            weekpipelineshort = [
               {"$match":{
                   "$and" :[
                       {
                           "shortorlong" : "0"
                       },
                       {
                           "$or" : [
                               {
                                   "dateadded":datetime.now().strftime(date_format)
                               },
                               {
                                   "dateadded":(datetime.now() - timedelta(days=1)).strftime(date_format)
                               },
                               {
                                   "dateadded":(datetime.now() - timedelta(days=2)).strftime(date_format)
                               },
                               {
                                   "dateadded":(datetime.now() - timedelta(days=3)).strftime(date_format)
                               },
                               {
                                   "dateadded":(datetime.now() - timedelta(days=4)).strftime(date_format)
                               },
                               {
                                   "dateadded":(datetime.now() - timedelta(days=5)).strftime(date_format)
                               },
                               {
                                   "dateadded":(datetime.now() - timedelta(days=6)).strftime(date_format)
                               },
                           ]
                       },
                       {
                          "repeatfield" : "0"
                       }
                   ]
                   }
               },
               {"$group":{"_id":"$symbol", "count":{"$sum":1}}},
               {"$sort": {"count":-1}}
           ]


            weekpipelinelong = [    
                {"$match":{
                    "$and" :[
                        {
                            "shortorlong" : "1"
                        },
                        {
                            "$or" : [
                                {
                                    "dateadded":datetime.now().strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=1)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=2)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=3)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=4)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=5)).strftime(date_format)
                                },
                                {
                                    "dateadded":(datetime.now() - timedelta(days=6)).strftime(date_format)
                                },
                            ]
                        },
                        {
                            "repeatfield" : "0"
                        }
                    ]
                    }
                },
                {"$group":{"_id":"$symbol", "count":{"$sum":1}}},
                {"$sort": {"count":-1}}                
            ]
            weekstocksshort = col.aggregate(weekpipelineshort)
            weekstockslong = col.aggregate(weekpipelinelong)

            shortdatas = []
            longdatas = []
            weekshortdatas = []
            weeklongdatas = []
            i=0
            topstocksshorttoday = [topstocksshrttoday for topstocksshrttoday in stocksshort]
            topstockslongtoday = [topstockslngtoday for topstockslngtoday in stockslong]
            topstocksshortweek = [topstocksshrtweek for topstocksshrtweek in weekstocksshort]
            topstockslongweek = [topstockslngweek for topstockslngweek in weekstockslong]
            for stock in topstocksshorttoday:
###            for stock in stocksshort:
                if i > 19:
                    break
                i=i+1
                bufdata = dict()
                bufdata['id'] = i
                bufdata['name'] = stock['_id']
                bufdata['imageUrl'] = 'https://financialmodelingprep.com/image-stock/' +bufdata['name']+".jpg"
                bufdata['number'] = stock['count']
                shortdatas.append(bufdata)
            i=0
            for stock in topstockslongtoday:
###            for stock in stockslong:
                if i > 19:
                    break
                i=i+1
                bufdata = dict()
                bufdata['id'] = i
                bufdata['name'] = stock['_id']
                bufdata['imageUrl'] = 'https://financialmodelingprep.com/image-stock/' +bufdata['name']+".jpg"
                bufdata['number'] = stock['count']
                longdatas.append(bufdata)
            i=0
            for stock in topstocksshortweek:
###            for stock in weekstocksshort:
                if i > 19:
                    break
                i=i+1
                bufdata = dict()
                bufdata['id'] = i
                bufdata['name'] = stock['_id']
                bufdata['imageUrl'] = 'https://financialmodelingprep.com/image-stock/' +bufdata['name']+".jpg"
                bufdata['number'] = stock['count']
                weekshortdatas.append(bufdata)
            i=0
            for stock in topstockslongweek:
###            for stock in weekstockslong:
                if i > 19:
                    break
                i=i+1
                bufdata = dict()
                bufdata['id'] = i
                bufdata['name'] = stock['_id']
                bufdata['imageUrl'] = 'https://financialmodelingprep.com/image-stock/' +bufdata['name']+".jpg"
                bufdata['number'] = stock['count']
                weeklongdatas.append(bufdata)

            return {
                'result': 'ok',
                'timestamp' : datetime.now().timestamp(),
                'shortdata' : shortdatas,
                'longdata' : longdatas,
                'weekshortdata' : weekshortdatas,
                'weeklongdata' : weeklongdatas
            }
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }

class GetFollowersList(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            col = ddbb['followerslist'] 

            query = {
                "followeduseremail" : data['useremail']
            }
            print('query', query)
            followersList = col.find(query)
            #user_watchlist = watchlist.query.filter(watchlist.username==data['username'] and watchlist.useremail==data['useremail'])
            datas = []
            i= 0
            for usss in followersList:
                print(usss)
                data1 = dict()
                i = i + 1
                col1 = ddbb['users']
                query1={
                    "email" : usss['followinguseremail']
                }
                users = col1.find(query1)
                data1['id'] = i
                data1['name'] = users[0]['nickName']
                data1['avatarUrl'] = "/images/avatars/" + users[0]['avatarurl']
                data1['phone'] = users[0]['phonenumber']
                data1['email'] = users[0]['email']
                address = dict()
                address['country'] = users[0]['country']
                address['state'] = users[0]['state']
                data1['address'] = address
                datas.append(data1)

            if not followersList:
                response = jwt.encode({'error' : 'Watchlist not in DB. Import a new watchlist'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }

            response1 = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : datas}, JWT_SECRET_KEY)
            print('response1', response1)
            return {
                'result' : str(response1)
            }
        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class GetFollowedList(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            col = ddbb['followerslist'] 

            query = {
                "followinguseremail" : data['useremail']
            }
            followersList = col.find(query)
            #user_watchlist = watchlist.query.filter(watchlist.username==data['username'] and watchlist.useremail==data['useremail'])
            datas = []
            i= 0
            for usss in followersList:
                data1 = dict()
                i = i + 1
                col1 = ddbb['users']
                query1={
                    "email" : usss['followeduseremail']
                }
                users = col1.find(query1)
                data1['id'] = i
                data1['name'] = users[0]['nickName']
                data1['avatarUrl'] = "/images/avatars/" + users[0]['avatarurl']
                data1['phone'] = users[0]['phonenumber']
                data1['email'] = users[0]['email']
                address = dict()
                address['country'] = users[0]['country']
                address['state'] = users[0]['state']
                data1['address'] = address
                datas.append(data1)

            if not followersList:
                response = jwt.encode({'error' : 'Watchlist not in DB. Import a new watchlist'}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }

            response1 = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : datas}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }
        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class RemoveFollower(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('sideemail', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            col = ddbb['followerslist'] 

            query = {
                "followeduseremail" : data['useremail'],
                "followinguseremail" : data['sideemail']
            }
            print("query", query)
            result = col.remove(query)
            print("result", result)

            col = ddbb['followersstatistics']
            query = {
                "useremail" : data['sideemail']
            }            
            followers = col.find(query)
            count = followers[0]['count'] - 1
            mydict = {"$set":{"count":count}}
            col.update(query, mydict, True)
            print("result", result)
            response1 = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }
        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class GetContacts(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('searchtext', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb['users'] 

            print(data["searchtext"])
            query = {
                "nickName" : {"$regex":"^"+data['searchtext'],"$options":"i"}
            }
            contactList = col.find(query)
            datas = []
            for contactuser in contactList:
                print(contactuser)
                if contactuser['email'] == data['useremail']:
                    continue
                bufdata = dict()
                bufdata['name'] = contactuser['nickName']
                bufdata['email'] = contactuser['email']
                bufdata['avatar'] = "/images/avatars/" + contactuser['avatarurl']
                datas.append(bufdata)
            response = jwt.encode({'result' : 'ok','timestamp' : str(datetime.now()),'data' : datas}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }                
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : str(datetime.now())}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }                

class SetContacts(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('searchtext', help = 'useremail cannot be blank', required = True)
            data = parser.parse_args()

            col = ddbb['users'] 

            print(data["searchtext"])
            query = {
                    "nickName" : {"$regex":"^"+data['searchtext'],"$options":"i"}
            }
            contactList = col.find(query)
            datas = []
            for contactuser in contactList:
                print(contactuser)
                bufdata = dict()
                bufdata['name'] = contactuser['nickName']
                bufdata['email'] = contactuser['email']
                bufdata['avatar'] = "/images/avatars/" + contactuser['avatarurl']
                datas.append(bufdata)
            return {
                'result' : 'ok',
                'timestamp' : str(datetime.now()),
                'data' : datas
            }   
        except:
            return {
                'result' : 'failed',
                'timestamp' : str(datetime.now())
            }        

class DeleteUserInContact(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('from', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('to', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            print("a")

            print("result", data)
            col = ddbb['contacts'] 
            query = {
                'fromperson' : data['from'],
                'toperson' : data['to']
            }
            print("result",data['from'],data['to'])
            result = col.remove(query, True)
            print("result",result)
            response = jwt.encode({'result' : 'ok','timestamp' : str(datetime.now())}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : str(datetime.now())}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class SaveChat(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('from', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('to', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('content', help = 'useremail cannot be blank', required = False)
            parser.add_argument('token', help = 'useremail cannot be blank', required = False)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb['chats'] 

            print(data["from"],data["to"],data["content"])            
            dateStr = str(datetime.now().strftime("%d/%m/%y %H:%M:%S"))
            print (str(datetime.now()),dateStr)
            print(datetime.strptime(dateStr, "%d/%m/%y %H:%M:%S"))
            print("lastchattime", datetime.strptime(str(datetime.now().strftime("%d/%m/%y %H:%M:%S")), '%d/%m/%y %H:%M:%S'), type(datetime.strptime(str(datetime.now().strftime("%d/%m/%y %H:%M:%S")), '%d/%m/%y %H:%M:%S')))
            mydict = {"fromperson" : data['from'], "toperson" : data['to'],"content":data['content'], "lastchattime" : datetime.strptime(datetime.now().strftime("%d/%m/%y %H:%M:%S"),'%d/%m/%y %H:%M:%S'), "readflag":False}
            col.insert(mydict,True)

            col1 = ddbb['contacts']
            query1 = {
                'fromperson' : data['from'],
                'toperson' : data['to']
            }
            result = col1.find(query1).count()
            if result == 0:
                col2 = ddbb['users']
                query2 = {
                    'email' : data['to']
                }
                toperson = col2.find(query2)
                mydict1 = {"fromperson" : data['from'], "toperson" : data['to'], "topersonname" : toperson[0]['nickName'], "topersonimage" : toperson[0]['avatarurl']}
                col1.insert(mydict1, True)

            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class SaveContact(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('from', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('to', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col1 = ddbb['contacts']
            query1 = {
                'fromperson' : data['from'],
                'toperson' : data['to']
            }
            result = col1.find(query1).count()
            if result == 0:
                col2 = ddbb['users']
                query2 = {
                    'email' : data['to']
                }
                toperson = col2.find(query2)
                mydict1 = {"fromperson" : data['from'], "toperson" : data['to'], "topersonname" : toperson[0]['nickName'], "topersonimage" : toperson[0]['avatarurl']}
                col1.insert(mydict1, True)

            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class DeleteChat(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('from', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('to', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('content', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('messagedate', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb['chats'] 

            print(data["from"],data["to"],data["content"], data['messagedate'])     
            newmessagedate = data['messagedate'].split(' ')[0].split('/')[1]+"/"+data['messagedate'].split(' ')[0].split('/')[0]+"/"+data['messagedate'].split(' ')[0].split('/')[2]+" " + data['messagedate'].split(' ')[1]
            print("newmessagedat", newmessagedate)
            date_time_obj = datetime.strptime(newmessagedate, '%d/%m/%y %H:%M:%S')
            print (str(datetime.now()))

            mydict = {"fromperson" : data['from'], "toperson" : data['to'],"content":data['content'], "lastchattime" : date_time_obj}
            col.remove(mydict,True)
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class ReadChat(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('from', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('to', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb['chats'] 
            query = {
                'fromperson' : data['from'],
                'toperson' : data['to'],
                'readflag' : False
            }
            mydict = {"$set":{"readflag":True}}
            result = col.update(query, mydict, multi=True)
            print("result", result)
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class GetChat(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('from', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('to', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            fromperson = findUser(data['from'])
            toperson = findUser(data['to'])

            col = ddbb['chats'] 

            query = {
                '$or' : [{
                    'fromperson' : data['from'],
                    'toperson' : data['to']
                },{
                    'fromperson' : data['to'],
                    'toperson' : data['from']
                }]
            }
            print("aa")
            chatList = col.find(query).sort('lastchattime',1)
            print("bb", chatList.count())
            datas = []
            count = 0
            for chat in chatList:
                print(chat)                
                # date_time_obj = datetime.strptime(bufdata['lastchattime'], '%y-%m-%d %H:%M:%S')
                # date_time_obj1 = chat['lastchattime'].date()
                # print("datetimecompare", date_time_obj, date_time_obj1)

                bufdata = dict()
                if chat['fromperson'] == data['from']:
                    bufdata['key'] = count
                    bufdata['type'] = 0
                    bufdata['name'] = fromperson[0]['nickName']
                    bufdata['image'] = "/images/avatars/" + fromperson[0]['avatarurl']
                    bufdata['string'] = chat['content']
                    
                    messagedate =chat['lastchattime'].date() 
                    print("cc", messagedate)
                    today = datetime.now().date()
                    delta = (today - messagedate).days
                    if delta != 0:
                        print('dd', delta)
                        bufdata['time'] = str(delta) + "days ago"
                        print('dd', delta)
                    else:
                        messagedate =chat['lastchattime'].time() 
                        today = datetime.now().time()
                        print("cc", messagedate,today)
                        bufdata['time'] = minute_interval(messagedate, today)

                    print(type(chat['lastchattime']))
                    bufdata['lastchattime'] = chat['lastchattime'].strftime('%x') + " " + chat['lastchattime'].strftime('%X')
                    datas.append(bufdata)
                else:
                    bufdata['key'] = count
                    bufdata['type'] = 1
                    bufdata['name'] = toperson[0]['nickName']
                    bufdata['image'] = "/images/avatars/" + toperson[0]['avatarurl']
                    bufdata['string'] = chat['content']
                    messagedate =chat['lastchattime'].date() 
                    today = datetime.now().date()
                    delta = (today - messagedate).days
                    if delta != 0:
                        print('dd', delta)
                        bufdata['time'] = str(delta) + "days ago"
                        print('dd', delta)
                    else:
                        messagedate =chat['lastchattime'].time() 
                        today = datetime.now().time()
                        print("cc", messagedate,today)
                        bufdata['time'] = minute_interval(messagedate, today)
                    print(type(chat['lastchattime']))
#                    bufdata['lastchattime'] = str(chat['lastchattime'].date()) + " " + str(chat['lastchattime'].time())
                    bufdata['lastchattime'] = chat['lastchattime'].strftime('%x') + " " + chat['lastchattime'].strftime('%X')
                    datas.append(bufdata)
                count = count + 1
                print('datas',datas)

            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data':datas}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }       

class GetChatForNotification(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('to', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            col = ddbb['chats'] 
            print("datasto", data['to'])

            pipeline = [
                {"$match": {"readflag":False}},
                {"$group":{"_id":{"fromperson":"$fromperson", "toperson":"$toperson"}, "count":{"$sum":1}}},
            ]
            chatNotificationArray = col.aggregate(pipeline)

            # query = {
            #     'toperson' : data['to'],
            #     'readflag' : False
            # }
            # print("notification", query, data['to'])
            # chatList = col.find(query).sort('lastchattime',1)
            # print("notification", chatList)
            datas = []
            chatNotification = [chatN for chatN in chatNotificationArray]

            for chat in chatNotification:
###            for chat in chatNotification['result']:
                if chat['_id']['toperson'] == data['to']:
                    print("notificaitonchat", chat['_id']['fromperson'])
                    bufdata = dict()
                    bufdata['fromperson'] = chat['_id']['fromperson']
                    bufdata['count'] = chat['count']
                    user = findUser(bufdata['fromperson'])
                    print("suer",user[0])
                    bufdata['fromimage'] = '/images/avatars/' + user[0]['avatarurl']
                    bufdata['fromname'] = user[0]['nickName']
                    bufdata['toperson'] = chat['_id']['toperson']
                    query = {
                        "fromperson" : chat['_id']['fromperson'],
                        "toperson" : chat['_id']['toperson']
                    }
                    bufdata['lastchattime'] = str(col.find(query).sort('lastchattime', -1)[0]['lastchattime'])
                    bufdata['content'] = col.find(query).sort('lastchattime', -1)[0]['content']
                    datas.append(bufdata)
                    print('datas',datas)
            response1 = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data':datas}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }
        except:
            response = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

class GetOwnContacts(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('from', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)
            data = parser.parse_args()       
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb['contacts']
            query = {
                'fromperson' : data['from']
            }

            contactList = col.find(query)
            datas = []
            for contactuser in contactList:
                print('contactuser', contactuser)
                bufdata = dict()
                bufdata['name'] = contactuser['topersonname']
                bufdata['email'] = contactuser['toperson']
                bufdata['avatar'] = "/images/avatars/" + contactuser['topersonimage']
                datas.append(bufdata)
            print('datas', datas)
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : datas}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }

        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class SetShareMethod(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            # parser.add_argument('sharemethod', help = 'sharemethod cannot be blank', required = True)
            parser.add_argument('token', help = 'sharemethod cannot be blank', required = True)

            data = parser.parse_args()       
            data = jwt.decode(data['token'], JWT_SECRET_KEY)            
            col = ddbb['users']
            myquery = {
                'email' : data['useremail']
            }
            mydict = {"$set":{"sharemethod":data['sharemethod']}}
            col.update(myquery, mydict,True)
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }            
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }

class GetShareMethod(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)

            data = parser.parse_args()       
            data = jwt.decode(data['token'], JWT_SECRET_KEY)            
            col = ddbb['users']
            myquery = {
                'email' : data['useremail']
            }
            users = col.find(myquery)
            print(users[0])
            response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp(),'data' : users[0]['sharemethod']}, JWT_SECRET_KEY)
            return {
                'result' : str(response)
            }            
        except:
            response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response1)
            }            

class AdminGetUserList(Resource):
    def get(self):
        try:
            col = ddbb['users']
            query = {
            }            
            userDB = col.find(query)
            datas = []
            for item in userDB:
                user = dict()
                user['name'] = item['nickName']
                user['email'] = item['email']
                user['avatar'] = "/images/avatars/" + item['avatarurl']
                user['country'] = item['country']
                user['typeoftrader'] = item['typeoftrader']
                user['traderyears'] = item['phonenumber']
                user['gender'] = item['gender']
                user['age'] = item['age']
                user['privatemessageflag'] = item['privatemessageflag']
                user['activeflag'] = item['activeflag']
                user['sharemethod'] = item['sharemethod']
                datas.append(user)

            return {
                'result' : 'ok',
                'message' : 'ok',
                'data' : datas,
            }
            
        except:
            return {
                'result': 'fail',
                'error' : 'wrong credential',
            }

class DeleteUser(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            #parser.add_argument('useremail', help = 'useremail cannot be blank', required = True)
            parser.add_argument('token', help = 'useremail cannot be blank', required = True)
            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)

            col = ddbb['users']
            myquery = {"email" : data['useremail']}
            print("myquery",myquery);
            result = col.remove(myquery, True)
            
            col1 = ddbb['chats']
            myquery1 = {"fromperson" : data['useremail'], "toperson": data['useremail']}
            col1.remove(myquery1, True)

            col2 = ddbb['contacts']
            myquery2 = {"fromperson" : data['useremail'], "toperson": data['useremail']}
            col2.remove(myquery2,True)

            col3 = ddbb['followersstatistics']
            myquery3 = {"useremail" : data['useremail']}
            col3.remove(myquery3, True)

            col4 = ddbb['shareWatchlistTemplate']
            myquery4 = {"useremail" : data['useremail']}
            col4.remove(myquery4, True)

            col5 = ddbb['watchlist']
            myquery5 = {"useremail" : data['useremail']}
            col5.remove(myquery5, True)

            col6 = ddbb['watchlistTemplate']
            myquery6 = {"useremail" : data['useremail']}
            col6.remove(myquery6, True)

            if result != 0:
                print("a")
                response = jwt.encode({'result' : 'ok','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                return {
                    'result' : str(response)
                }
            else:
                print("ab")
                response1 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
                return {
                    'result' : str(response1)
                }

        except:
            response2 = jwt.encode({'result' : 'failed','timestamp' : datetime.now().timestamp()}, JWT_SECRET_KEY)
            return {
                'result' : str(response2)
            }

class SendMessageToAdmin(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('name', help = 'Email cannot be blank', required = True)
            parser.add_argument('email', help = 'Email cannot be blank', required = True)
            parser.add_argument('content', help = 'Email cannot be blank', required = True)
            data = parser.parse_args()

            sendEmailToAdmin("[" + data['email'] + "- nick name : " + data['name'] + "]\\n" + data['content'])

            return {
                'result' : 'ok',
                'message' : 'ok',
            }
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }   

class GetCurrentUsersNumber(Resource):
    def get(self):
        try:
            col1 = ddbb['users']
            query = {
                'logstatus' : True
            }
            users = col1.find(query)
            result = users.count()
            print("result", result)
            return {
                'result' : 'ok',
                'timestamp' : datetime.now().timestamp(),
                'data':result
            }   
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }   

class GetLogedUsersNumber(Resource):
    def get(self):
        try:
            col1 = ddbb['userseveryday']
            query = {
                'datea' : datetime.now().strftime("%d/%m/%y")
            }
            users = col1.find(query)
            result = users[0]['numbera']
            return {
                'result' : 'ok',
                'timestamp' : datetime.now().timestamp(),
                'data' : result
            }   
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }   

class GetTotalUsersNumber(Resource):
    def get(self):
        try:
            col1 = ddbb['users']
            users = col1.find()
            result = users.count()
            return {
                'result' : 'ok',
                'timestamp' : datetime.now().timestamp(),
                'data' : result
            }   
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }   

class SetStockPriceIntervalTime(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('intervaltime', help = 'Email cannot be blank', required = True)
            data = parser.parse_args()

            col1 = ddbb['stokprice']
            print("a")
            if col1.find().count() == 0:
                print("b")
                myquery = {
                    "id" : "1",
                    "timea" : data['intervaltime'],
                    "datea" : datetime.now().strftime("%d/%m/%y")
                }
                col1.insert(myquery, True)
            else:
                print("a")
                myquery = {
                    "id" : "1"
                }
                mydict2 = {"$set":{"timea" : data['intervaltime'], "datea" : datetime.now().strftime("%d/%m/%y")}}            
                col1.update(myquery, mydict2, True)            
            return {
                'result' : 'ok',
                'timestamp' : datetime.now().timestamp()
            }   
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }   

class GetStockPriceIntervalTime(Resource):
    def get(self):
        try:
            col1 = ddbb['stokprice']

            stockprice = col1.find()
            result = stockprice[0]['timea']
            return {
                'result' : 'ok',
                'timestamp' : datetime.now().timestamp(),
                'data' : result
            }   
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }   
class GetHistoricalPrice(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            parser.add_argument('symbol', help = 'symbol cannot be blank', required = True)
            parser.add_argument('interval', help = 'interval cannot be blank', required = True)

            data = parser.parse_args()
            intervalbuf = data['interval']
            if data['interval'] == "1d":
                url = "https://financialmodelingprep.com/api/v3/historical-price-full/" + data['symbol'] + "?apikey=" + apikey
            elif data['interval'] == "4h":
                url = "https://financialmodelingprep.com/api/v3/historical-chart/4hour/" + data['symbol'] + "?apikey=" + apikey
            elif data['interval'] == "1h":
                url = "https://financialmodelingprep.com/api/v3/historical-chart/1hour/" + data['symbol'] + "?apikey=" + apikey
            elif data['interval'] == "30m":
                url = "https://financialmodelingprep.com/api/v3/historical-chart/30min/" + data['symbol'] + "?apikey=" + apikey
            elif data['interval'] == "15m":
                url = "https://financialmodelingprep.com/api/v3/historical-chart/15min/" + data['symbol'] + "?apikey=" + apikey
            elif data['interval'] == "5m":
                url = "https://financialmodelingprep.com/api/v3/historical-chart/5min/" + data['symbol'] + "?apikey=" + apikey
            elif data['interval'] == "1m":
                url = "https://financialmodelingprep.com/api/v3/historical-chart/1min/" + data['symbol'] + "?apikey=" + apikey
            response = urlopen(url)
            data = response.read().decode("utf-8")
            jsonData = json.loads(data)
            if intervalbuf == "1d":
                return {
                    'result' : 'ok',
                    'timestamp' : datetime.now().timestamp(),
                    'data' : jsonData['historical']
                }
            else:
                return {
                    'result' : 'ok',
                    'timestamp' : datetime.now().timestamp(),
                    'data' : jsonData
                }
        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }   

class GetSymbolLists(Resource):
    def get(self):
        try:
            col = ddbb['symbolInfo']
            symbollistDB = col.find().sort('symbol')
            symbollist = []
            for symbollistData in symbollistDB:
                symbollist.append(symbollistData['symbol'])
            return {
                'result' : 'ok',
                'timestamp' : datetime.now().timestamp(),
                'data' : symbollist
            }

        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }

 
class SaveRowOrder(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            # parser.add_argument('username', help = 'name cannot be blank', required = True)
            # parser.add_argument('useremail', help = 'email cannot be blank', required = True)
            parser.add_argument('token', help = 'email cannot be blank', required = True)

            data = parser.parse_args()
            data = jwt.decode(data['token'], JWT_SECRET_KEY)
            col = ddbb['watchlist'] 

            query = {
                "useremail" : data['useremail'],
            }
         
            symbolcount = col.find(query).count() - 1
            print(symbolcount, data)
            orderfrom = symbolcount - data['from']

            orderto = symbolcount - data['to']

            if orderfrom > orderto:
                realfrom = orderto
                realto = orderfrom
                numplus = 1
                query11 = {
                    "$and" : [
                        {
                            "useremail" : data['useremail']
                        },
                        {
                            "roworder" :{
                                "$gte" : realfrom
                            }
                        },
                        {
                            "roworder" :{
                                "$lt" : realto
                            }
                        },
                    ]
                }
            else:
                realfrom = orderfrom
                realto = orderto
                numplus = -1
                query11 = {
                    "$and" : [
                        {
                            "useremail" : data['useremail']
                        },
                        {
                            "roworder" :{
                                "$gt" : realfrom
                            }
                        },
                        {
                            "roworder" :{
                                "$lte" : realto
                            }
                        },
                    ]
                }

            mydict11 = {
                "$inc" : {
                    "roworder": numplus
                }
            }

            flag = col.update_many(query11, mydict11)
            print("pipeline4", query11, mydict11)

            query = {'symbolname':data['fromsymbolname']}
            mydict = {"$set":{"roworder":orderto}}            
            col.update(query, mydict, True)            
            return {
                'result' : 'ok',
                'timestamp' : datetime.now().timestamp(),
            }

        except:
            return {
                'result' : 'failed',
                'timestamp' : datetime.now().timestamp()
            }   
