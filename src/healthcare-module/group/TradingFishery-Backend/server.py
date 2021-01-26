from flask import Flask,jsonify, request, flash, redirect, url_for
from werkzeug.utils import secure_filename

from flask_restful import Api
from flask_jwt_extended import JWTManager

from model import users,stockInfo,stockData,watchlist,db,watchlistTemplate
import resources
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app)
UPLOAD_FOLDER = '/path/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app.config['JWT_SECRET_KEY'] = 'Hero-Hazan-Trading-Watchlist'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
jwt=JWTManager(app)

uploads_dir = os.path.join(app.instance_path, 'uploads')
os.makedirs(uploads_dir, exist_ok=True)
print(uploads_dir)

@app.route('/')
def index():
    return jsonify({"message" : "hello, this is server :)"})

api.add_resource(resources.ResetPassword, '/api/resetpassword')
api.add_resource(resources.GetTokenForgetPassword, '/api/gettoken')
api.add_resource(resources.SetActive, '/api/setactive')
api.add_resource(resources.SaveImages, '/api/saveimages')
api.add_resource(resources.UserRegistration, '/api/register')
api.add_resource(resources.UserLogin, '/api/login')
api.add_resource(resources.UserLogout, '/api/logout')
api.add_resource(resources.ValidWatchlist, '/api/validwatchlist')
api.add_resource(resources.GetUserData, '/api/getuserdata')
api.add_resource(resources.GetStockdata, '/api/stockdata')
api.add_resource(resources.ImportWatchlist, '/api/importwatchlist')
api.add_resource(resources.UpdateWatchlist, '/api/updatewatchlist')
api.add_resource(resources.DeleteWatchlist, '/api/deletewatchlist')
api.add_resource(resources.GetWatchlist, '/api/getwatchlist')
api.add_resource(resources.GetSymbollist, '/api/getsymbollist')
api.add_resource(resources.GetSector, '/api/getsector')
api.add_resource(resources.GetAllSymbollist, '/api/getallsymbolist')
api.add_resource(resources.ChangeViewStatus, '/api/changeviewstatus')
api.add_resource(resources.GetCurrentStockPrice, '/api/currentprice')
api.add_resource(resources.ImportWatchlisttemplate, '/api/importwatchlisttemplate')
api.add_resource(resources.GetWatchlisttemplate, '/api/getwatchlisttemplate')
api.add_resource(resources.UpdateWatchlisttemplate, '/api/updatewatchlisttemplate')
api.add_resource(resources.UpdateProfile, '/api/updateprofile')
api.add_resource(resources.GetGlobalWatchlist, '/api/getglobalwatchlist')
api.add_resource(resources.ImportShareWatchlisttemplate, '/api/importsharewatchlisttemplate')
api.add_resource(resources.GetShareWatchlisttemplate, '/api/getsharewatchlisttemplate')
api.add_resource(resources.UpdateShareWatchlisttemplate, '/api/updatesharewatchlisttemplate')

api.add_resource(resources.GetGlobalFollowersList, '/api/getglobalfollowerslist')
api.add_resource(resources.SearchGlobalFollowers, '/api/searchglobalfollowers')
api.add_resource(resources.GetFollowersList, '/api/getfollowerslist')
api.add_resource(resources.GetFollowedList, '/api/getfollowedlist')
api.add_resource(resources.RemoveFollower, '/api/deletefollower')
api.add_resource(resources.SetFollowers, '/api/setfollowers')
api.add_resource(resources.GetFollowers, '/api/getfollowers')
api.add_resource(resources.GetEarningStocks, '/api/getearningstocks')
api.add_resource(resources.GetTopStocks, '/api/gettopstocks')
api.add_resource(resources.GetShortLong, '/api/getshortlong')
api.add_resource(resources.GetTopStocksForShortLong, '/api/gettopstocksforshortlong')
api.add_resource(resources.GetContacts, '/api/getcontacts')
api.add_resource(resources.SetContacts, '/api/setcontacts')
api.add_resource(resources.SaveChat, '/api/importchat')
api.add_resource(resources.SaveContact, '/api/savecontact')
api.add_resource(resources.GetChat, '/api/getchat')
api.add_resource(resources.ReadChat, '/api/readchat')
api.add_resource(resources.GetChatForNotification, '/api/getchatfornotification')
api.add_resource(resources.DeleteChat, '/api/deletechat')
api.add_resource(resources.GetOwnContacts, '/api/getowncontacts')
api.add_resource(resources.SetShareMethod, '/api/setsharemethod')
api.add_resource(resources.GetShareMethod, '/api/getsharemethod')
api.add_resource(resources.DeleteUserInContact, '/api/deleteuserincontact')
api.add_resource(resources.ValidGroupUser, '/api/validgroupuser')

api.add_resource(resources.AdminGetUserList, '/api/admingetuserlist')
api.add_resource(resources.DeleteUser, '/api/deleteuser')

api.add_resource(resources.ActiveVerify, '/api/activeverify')
api.add_resource(resources.ResendCode, '/api/resendcode')

api.add_resource(resources.SendMessageToAdmin, '/api/sendmessagetoadmin')

api.add_resource(resources.GetCurrentUsersNumber, '/api/getcurrentusersnumber')
api.add_resource(resources.GetLogedUsersNumber, '/api/getlogedusersnumber')
api.add_resource(resources.GetTotalUsersNumber, '/api/gettotalusersnumber')
api.add_resource(resources.SetStockPriceIntervalTime, '/api/setstockpriceintervaltime')
api.add_resource(resources.GetStockPriceIntervalTime, '/api/getstockpriceintervaltime')
api.add_resource(resources.GetHistoricalPrice, '/api/gethistoricalprice')
api.add_resource(resources.GetSymbolLists, '/api/getsymbollists')
api.add_resource(resources.SaveRowOrder, '/api/saveroworder')


if __name__ == "__main__":
    app.debug = True
    app.run(host='localhost', port=5000)
    #app.run(host='204.93.169.118', port=5000)
